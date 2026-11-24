// server/routes/retailers.js - Retailer policy knowledge base routes
const { randomUUID } = require('node:crypto');
const { getDb } = require('../db');

function registerRetailerRoutes(app) {
  // GET /api/retailers
  app.get('/api/retailers', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM retailers ORDER BY name ASC').all();
    res.json({ retailers: rows });
  });

  // GET /api/retailers/:id
  app.get('/api/retailers/:id', (req, res) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM retailers WHERE id = ? OR name LIKE ?').get(
      req.params.id,
      `%${req.params.id}%`
    );
    if (!row) {
      return res.status(404).json({ error: 'Retailer policy not found' });
    }
    res.json(row);
  });

  // POST /api/retailers
  app.post('/api/retailers', (req, res) => {
    const db = getDb();
    const b = req.body;

    if (!b.name || !b.return_days) {
      return res.status(400).json({ error: 'name and return_days are required' });
    }

    const id = b.id || `ret-${b.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${randomUUID().slice(0, 4)}`;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO retailers (
        id, name, return_days, policy_type, free_returns, return_shipping_fee,
        restocking_fee_note, dropoff_locations, average_refund_days, condition_notes,
        website, badge_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      b.name,
      parseInt(b.return_days, 10),
      b.policy_type || 'standard',
      b.free_returns ? 1 : 0,
      parseFloat(b.return_shipping_fee) || 0,
      b.restocking_fee_note || '',
      b.dropoff_locations || 'Mail or Store',
      parseInt(b.average_refund_days, 10) || 5,
      b.condition_notes || '',
      b.website || '',
      b.badge_color || 'indigo'
    );

    const retailer = db.prepare('SELECT * FROM retailers WHERE id = ?').get(id);
    res.status(201).json(retailer);
  });
}

module.exports = {
  registerRetailerRoutes
};
