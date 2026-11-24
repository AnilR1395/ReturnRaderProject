// server/routes/purchases.js - CRUD & status management for purchases
const { randomUUID } = require('node:crypto');
const { getDb } = require('../db');
const {
  getTodayString,
  calculateDaysRemaining,
  getUrgencyLevel,
  calculateDeadline,
  isRefundOverdue
} = require('../utils/dateUtils');

function enrichPurchase(p) {
  const daysRemaining = calculateDaysRemaining(p.return_deadline);
  const urgencyLevel = getUrgencyLevel(p.status, daysRemaining);
  const refundOverdue = isRefundOverdue(p);

  let expected = p.expected_refund_amount !== null && p.expected_refund_amount !== undefined
    ? Number(p.expected_refund_amount)
    : Number(p.price) - (Number(p.return_shipping_cost) || 0) - (Number(p.restocking_fee) || 0);

  let discrepancy = 0;
  if (p.actual_refund_amount !== null && p.actual_refund_amount !== undefined) {
    discrepancy = Number(p.actual_refund_amount) - expected;
  }

  let tagsArray = [];
  try {
    tagsArray = typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || []);
  } catch (e) {
    tagsArray = [];
  }

  let timelineArray = [];
  try {
    timelineArray = typeof p.timeline === 'string' ? JSON.parse(p.timeline) : (p.timeline || []);
  } catch (e) {
    timelineArray = [];
  }

  // Brand logo resolution
  const retClean = (p.retailer || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const retailerLogo = `/images/retailers/${retClean}.svg`;

  // Carrier logo resolution
  let carrierClean = 'instore';
  if (p.return_carrier) {
    const c = p.return_carrier.toLowerCase();
    if (c.includes('ups')) carrierClean = 'ups';
    else if (c.includes('fedex')) carrierClean = 'fedex';
    else if (c.includes('usps')) carrierClean = 'usps';
    else if (c.includes('dhl')) carrierClean = 'dhl';
  }
  const carrierLogo = `/images/carriers/${carrierClean}.svg`;

  return {
    ...p,
    days_remaining: daysRemaining,
    urgency_level: urgencyLevel,
    is_refund_overdue: refundOverdue,
    expected_refund_amount: expected,
    discrepancy_amount: discrepancy,
    retailer_logo: retailerLogo,
    carrier_logo: carrierLogo,
    image_url: p.image_url || '/images/products/airpods_max.svg',
    tags: tagsArray,
    timeline: timelineArray
  };
}

