// server/routes/notifications.js - Alert center & demo seed trigger
const { getDb } = require('../db');
const { resetDatabase } = require('../seedData');

function registerNotificationRoutes(app) {
  // GET /api/notifications
  app.get('/api/notifications', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all();
    const unreadCount = rows.filter(n => !n.is_read).length;
    res.json({ notifications: rows, unread_count: unreadCount });
  });

  // POST /api/notifications/:id/read
  app.post('/api/notifications/:id/read', (req, res) => {
    const db = getDb();
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // POST /api/notifications/mark-all-read
  app.post('/api/notifications/mark-all-read', (req, res) => {
    const db = getDb();
    db.prepare('UPDATE notifications SET is_read = 1').run();
    res.json({ success: true });
  });

  // POST /api/seed - Reset & re-seed realistic sample data
  app.post('/api/seed', (req, res) => {
    const db = getDb();
    resetDatabase(db);
    res.json({ success: true, message: 'Database successfully reseeded with rich realistic data' });
  });
}

module.exports = {
  registerNotificationRoutes
};
