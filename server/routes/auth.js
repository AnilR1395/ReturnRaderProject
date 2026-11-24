// server/routes/auth.js - Authentication & Profile API for RadarStore
const { getDb } = require('../db');
const { randomUUID } = require('node:crypto');

function registerAuthRoutes(app) {
  const db = getDb();

  // GET /api/auth/me - Return current user profile
  app.get('/api/auth/me', (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'usr-rahul';
      const user = db.prepare('SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users WHERE id = ?').get(userId);
      
      if (!user) {
        // Fallback to first user
        const firstUser = db.prepare('SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users LIMIT 1').get();
        if (firstUser) {
          return res.json({ user: firstUser });
        }
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (err) {
      console.error('Error fetching current user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/auth/login - Log in with email/phone & password/OTP
  app.post('/api/auth/login', (req, res) => {
    try {
      const { emailOrPhone, password, otp } = req.body || {};

      if (!emailOrPhone) {
        return res.status(400).json({ error: 'Email or phone number is required' });
      }

      // Find user matching email or phone
      const query = emailOrPhone.includes('@')
        ? 'SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users WHERE email = ? COLLATE NOCASE'
        : 'SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users WHERE phone = ?';

      let user = db.prepare(query).get(emailOrPhone.trim());

      // If user doesn't exist, auto-register for seamless experience
      if (!user) {
        const newId = `usr-${randomUUID().slice(0, 8)}`;
        const isEmail = emailOrPhone.includes('@');
        const defaultName = isEmail ? emailOrPhone.split('@')[0] : 'Radar Shopper';
        const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
        
        db.prepare(`
          INSERT INTO users (id, name, email, phone, password, avatar, address, is_plus_member, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          newId,
          formattedName,
          isEmail ? emailOrPhone.trim() : `${newId}@radarstore.com`,
          !isEmail ? emailOrPhone.trim() : '+91 98765 43210',
          password || 'password123',
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedName}`,
          'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103',
          1,
          new Date().toISOString()
        );

        user = db.prepare('SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users WHERE id = ?').get(newId);
      }

      res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user,
        token: `demo-token-${user.id}`
      });
    } catch (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Failed to authenticate: ' + err.message });
    }
  });

  // POST /api/auth/register - Create a new user account
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, phone, password, address } = req.body || {};

      if (!name || (!email && !phone)) {
        return res.status(400).json({ error: 'Name and email or phone are required' });
      }

      const existing = db.prepare('SELECT id FROM users WHERE (email = ? AND email IS NOT NULL) OR (phone = ? AND phone IS NOT NULL)').get(email || '', phone || '');
      if (existing) {
        return res.status(400).json({ error: 'An account with this email or phone already exists' });
      }

      const id = `usr-${randomUUID().slice(0, 8)}`;
      db.prepare(`
        INSERT INTO users (id, name, email, phone, password, avatar, address, is_plus_member, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        name.trim(),
        email ? email.trim() : null,
        phone ? phone.trim() : null,
        password || 'pass123',
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
        address || 'Bangalore, Karnataka, India - 560001',
        1,
        new Date().toISOString()
      );

      const user = db.prepare('SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users WHERE id = ?').get(id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user,
        token: `demo-token-${user.id}`
      });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Failed to create account: ' + err.message });
    }
  });

  // GET /api/auth/users - List available demo users
  app.get('/api/auth/users', (req, res) => {
    try {
      const users = db.prepare('SELECT id, name, email, phone, avatar, address, is_plus_member, created_at FROM users ORDER BY created_at ASC').all();
      res.json({ users });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = {
  registerAuthRoutes
};