function registerPurchaseRoutes(app) {
  // GET /api/purchases
  app.get('/api/purchases', (req, res) => {
    const db = getDb();
    let query = 'SELECT * FROM purchases WHERE 1=1';
    const params = [];

    if (req.query.status) {
      query += ' AND status = ?';
      params.push(req.query.status);
    }

    if (req.query.retailer) {
      query += ' AND retailer = ?';
      params.push(req.query.retailer);
    }

    if (req.query.category) {
      query += ' AND category = ?';
      params.push(req.query.category);
    }

    if (req.query.search) {
      query += ' AND (product_name LIKE ? OR retailer LIKE ? OR order_number LIKE ? OR notes LIKE ? OR tags LIKE ?)';
      const s = `%${req.query.search}%`;
      params.push(s, s, s, s, s);
    }

    const rows = db.prepare(query).all(...params);
    let enriched = rows.map(enrichPurchase);

    // Filter by urgency if requested
    if (req.query.urgency) {
      const u = req.query.urgency.toUpperCase();
      if (u === 'OVERDUE') {
        enriched = enriched.filter(p => p.is_refund_overdue);
      } else {
        enriched = enriched.filter(p => p.urgency_level === u);
      }
    }

    // Sort
    const sort = req.query.sort || 'deadline_asc';
    if (sort === 'deadline_asc') {
      enriched.sort((a, b) => {
        if (!a.return_deadline) return 1;
        if (!b.return_deadline) return -1;
        return a.return_deadline.localeCompare(b.return_deadline);
      });
    } else if (sort === 'deadline_desc') {
      enriched.sort((a, b) => (b.return_deadline || '').localeCompare(a.return_deadline || ''));
    } else if (sort === 'price_desc') {
      enriched.sort((a, b) => b.price - a.price);
    } else if (sort === 'price_asc') {
      enriched.sort((a, b) => a.price - b.price);
    } else if (sort === 'purchase_desc') {
      enriched.sort((a, b) => (b.purchase_date || '').localeCompare(a.purchase_date || ''));
    }

    res.json({ purchases: enriched, total: enriched.length });
  });

  // GET /api/purchases/:id
  app.get('/api/purchases/:id', (req, res) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json(enrichPurchase(row));
  });

  // POST /api/purchases
  app.post('/api/purchases', (req, res) => {
    const db = getDb();
    const b = req.body;

    if (!b.product_name || !b.retailer || b.price === undefined || b.price === null) {
      return res.status(400).json({ error: 'product_name, retailer, and price are required' });
    }

    const id = b.id || `pur-${randomUUID().slice(0, 8)}`;
    const purchaseDate = b.purchase_date || getTodayString();
    const policyDays = parseInt(b.return_policy_days, 10) || 30;
    
    // Auto-calculate deadline if not provided
    const baseDate = b.delivery_date || purchaseDate;
    const returnDeadline = b.return_deadline || calculateDeadline(baseDate, policyDays);

    const price = parseFloat(b.price) || 0;
    const returnShippingCost = parseFloat(b.return_shipping_cost) || 0;
    const restockingFee = parseFloat(b.restocking_fee) || 0;
    const expectedRefund = b.expected_refund_amount !== undefined
      ? parseFloat(b.expected_refund_amount)
      : Math.max(0, price - returnShippingCost - restockingFee);

    const now = new Date().toISOString();
    const initialTimeline = JSON.stringify([
      { date: purchaseDate, title: 'Purchased', note: `Acquired from ${b.retailer}` }
    ]);

    const tags = Array.isArray(b.tags) ? JSON.stringify(b.tags) : (typeof b.tags === 'string' ? b.tags : '[]');

    const stmt = db.prepare(`
      INSERT INTO purchases (
        id, product_name, retailer, order_number, price, currency,
        purchase_date, delivery_date, return_policy_days, return_deadline,
        status, category, payment_method, refund_method, expected_refund_amount,
        actual_refund_amount, refund_received_date, return_method, return_tracking_number,
        return_carrier, return_reason, return_shipping_cost, restocking_fee,
        condition_required, receipt_url, return_label_url, image_url, notes, tags, timeline,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    stmt.run(
      id,
      b.product_name,
      b.retailer,
      b.order_number || '',
      price,
      b.currency || 'USD',
      purchaseDate,
      b.delivery_date || null,
      policyDays,
      returnDeadline,
      b.status || 'CONSIDERING',
      b.category || 'Other',
      b.payment_method || 'Credit Card',
      b.refund_method || 'Original Payment',
      expectedRefund,
      b.actual_refund_amount || null,
      b.refund_received_date || null,
      b.return_method || '',
      b.return_tracking_number || null,
      b.return_carrier || null,
      b.return_reason || null,
      returnShippingCost,
      restockingFee,
      b.condition_required || '',
      b.receipt_url || null,
      b.return_label_url || null,
      b.image_url || null,
      b.notes || '',
      tags,
      initialTimeline,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM purchases WHERE id = ?').get(id);
    const enriched = enrichPurchase(created);

    // If critical right away, create notification
    if (enriched.urgency_level === 'CRITICAL') {
      db.prepare(`
        INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `notif-${randomUUID().slice(0, 8)}`,
        id,
        `⚠️ Approaching Deadline: ${b.product_name}`,
        `Return deadline is in ${enriched.days_remaining} day(s) for ${b.retailer}!`,
        'critical',
        0,
        now
      );
    }

    res.status(201).json(enriched);
  });

  // PUT /api/purchases/:id
  app.put('/api/purchases/:id', (req, res) => {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const b = req.body;
    const now = new Date().toISOString();

    const tags = Array.isArray(b.tags) ? JSON.stringify(b.tags) : (b.tags !== undefined ? b.tags : existing.tags);
    const timeline = Array.isArray(b.timeline) ? JSON.stringify(b.timeline) : (b.timeline !== undefined ? b.timeline : existing.timeline);

    const stmt = db.prepare(`
      UPDATE purchases SET
        product_name = ?, retailer = ?, order_number = ?, price = ?, currency = ?,
        purchase_date = ?, delivery_date = ?, return_policy_days = ?, return_deadline = ?,
        status = ?, category = ?, payment_method = ?, refund_method = ?, expected_refund_amount = ?,
        actual_refund_amount = ?, refund_received_date = ?, return_method = ?, return_tracking_number = ?,
        return_carrier = ?, return_reason = ?, return_shipping_cost = ?, restocking_fee = ?,
        condition_required = ?, receipt_url = ?, return_label_url = ?, image_url = ?, notes = ?, tags = ?, timeline = ?,
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      b.product_name !== undefined ? b.product_name : existing.product_name,
      b.retailer !== undefined ? b.retailer : existing.retailer,
      b.order_number !== undefined ? b.order_number : existing.order_number,
      b.price !== undefined ? parseFloat(b.price) : existing.price,
      b.currency !== undefined ? b.currency : existing.currency,
      b.purchase_date !== undefined ? b.purchase_date : existing.purchase_date,
      b.delivery_date !== undefined ? b.delivery_date : existing.delivery_date,
      b.return_policy_days !== undefined ? parseInt(b.return_policy_days, 10) : existing.return_policy_days,
      b.return_deadline !== undefined ? b.return_deadline : existing.return_deadline,
      b.status !== undefined ? b.status : existing.status,
      b.category !== undefined ? b.category : existing.category,
      b.payment_method !== undefined ? b.payment_method : existing.payment_method,
      b.refund_method !== undefined ? b.refund_method : existing.refund_method,
      b.expected_refund_amount !== undefined ? parseFloat(b.expected_refund_amount) : existing.expected_refund_amount,
      b.actual_refund_amount !== undefined ? parseFloat(b.actual_refund_amount) : existing.actual_refund_amount,
      b.refund_received_date !== undefined ? b.refund_received_date : existing.refund_received_date,
      b.return_method !== undefined ? b.return_method : existing.return_method,
      b.return_tracking_number !== undefined ? b.return_tracking_number : existing.return_tracking_number,
      b.return_carrier !== undefined ? b.return_carrier : existing.return_carrier,
      b.return_reason !== undefined ? b.return_reason : existing.return_reason,
      b.return_shipping_cost !== undefined ? parseFloat(b.return_shipping_cost) : existing.return_shipping_cost,
      b.restocking_fee !== undefined ? parseFloat(b.restocking_fee) : existing.restocking_fee,
      b.condition_required !== undefined ? b.condition_required : existing.condition_required,
      b.receipt_url !== undefined ? b.receipt_url : existing.receipt_url,
      b.return_label_url !== undefined ? b.return_label_url : existing.return_label_url,
      b.image_url !== undefined ? b.image_url : existing.image_url,
      b.notes !== undefined ? b.notes : existing.notes,
      tags,
      timeline,
      now,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    res.json(enrichPurchase(updated));
  });

  // POST /api/purchases/:id/status (Quick transition)
  app.post('/api/purchases/:id/status', (req, res) => {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const { status, note, carrier, tracking_number } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    let timeline = [];
    try {
      timeline = JSON.parse(existing.timeline || '[]');
    } catch (e) {
      timeline = [];
    }

    const today = getTodayString();
    let eventTitle = `Status changed to ${status}`;
    if (status === 'INITIATED') eventTitle = 'Return Initiated';
    if (status === 'DROPPED_OFF') eventTitle = 'Dropped Off at Carrier / Store';
    if (status === 'DELIVERED_TO_SELLER') eventTitle = 'Delivered to Seller Warehouse';
    if (status === 'REFUND_PENDING') eventTitle = 'Refund Pending Processing';
    if (status === 'REFUNDED') eventTitle = 'Refund Processed & Resolved';
    if (status === 'KEEP') eventTitle = 'Marked as Decided to Keep';
    if (status === 'DISPUTED') eventTitle = 'Dispute / Discrepancy Flagged';

    timeline.push({
      date: today,
      title: eventTitle,
      note: note || `Updated via ReturnRadar dashboard`
    });

    const now = new Date().toISOString();
    let carrierVal = carrier !== undefined ? carrier : existing.return_carrier;
    let trackingVal = tracking_number !== undefined ? tracking_number : existing.return_tracking_number;

    db.prepare(`
      UPDATE purchases SET
        status = ?,
        return_carrier = ?,
        return_tracking_number = ?,
        timeline = ?,
        updated_at = ?
      WHERE id = ?
    `).run(status, carrierVal, trackingVal, JSON.stringify(timeline), now, req.params.id);

    const updated = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    res.json(enrichPurchase(updated));
  });

  // POST /api/purchases/:id/refund (Log completed refund & check discrepancy)
  app.post('/api/purchases/:id/refund', (req, res) => {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const { actual_refund_amount, refund_received_date, refund_method, note } = req.body;
    const actual = parseFloat(actual_refund_amount);
    const date = refund_received_date || getTodayString();
    const method = refund_method || existing.refund_method || 'Original Payment';

    let timeline = [];
    try {
      timeline = JSON.parse(existing.timeline || '[]');
    } catch (e) {
      timeline = [];
    }

    const expected = existing.expected_refund_amount || existing.price;
    const discrepancy = actual - expected;
    let newStatus = 'REFUNDED';
    let timelineNote = note || `Refund of $${actual.toFixed(2)} received via ${method}.`;

    if (discrepancy < -1.0) {
      // Discrepancy detected! Under-refunded
      newStatus = 'DISPUTED';
      timelineNote += ` Alert: Discrepancy of -$${Math.abs(discrepancy).toFixed(2)} detected below expected amount ($${expected.toFixed(2)}).`;
    }

    timeline.push({
      date,
      title: 'Refund Recorded',
      note: timelineNote
    });

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE purchases SET
        status = ?,
        actual_refund_amount = ?,
        refund_received_date = ?,
        refund_method = ?,
        timeline = ?,
        updated_at = ?
      WHERE id = ?
    `).run(newStatus, actual, date, method, JSON.stringify(timeline), now, req.params.id);

    const updated = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    res.json(enrichPurchase(updated));
  });

  // DELETE /api/purchases/:id
  app.delete('/api/purchases/:id', (req, res) => {
    const db = getDb();
    const result = db.prepare('DELETE FROM purchases WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.json({ success: true, message: 'Purchase deleted' });
  });
}

module.exports = {
  registerPurchaseRoutes,
  enrichPurchase
};
