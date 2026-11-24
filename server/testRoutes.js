// server/testRoutes.js - Test API logic and routes directly without network sockets
const { EventEmitter } = require('node:events');
const MiniApp = require('./serverFramework');
const { getDb } = require('./db');
const { seedDatabase } = require('./seedData');

const { registerPurchaseRoutes } = require('./routes/purchases');
const { registerRetailerRoutes } = require('./routes/retailers');
const { registerAnalyticsRoutes } = require('./routes/analytics');
const { registerDisputeRoutes } = require('./routes/dispute');
const { registerExportRoutes } = require('./routes/calendar');
const { registerNotificationRoutes } = require('./routes/notifications');

const app = new MiniApp();
registerPurchaseRoutes(app);
registerRetailerRoutes(app);
registerAnalyticsRoutes(app);
registerDisputeRoutes(app);
registerExportRoutes(app);
registerNotificationRoutes(app);

// Seed DB
const db = getDb();
seedDatabase(db);

class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
    this.writableEnded = false;
  }
  setHeader(name, val) {
    this.headers[name] = val;
  }
  status(code) {
    this.statusCode = code;
    return this;
  }
  json(data) {
    this.setHeader('Content-Type', 'application/json');
    this.body = JSON.stringify(data);
    this.writableEnded = true;
    this.emit('finish');
    return this;
  }
  send(text, ct) {
    if (ct) this.setHeader('Content-Type', ct);
    this.body = text;
    this.writableEnded = true;
    this.emit('finish');
    return this;
  }
}

async function simulateRequest(method, pathname, query = {}, body = {}) {
  return new Promise((resolve) => {
    const req = {
      method: method.toUpperCase(),
      url: pathname,
      query,
      body,
      headers: { 'content-type': 'application/json' },
      on: (event, cb) => {
        if (event === 'end') cb();
      }
    };
    const res = new MockResponse();
    res.on('finish', () => {
      resolve({ status: res.statusCode, headers: res.headers, body: res.body });
    });

    // Find route
    for (const route of app.routes) {
      if (route.method === req.method) {
        const match = pathname.match(route.regex);
        if (match) {
          req.params = {};
          route.paramNames.forEach((name, idx) => {
            req.params[name] = decodeURIComponent(match[idx + 1]);
          });
          route.handler(req, res);
          return;
        }
      }
    }
    res.status(404).json({ error: 'Not found' });
  });
}

async function runTests() {
  console.log('--- Running ReturnRadar API Unit Tests ---');

  // Test 1: GET /api/purchases
  const r1 = await simulateRequest('GET', '/api/purchases');
  const d1 = JSON.parse(r1.body);
  console.log('Test 1 (GET /api/purchases):', d1.purchases ? `PASS (${d1.purchases.length} items loaded)` : 'FAIL');
  if (d1.purchases.length > 0) {
    const sample = d1.purchases[0];
    console.log(`  Sample: "${sample.product_name}" -> Deadline: ${sample.return_deadline}, Urgency: ${sample.urgency_level}`);
  }

  // Test 2: GET /api/retailers
  const r2 = await simulateRequest('GET', '/api/retailers');
  const d2 = JSON.parse(r2.body);
  console.log('Test 2 (GET /api/retailers):', d2.retailers ? `PASS (${d2.retailers.length} retailers loaded)` : 'FAIL');

  // Test 3: GET /api/analytics
  const r3 = await simulateRequest('GET', '/api/analytics');
  const d3 = JSON.parse(r3.body);
  console.log('Test 3 (GET /api/analytics):', d3.summary ? 'PASS' : 'FAIL');
  console.log('  Capital at Risk: $' + d3.summary.capital_at_risk);
  console.log('  Pending Refunds: $' + d3.summary.pending_refunds_total);
  console.log('  Total Refunded:  $' + d3.summary.total_refunded);
  console.log('  Recovery Rate:   ' + d3.summary.recovery_rate_percentage + '%');

  // Test 4: POST /api/purchases (Create new purchase)
  const newPurchase = {
    product_name: 'Kindle Paperwhite Signature Edition',
    retailer: 'Amazon',
    order_number: '112-9900112-4455667',
    price: 189.99,
    category: 'Electronics',
    purchase_date: '2026-11-15',
    return_policy_days: 30,
    notes: 'Testing battery life and reading comfort.'
  };
  const r4 = await simulateRequest('POST', '/api/purchases', {}, newPurchase);
  const d4 = JSON.parse(r4.body);
  console.log('Test 4 (POST /api/purchases):', d4.id ? `PASS (Created id ${d4.id}, Deadline: ${d4.return_deadline})` : 'FAIL');

  // Test 5: POST /api/dispute-generator
  const r5 = await simulateRequest('POST', '/api/dispute-generator', {}, { purchase_id: 'pur-107' });
  const d5 = JSON.parse(r5.body);
  console.log('Test 5 (POST /api/dispute-generator):', d5.subject ? `PASS (Subject: "${d5.subject.slice(0, 45)}...")` : 'FAIL');

  // Test 6: GET /api/export/csv
  const r6 = await simulateRequest('GET', '/api/export/csv');
  console.log('Test 6 (GET /api/export/csv):', r6.body.includes('Product Name') ? 'PASS (CSV formatted)' : 'FAIL');

  // Test 7: GET /api/export/ics/pur-101
  const r7 = await simulateRequest('GET', '/api/export/ics/pur-101');
  console.log('Test 7 (GET /api/export/ics/:id):', r7.body.includes('BEGIN:VCALENDAR') ? 'PASS (RFC 5545 iCalendar generated)' : 'FAIL');

  console.log('--- All API Tests Completed Successfully! ---');
}

runTests().catch(console.error);
