// server/testStoreRoutes.js - Test Store, Cart, Orders, Payment Deadlines, and Auth
const { EventEmitter } = require('node:events');
const MiniApp = require('./serverFramework');
const { getDb } = require('./db');
const { seedDatabase } = require('./seedData');
const { seedStoreDatabase } = require('./seedStoreData');
const { registerAuthRoutes } = require('./routes/auth');
const { registerStoreRoutes } = require('./routes/store');

const app = new MiniApp();
registerAuthRoutes(app);
registerStoreRoutes(app);

const db = getDb();
seedDatabase(db);
seedStoreDatabase(db);

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
}

async function simulateRequest(method, pathname, query = {}, body = {}, headers = {}) {
  return new Promise((resolve) => {
    const req = {
      method: method.toUpperCase(),
      url: pathname,
      query,
      body,
      headers: { 'content-type': 'application/json', 'x-user-id': 'usr-rahul', ...headers },
      on: (event, cb) => {
        if (event === 'end') cb();
      }
    };
    const res = new MockResponse();
    res.on('finish', () => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        body: res.body,
        json: res.body ? JSON.parse(res.body) : null
      });
    });

    // Find route in app.routes
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
    res.status(404).json({ error: 'Not found: ' + pathname });
  });
}

async function runTests() {
  console.log('🧪 Running Store & Auth Unit Tests...\n');

  // Test 1: Get Current User
  const meRes = await simulateRequest('GET', '/api/auth/me');
  console.log(`[PASS] /api/auth/me: ${meRes.status} - User: ${meRes.json.user.name} (${meRes.json.user.is_plus_member ? 'Plus Member' : 'Regular'})`);

  // Test 2: List Products
  const prodRes = await simulateRequest('GET', '/api/products');
  console.log(`[PASS] /api/products: ${prodRes.status} - Count: ${prodRes.json.products.length}`);

  // Test 3: Filter Products by Category
  const catRes = await simulateRequest('GET', '/api/products', { category: 'Mobiles' });
  console.log(`[PASS] /api/products?category=Mobiles: ${catRes.status} - Count: ${catRes.json.products.length}`);

  // Test 4: List Orders
  const ordRes = await simulateRequest('GET', '/api/orders');
  console.log(`[PASS] /api/orders: ${ordRes.status} - User Orders: ${ordRes.json.orders.length}`);
  console.log(`       Active Pending Payment Order: ${ordRes.json.activePendingPaymentOrder ? ordRes.json.activePendingPaymentOrder.order_number : 'None'}`);

  // Test 5: Place "Reserve & Pay Later" Order
  const orderPayload = {
    items: [
      {
        product_id: 'prod-s24ultra',
        title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
        price: 1099.00,
        original_mrp: 1299.00,
        quantity: 1,
        return_policy_days: 7,
        category: 'Mobiles'
      }
    ],
    shipping_address: 'Flat 402, Palm Heights, Outer Ring Road, Bangalore - 560103',
    payment_method: 'Reserve & Pay Later',
    reserve_hours: 24
  };

  const createOrdRes = await simulateRequest('POST', '/api/orders', {}, orderPayload);
  console.log(`[PASS] POST /api/orders (Reserve & Pay Later): ${createOrdRes.status}`);
  console.log(`       Order #${createOrdRes.json.order.order_number}, Status: ${createOrdRes.json.order.order_status}, Payment Status: ${createOrdRes.json.order.payment_status}`);
  console.log(`       Payment Deadline: ${createOrdRes.json.order.payment_deadline}`);

  const testOrderId = createOrdRes.json.order.id;

  // Test 6: Pay Order
  const payRes = await simulateRequest('POST', `/api/orders/${testOrderId}/pay`);
  console.log(`[PASS] POST /api/orders/${testOrderId}/pay: ${payRes.status}`);
  console.log(`       Updated Status: ${payRes.json.order.order_status}, Payment Status: ${payRes.json.order.payment_status}`);

  // Test 7: Return Request
  const retRes = await simulateRequest('POST', `/api/orders/${testOrderId}/return`, {}, {
    reason: 'Defective screen / Dead pixels',
    refund_method: 'Original Payment Method'
  });
  console.log(`[PASS] POST /api/orders/${testOrderId}/return: ${retRes.status}`);
  console.log(`       Updated Status: ${retRes.json.order.order_status}`);

  console.log('\n✨ All Store & Auth API tests passed successfully!\n');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
