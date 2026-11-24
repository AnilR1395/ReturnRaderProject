// server/routes/store.js - Flipkart Storefront, Cart, Orders & Payment Deadlines
const { getDb } = require('../db');
const { randomUUID } = require('node:crypto');

function registerStoreRoutes(app) {
  const db = getDb();

  // GET /api/products - List products with category, search and sort filters
  app.get('/api/products', (req, res) => {
    try {
      const { category, search, sort, min_price, max_price, assured } = req.query || {};

      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'All') {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        sql += ' AND (title LIKE ? OR brand LIKE ? OR description LIKE ?)';
        const queryTerm = `%${search.trim()}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }

      if (assured === '1' || assured === 'true') {
        sql += ' AND is_assured = 1';
      }

      if (min_price) {
        sql += ' AND price >= ?';
        params.push(parseFloat(min_price));
      }

      if (max_price) {
        sql += ' AND price <= ?';
        params.push(parseFloat(max_price));
      }

      if (sort === 'price_asc') {
        sql += ' ORDER BY price ASC';
      } else if (sort === 'price_desc') {
        sql += ' ORDER BY price DESC';
      } else if (sort === 'discount') {
        sql += ' ORDER BY discount_percent DESC';
      } else if (sort === 'rating') {
        sql += ' ORDER BY rating DESC';
      } else {
        sql += ' ORDER BY created_at DESC';
      }

      const products = db.prepare(sql).all(...params);
      res.json({ products, total: products.length });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
    }
  });

  // GET /api/products/:id - Single product details
  app.get('/api/products/:id', (req, res) => {
    try {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ product });
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // GET /api/orders - List orders for the current user with countdowns & statuses
  app.get('/api/orders', (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'usr-rahul';
      const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);

      const now = new Date();

      const enrichedOrders = orders.map(order => {
        let items = [];
        try {
          items = JSON.parse(order.items);
        } catch (e) {
          items = [];
        }

        // Calculate payment deadline details
        let paymentDeadlineRemainingHours = null;
        let isPaymentExpired = false;
        if (order.payment_status === 'PENDING' && order.payment_deadline) {
          const deadline = new Date(order.payment_deadline);
          const diffMs = deadline.getTime() - now.getTime();
          paymentDeadlineRemainingHours = (diffMs / (1000 * 60 * 60)).toFixed(1);
          isPaymentExpired = diffMs <= 0;
        }

        // Calculate return window details
        let returnWindowRemainingDays = null;
        let isReturnExpired = false;
        if (order.order_status === 'DELIVERED' && order.return_deadline) {
          const retDeadline = new Date(order.return_deadline);
          const diffMs = retDeadline.getTime() - now.getTime();
          returnWindowRemainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          isReturnExpired = diffMs <= 0;
        }

        return {
          ...order,
          items,
          paymentDeadlineRemainingHours: paymentDeadlineRemainingHours ? parseFloat(paymentDeadlineRemainingHours) : null,
          isPaymentExpired,
          returnWindowRemainingDays,
          isReturnExpired
        };
      });

      // Find if there is an active pending payment order for top alert banner
      const activePendingPaymentOrder = enrichedOrders.find(o => o.payment_status === 'PENDING' && !o.isPaymentExpired);

      res.json({
        orders: enrichedOrders,
        activePendingPaymentOrder: activePendingPaymentOrder || null,
        total: enrichedOrders.length
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders: ' + err.message });
    }
  });

  // GET /api/orders/:id - Get specific order details
  app.get('/api/orders/:id', (req, res) => {
    try {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      let items = [];
      try {
        items = JSON.parse(order.items);
      } catch (e) {
        items = [];
      }

      res.json({ order: { ...order, items } });
    } catch (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // POST /api/orders - Place a new order from cart
  app.post('/api/orders', (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'usr-rahul';
      const { items, shipping_address, payment_method, reserve_hours } = req.body || {};

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Please add items to place order.' });
      }

      let totalAmount = 0;
      let originalMrpTotal = 0;
      let maxReturnPolicyDays = 7;

      for (const item of items) {
        const qty = item.quantity || 1;
        totalAmount += (item.price * qty);
        originalMrpTotal += ((item.original_mrp || item.price) * qty);
        if (item.return_policy_days && item.return_policy_days > maxReturnPolicyDays) {
          maxReturnPolicyDays = item.return_policy_days;
        }
      }

      const discountAmount = originalMrpTotal - totalAmount;
      const orderId = `ord-${randomUUID().slice(0, 8)}`;
      const randomOrderNum = `OD${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const now = new Date();

      const isReservePayLater = (payment_method === 'Reserve & Pay Later');
      const paymentStatus = isReservePayLater ? 'PENDING' : 'PAID';
      const orderStatus = isReservePayLater ? 'PAYMENT_PENDING' : 'CONFIRMED';

      // Set payment deadline: default 24 hours (or user specified)
      let paymentDeadline = null;
      if (isReservePayLater) {
        const hours = reserve_hours || 24;
        paymentDeadline = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
      }

      // Expected delivery: 2 days from now
      const deliveryDateObj = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      const deliveryDateStr = deliveryDateObj.toISOString().slice(0, 10);

      // Return deadline: delivery date + return_policy_days
      const returnDeadlineObj = new Date(deliveryDateObj.getTime() + maxReturnPolicyDays * 24 * 60 * 60 * 1000);
      const returnDeadlineStr = returnDeadlineObj.toISOString().slice(0, 10);

      const trackingNumber = `RDEX${Math.floor(100000000 + Math.random() * 900000000)}`;
      const carrier = 'Radar Express';

      // Synchronize with ReturnRadar Purchase database
      const purchaseId = `pur-rs-${randomUUID().slice(0, 8)}`;
      const mainItemTitle = items.length === 1
        ? items[0].title
        : `${items[0].title} (+${items.length - 1} more items)`;

      const purchaseDateStr = now.toISOString().slice(0, 10);

      // Auto-create purchase in ReturnRadar
      const insertPurchase = db.prepare(`
        INSERT INTO purchases (
          id, product_name, retailer, purchase_date, return_policy_days,
          delivery_date, return_deadline, price, order_number, notes,
          category, status, return_tracking_number, return_carrier, image_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertPurchase.run(
        purchaseId,
        mainItemTitle,
        'RadarStore',
        purchaseDateStr,
        maxReturnPolicyDays,
        deliveryDateStr,
        returnDeadlineStr,
        totalAmount,
        randomOrderNum,
        `Ordered via RadarStore Marketplace. Payment: ${payment_method}. Delivery via ${carrier}.`,
        items[0].category || 'Electronics',
        isReservePayLater ? 'CONSIDERING' : 'KEEP',
        trackingNumber,
        carrier,
        items[0].image_url || '/images/products/dell_monitor.svg',
        now.toISOString(),
        now.toISOString()
      );

      // Insert Order
      const insertOrder = db.prepare(`
        INSERT INTO orders (
          id, order_number, user_id, items, total_amount, original_mrp_total, discount_amount,
          payment_status, payment_method, payment_deadline, payment_deadline_alert_sent,
          order_status, delivery_date, shipping_address, tracking_number, carrier,
          return_deadline, return_policy_days, purchase_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertOrder.run(
        orderId,
        randomOrderNum,
        userId,
        JSON.stringify(items),
        totalAmount,
        originalMrpTotal,
        discountAmount,
        paymentStatus,
        payment_method || 'UPI / Card',
        paymentDeadline,
        0,
        orderStatus,
        deliveryDateStr,
        shipping_address || 'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103',
        trackingNumber,
        carrier,
        returnDeadlineStr,
        maxReturnPolicyDays,
        purchaseId,
        now.toISOString(),
        now.toISOString()
      );

      // If Reserve & Pay Later: generate high urgency notification
      if (isReservePayLater) {
        db.prepare(`
          INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          `notif-${randomUUID().slice(0, 8)}`,
          purchaseId,
          `⏰ Urgent: Payment Deadline for Order #${randomOrderNum}`,
          `Payment of $${totalAmount.toFixed(2)} is pending. Complete payment before the deadline to lock your purchase and 7-day return policy!`,
          'critical',
          0,
          now.toISOString()
        );
      } else {
        db.prepare(`
          INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          `notif-${randomUUID().slice(0, 8)}`,
          purchaseId,
          `🎉 Order Confirmed: #${randomOrderNum}`,
          `Your order for ${mainItemTitle} is confirmed! Estimated delivery: ${deliveryDateStr}. Track your return window on ReturnRadar.`,
          'info',
          0,
          now.toISOString()
        );
      }

      const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

      res.status(201).json({
        success: true,
        message: isReservePayLater
          ? `Order reserved! Complete payment before deadline to guarantee stock.`
          : `Order placed successfully! Order #${randomOrderNum}`,
        order: {
          ...createdOrder,
          items
        },
        purchase_id: purchaseId
      });
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Failed to place order: ' + err.message });
    }
  });

  // POST /api/orders/:id/pay - Complete pending payment
  app.post('/api/orders/:id/pay', (req, res) => {
    try {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const now = new Date();
      db.prepare(`
        UPDATE orders
        SET payment_status = 'PAID',
            order_status = 'CONFIRMED',
            payment_deadline = NULL,
            updated_at = ?
        WHERE id = ?
      `).run(now.toISOString(), order.id);

      // Create confirmation notification
      db.prepare(`
        INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `notif-${randomUUID().slice(0, 8)}`,
        order.purchase_id,
        `✅ Payment Received: Order #${order.order_number}`,
        `Payment of $${order.total_amount.toFixed(2)} received successfully! Order is now confirmed and dispatched for shipping.`,
        'success',
        0,
        now.toISOString()
      );

      const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
      let items = [];
      try { items = JSON.parse(updated.items); } catch(e){}

      res.json({
        success: true,
        message: `Payment of $${order.total_amount.toFixed(2)} completed successfully!`,
        order: { ...updated, items }
      });
    } catch (err) {
      console.error('Error paying order:', err);
      res.status(500).json({ error: 'Failed to complete payment: ' + err.message });
    }
  });

  // POST /api/orders/:id/return - Request return/replacement from Flipkart Orders
  app.post('/api/orders/:id/return', (req, res) => {
    try {
      const { reason, comments, refund_method } = req.body || {};
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const now = new Date();

      db.prepare(`
        UPDATE orders
        SET order_status = 'RETURN_INITIATED',
            updated_at = ?
        WHERE id = ?
      `).run(now.toISOString(), order.id);

      // Synchronize linked purchase status in ReturnRadar
      if (order.purchase_id) {
        db.prepare(`
          UPDATE purchases
          SET status = 'RETURN_REQUESTED',
              notes = notes || '\n[RadarStore Return Requested: ' || ? || ']',
              updated_at = ?
          WHERE id = ?
        `).run(reason || 'Customer Return', now.toISOString(), order.purchase_id);
      }

      // Add notification
      db.prepare(`
        INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `notif-${randomUUID().slice(0, 8)}`,
        order.purchase_id,
        `🔄 Return Requested for Order #${order.order_number}`,
        `Return pickup scheduled. Reason: ${reason || 'Return initiated'}. Refund of $${order.total_amount.toFixed(2)} will be credited to ${refund_method || 'original payment method'}.`,
        'warning',
        0,
        now.toISOString()
      );

      const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
      let items = [];
      try { items = JSON.parse(updated.items); } catch(e){}

      res.json({
        success: true,
        message: `Return request submitted for Order #${order.order_number}! Pickup will be initiated within 24-48 hours.`,
        order: { ...updated, items }
      });
    } catch (err) {
      console.error('Error processing return:', err);
      res.status(500).json({ error: 'Failed to submit return request: ' + err.message });
    }
  });

  // POST /api/orders/:id/advance-status - Demo helper to cycle order statuses
  app.post('/api/orders/:id/advance-status', (req, res) => {
    try {
      const { targetStatus } = req.body || {};
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const statusSequence = ['PAYMENT_PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_INITIATED', 'REFUNDED'];
      let next = targetStatus;

      if (!next) {
        const curIdx = statusSequence.indexOf(order.order_status);
        next = curIdx !== -1 && curIdx < statusSequence.length - 1 ? statusSequence[curIdx + 1] : statusSequence[0];
      }

      const now = new Date();
      let paymentStatus = order.payment_status;
      if (next !== 'PAYMENT_PENDING' && paymentStatus === 'PENDING') {
        paymentStatus = 'PAID';
      }

      db.prepare(`
        UPDATE orders
        SET order_status = ?,
            payment_status = ?,
            updated_at = ?
        WHERE id = ?
      `).run(next, paymentStatus, now.toISOString(), order.id);

      // Sync with purchase status if linked
      if (order.purchase_id) {
        let pStatus = 'DELIVERY_PENDING';
        if (next === 'DELIVERED') pStatus = 'KEEP';
        if (next === 'RETURN_INITIATED') pStatus = 'RETURN_REQUESTED';
        if (next === 'REFUNDED') pStatus = 'REFUNDED';

        db.prepare('UPDATE purchases SET status = ?, updated_at = ? WHERE id = ?')
          .run(pStatus, now.toISOString(), order.purchase_id);
      }

      const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(order.id);
      let items = [];
      try { items = JSON.parse(updated.items); } catch(e){}

      res.json({
        success: true,
        order: { ...updated, items }
      });
    } catch (err) {
      console.error('Error advancing order status:', err);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });
}

module.exports = {
  registerStoreRoutes
};
