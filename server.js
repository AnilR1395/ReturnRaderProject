// server.js - ReturnRadar: Purchase Return Deadline & Refund Tracker
const path = require('node:path');
const MiniApp = require('./server/serverFramework');
const { getDb } = require('./server/db');
const { seedDatabase } = require('./server/seedData');

// Route modules
const { registerPurchaseRoutes } = require('./server/routes/purchases');
const { registerRetailerRoutes } = require('./server/routes/retailers');
const { registerAnalyticsRoutes } = require('./server/routes/analytics');
const { registerDisputeRoutes } = require('./server/routes/dispute');
const { registerExportRoutes } = require('./server/routes/calendar');
const { registerUploadRoutes } = require('./server/routes/upload');
const { registerNotificationRoutes } = require('./server/routes/notifications');
const { registerAuthRoutes } = require('./server/routes/auth');
const { registerStoreRoutes } = require('./server/routes/store');
const { seedStoreDatabase } = require('./server/seedStoreData');

const app = new MiniApp();

// Serve static frontend assets
const publicDir = path.join(__dirname, 'public');
app.serveStatic(publicDir);

// Simple request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const origEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    if (req.url.startsWith('/api')) {
      console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
    }
    return origEnd.apply(this, args);
  };
  next();
});

// Register all API routes
registerPurchaseRoutes(app);
registerRetailerRoutes(app);
registerAnalyticsRoutes(app);
registerDisputeRoutes(app);
registerExportRoutes(app);
registerUploadRoutes(app);
registerNotificationRoutes(app);
registerAuthRoutes(app);
registerStoreRoutes(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ReturnRadar',
    store: 'RadarStore E-Commerce Integrated',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Initialize database & run seed
const db = getDb();
seedDatabase(db);
seedStoreDatabase(db);

const PORT = parseInt(process.env.PORT, 10) || 3000;
const server = app.listen(PORT, () => {
  console.log(`
===========================================================
  📡 RETURNRADAR: Purchase Return Deadline & Refund Tracker
===========================================================
  Server running at: http://localhost:${PORT}
  Environment: Production/Standalone
  Database: SQLite (data/returnradar.db)
  
  Key API Endpoints:
  - GET  /api/purchases          (List purchases with filters)
  - POST /api/purchases          (Create purchase & auto-calc deadline)
  - POST /api/purchases/:id/status (Update lifecycle status)
  - POST /api/purchases/:id/refund (Log refund & flag discrepancy)
  - GET  /api/retailers          (Retailer return policy knowledge base)
  - GET  /api/analytics          (Financial recovery & risk metrics)
  - GET  /api/export/ics         (All deadlines iCalendar sync)
  - GET  /api/export/csv         (Spreadsheet export)
  - POST /api/dispute-generator  (Auto-draft dispute letters)
  - POST /api/upload             (Receipt & dropoff slip uploads)
===========================================================
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down ReturnRadar server...');
  server.close(() => {
    process.exit(0);
  });
});
