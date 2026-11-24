// server/routes/calendar.js - Export to iCalendar (.ics) and CSV
const { getDb } = require('../db');
const { generatePurchaseICS, generateAllPurchasesICS } = require('../utils/icsGenerator');
const { enrichPurchase } = require('./purchases');

function registerExportRoutes(app) {
  // GET /api/export/ics/:id - Download .ics for a single purchase
  app.get('/api/export/ics/:id', (req, res) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM purchases WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const purchase = enrichPurchase(row);
    const icsContent = generatePurchaseICS(purchase);

    const safeName = purchase.product_name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="return-deadline-${safeName}.ics"`);
    res.send(icsContent, 'text/calendar; charset=utf-8');
  });

  // GET /api/export/ics - Download all upcoming return deadlines as single .ics calendar
  app.get('/api/export/ics', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM purchases').all();
    const purchases = rows.map(enrichPurchase);
    const icsContent = generateAllPurchasesICS(purchases);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="returnradar-all-deadlines.ics"');
    res.send(icsContent, 'text/calendar; charset=utf-8');
  });

  // GET /api/export/csv - Download full returns spreadsheet
  app.get('/api/export/csv', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM purchases ORDER BY return_deadline ASC').all();
    const purchases = rows.map(enrichPurchase);

    const headers = [
      'ID',
      'Product Name',
      'Retailer',
      'Order Number',
      'Price ($)',
      'Currency',
      'Purchase Date',
      'Delivery Date',
      'Policy Window (Days)',
      'Return Deadline',
      'Days Remaining',
      'Status',
      'Urgency',
      'Category',
      'Payment Method',
      'Expected Refund ($)',
      'Actual Refund ($)',
      'Discrepancy ($)',
      'Return Method',
      'Carrier',
      'Tracking Number',
      'Return Reason',
      'Notes'
    ];

    function escapeCSV(val) {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }

    const csvLines = [headers.join(',')];

    for (const p of purchases) {
      csvLines.push([
        escapeCSV(p.id),
        escapeCSV(p.product_name),
        escapeCSV(p.retailer),
        escapeCSV(p.order_number),
        escapeCSV(p.price.toFixed(2)),
        escapeCSV(p.currency),
        escapeCSV(p.purchase_date),
        escapeCSV(p.delivery_date || ''),
        escapeCSV(p.return_policy_days),
        escapeCSV(p.return_deadline),
        escapeCSV(p.days_remaining),
        escapeCSV(p.status),
        escapeCSV(p.urgency_level),
        escapeCSV(p.category),
        escapeCSV(p.payment_method),
        escapeCSV((p.expected_refund_amount || p.price).toFixed(2)),
        escapeCSV(p.actual_refund_amount !== null ? p.actual_refund_amount.toFixed(2) : ''),
        escapeCSV(p.discrepancy_amount ? p.discrepancy_amount.toFixed(2) : '0.00'),
        escapeCSV(p.return_method || ''),
        escapeCSV(p.return_carrier || ''),
        escapeCSV(p.return_tracking_number || ''),
        escapeCSV(p.return_reason || ''),
        escapeCSV(p.notes || '')
      ].join(','));
    }

    const csvContent = csvLines.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="returnradar-purchases.csv"');
    res.send(csvContent, 'text/csv; charset=utf-8');
  });
}

module.exports = {
  registerExportRoutes
};
