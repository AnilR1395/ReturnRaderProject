// server/db.js - SQLite Database setup & helpers using Node.js built-in DatabaseSync
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'returnradar.db');

// Ensure data folder exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    initSchema(db);
  }
  return db;
}

function initSchema(database) {
  // 1. Purchases table
  database.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      retailer TEXT NOT NULL,
      order_number TEXT,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      purchase_date TEXT NOT NULL,
      delivery_date TEXT,
      return_policy_days INTEGER NOT NULL DEFAULT 30,
      return_deadline TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'CONSIDERING',
      category TEXT DEFAULT 'Other',
      payment_method TEXT DEFAULT 'Credit Card',
      refund_method TEXT DEFAULT 'Original Payment',
      expected_refund_amount REAL,
      actual_refund_amount REAL,
      refund_received_date TEXT,
      return_method TEXT,
      return_tracking_number TEXT,
      return_carrier TEXT,
      return_reason TEXT,
      return_shipping_cost REAL DEFAULT 0,
      restocking_fee REAL DEFAULT 0,
      condition_required TEXT,
      receipt_url TEXT,
      return_label_url TEXT,
      image_url TEXT,
      notes TEXT,
      tags TEXT,
      timeline TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Ensure image_url column exists if table was already created
  try {
    database.exec('ALTER TABLE purchases ADD COLUMN image_url TEXT;');
  } catch (e) {
    // Column already exists, ignore
  }

  // 2. Retailers policy knowledge base
  database.exec(`
    CREATE TABLE IF NOT EXISTS retailers (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      return_days INTEGER NOT NULL,
      policy_type TEXT DEFAULT 'standard',
      free_returns INTEGER DEFAULT 1,
      return_shipping_fee REAL DEFAULT 0,
      restocking_fee_note TEXT,
      dropoff_locations TEXT,
      average_refund_days INTEGER DEFAULT 4,
      condition_notes TEXT,
      website TEXT,
      badge_color TEXT DEFAULT 'indigo'
    );
  `);

  // 3. Notifications table
  database.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      purchase_id TEXT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // 4. Dispute & Inquiry templates
  database.exec(`
    CREATE TABLE IF NOT EXISTS dispute_templates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL
    );
  `);

  // 5. Users table (Flipkart style login/profiles)
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT,
      avatar TEXT,
      address TEXT,
      is_plus_member INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // 6. Products catalog (Flipkart style store)
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      price REAL NOT NULL,
      original_mrp REAL NOT NULL,
      discount_percent INTEGER NOT NULL,
      rating REAL DEFAULT 4.5,
      rating_count INTEGER DEFAULT 1200,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      return_policy_days INTEGER DEFAULT 7,
      return_policy_type TEXT DEFAULT 'Replacement or Refund',
      stock INTEGER DEFAULT 50,
      is_assured INTEGER DEFAULT 1,
      description TEXT,
      delivery_time TEXT DEFAULT 'Tomorrow, by 11 PM',
      created_at TEXT NOT NULL
    );
  `);

  // 7. Orders table (Ordering, Payment Deadlines & Status Tracking)
  database.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL,
      original_mrp_total REAL NOT NULL,
      discount_amount REAL NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'PAID',
      payment_method TEXT NOT NULL,
      payment_deadline TEXT,
      payment_deadline_alert_sent INTEGER DEFAULT 0,
      order_status TEXT NOT NULL DEFAULT 'DELIVERED',
      delivery_date TEXT,
      shipping_address TEXT,
      tracking_number TEXT,
      carrier TEXT,
      return_deadline TEXT,
      return_policy_days INTEGER NOT NULL,
      purchase_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

module.exports = {
  getDb
};
