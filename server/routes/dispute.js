// server/routes/dispute.js - Dispute generator & customer service templates
const { getDb } = require('../db');
const { enrichPurchase } = require('./purchases');

function registerDisputeRoutes(app) {
  // GET /api/dispute-templates
  app.get('/api/dispute-templates', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM dispute_templates').all();
    res.json({ templates: rows });
  });

  // POST /api/dispute-generator
  app.post('/api/dispute-generator', (req, res) => {
    const db = getDb();
    const { purchase_id, template_id, customer_name, custom_reason } = req.body;

    if (!purchase_id) {
      return res.status(400).json({ error: 'purchase_id is required' });
    }

    const row = db.prepare('SELECT * FROM purchases WHERE id = ?').get(purchase_id);
    if (!row) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const purchase = enrichPurchase(row);
    
    // Pick template or default
    let tmpl;
    if (template_id) {
      tmpl = db.prepare('SELECT * FROM dispute_templates WHERE id = ?').get(template_id);
    }
    
    if (!tmpl) {
      // Auto-select template based on condition
      if (purchase.discrepancy_amount < -1) {
        tmpl = db.prepare('SELECT * FROM dispute_templates WHERE id = ?').get('tmpl-discrepancy');
      } else if (purchase.is_refund_overdue || purchase.status === 'REFUND_PENDING') {
        tmpl = db.prepare('SELECT * FROM dispute_templates WHERE id = ?').get('tmpl-overdue');
      } else if (purchase.urgency_level === 'EXPIRED') {
        tmpl = db.prepare('SELECT * FROM dispute_templates WHERE id = ?').get('tmpl-extension');
      } else {
        tmpl = db.prepare('SELECT * FROM dispute_templates WHERE id = ?').get('tmpl-carrier-lost');
      }
    }

    if (!tmpl) {
      tmpl = db.prepare('SELECT * FROM dispute_templates LIMIT 1').get();
    }

    // Get retailer info for average days
    const retailerInfo = db.prepare('SELECT * FROM retailers WHERE name = ?').get(purchase.retailer) || { average_refund_days: 5 };

    const custName = customer_name || 'Valued Customer';
    const discrepancy = Math.abs(purchase.discrepancy_amount).toFixed(2);
    const expected = (purchase.expected_refund_amount || purchase.price).toFixed(2);
    const actual = (purchase.actual_refund_amount || 0).toFixed(2);
    const price = purchase.price.toFixed(2);

    // Timeline analysis for delivery to warehouse
    let deliveryToSellerDate = purchase.delivery_date || 'recently';
    let dropoffDate = purchase.purchase_date;
    try {
      const events = purchase.timeline || [];
      const dropEv = events.find(e => e.title.toLowerCase().includes('drop'));
      if (dropEv) dropoffDate = dropEv.date;
      const delEv = events.find(e => e.title.toLowerCase().includes('delivered to'));
      if (delEv) deliveryToSellerDate = delEv.date;
    } catch (e) {
      // ignore
    }

    let generatedSubject = tmpl.subject
      .replace(/{ORDER_NUMBER}/g, purchase.order_number || 'N/A')
      .replace(/{TRACKING}/g, purchase.return_tracking_number || 'Pending Tracking')
      .replace(/{RETAILER}/g, purchase.retailer)
      .replace(/{PRODUCT_NAME}/g, purchase.product_name)
      .replace(/{DISCREPANCY_AMOUNT}/g, `$${discrepancy}`);

    let generatedBody = tmpl.body
      .replace(/{RETAILER}/g, purchase.retailer)
      .replace(/{ORDER_NUMBER}/g, purchase.order_number || 'N/A')
      .replace(/{PRODUCT_NAME}/g, purchase.product_name)
      .replace(/{PRICE}/g, `$${price}`)
      .replace(/{EXPECTED_REFUND}/g, `$${expected}`)
      .replace(/{ACTUAL_REFUND}/g, `$${actual}`)
      .replace(/{DISCREPANCY_AMOUNT}/g, `$${discrepancy}`)
      .replace(/{TRACKING}/g, purchase.return_tracking_number || 'Receipt Attached')
      .replace(/{CARRIER}/g, purchase.return_carrier || 'Designated Carrier')
      .replace(/{PAYMENT_METHOD}/g, purchase.payment_method || 'original payment method')
      .replace(/{DELIVERY_TO_SELLER_DATE}/g, deliveryToSellerDate)
      .replace(/{DROPOFF_DATE}/g, dropoffDate)
      .replace(/{AVG_DAYS}/g, String(retailerInfo.average_refund_days || 5))
      .replace(/{DAYS_ELAPSED}/g, '12')
      .replace(/{PURCHASE_DATE}/g, purchase.purchase_date)
      .replace(/{RETURN_DAYS}/g, String(purchase.return_policy_days))
      .replace(/{REASON}/g, custom_reason || 'unforeseen travel and delivery delays')
      .replace(/{ITEM_CONDITION}/g, 'brand new and unsealed in original retail packaging')
      .replace(/{RETURN_AUTH}/g, purchase.order_number ? `RMA-${purchase.order_number}` : 'N/A')
      .replace(/{CUSTOMER_NAME}/g, custName);

    res.json({
      template_id: tmpl.id,
      template_title: tmpl.title,
      subject: generatedSubject,
      body: generatedBody,
      retailer: purchase.retailer,
      order_number: purchase.order_number,
      tracking_number: purchase.return_tracking_number,
      discrepancy_amount: purchase.discrepancy_amount
    });
  });
}

module.exports = {
  registerDisputeRoutes
};
