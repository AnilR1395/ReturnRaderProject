// server/routes/analytics.js - Financial recovery & return health analytics
const { getDb } = require('../db');
const { enrichPurchase } = require('./purchases');

function registerAnalyticsRoutes(app) {
  app.get('/api/analytics', (req, res) => {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM purchases').all();
    const purchases = rows.map(enrichPurchase);

    let capitalAtRisk = 0;
    let pendingRefundsTotal = 0;
    let totalRefunded = 0;
    let totalExpiredLoss = 0;
    let totalTrackedValue = 0;
    let activeTrackedCount = 0;
    let overdueRefundsCount = 0;
    let criticalItemsCount = 0;

    const statusCounts = {};
    const categoryCounts = {};
    const categoryValues = {};
    const returnReasons = {};
    const retailerStats = {};

    for (const p of purchases) {
      totalTrackedValue += p.price;

      // Status counters
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;

      // Categories
      const cat = p.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      categoryValues[cat] = (categoryValues[cat] || 0) + p.price;

      // Retailers
      const ret = p.retailer || 'Unknown';
      if (!retailerStats[ret]) {
        retailerStats[ret] = {
          retailer: ret,
          totalPurchases: 0,
          totalSpent: 0,
          returnedCount: 0,
          keptCount: 0,
          refundedAmount: 0,
          pendingAmount: 0
        };
      }
      retailerStats[ret].totalPurchases += 1;
      retailerStats[ret].totalSpent += p.price;

      // Check specific states
      if (['CONSIDERING', 'INITIATED'].includes(p.status)) {
        activeTrackedCount += 1;
        if (p.urgency_level === 'CRITICAL') {
          capitalAtRisk += p.price;
          criticalItemsCount += 1;
        } else if (p.urgency_level === 'WARNING') {
          // Add partial risk
          capitalAtRisk += p.price;
        }
      }

      if (['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING'].includes(p.status)) {
        pendingRefundsTotal += (p.expected_refund_amount || p.price);
        retailerStats[ret].pendingAmount += (p.expected_refund_amount || p.price);
        if (p.is_refund_overdue) {
          overdueRefundsCount += 1;
        }
      }

      if (p.status === 'REFUNDED') {
        totalRefunded += (p.actual_refund_amount || p.price);
        retailerStats[ret].returnedCount += 1;
        retailerStats[ret].refundedAmount += (p.actual_refund_amount || p.price);
      } else if (p.status === 'KEEP') {
        retailerStats[ret].keptCount += 1;
      } else if (['INITIATED', 'DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING', 'DISPUTED'].includes(p.status)) {
        retailerStats[ret].returnedCount += 1;
      }

      if (p.status === 'EXPIRED') {
        totalExpiredLoss += p.price;
      }

      // Return reason breakdown
      if (p.return_reason) {
        returnReasons[p.return_reason] = (returnReasons[p.return_reason] || 0) + 1;
      }
    }

    // Calculate return rate per retailer
    const retailerList = Object.values(retailerStats).map(r => ({
      ...r,
      returnRate: r.totalPurchases > 0 ? Math.round((r.returnedCount / r.totalPurchases) * 100) : 0
    }));

    // Recovery rate percentage
    const initiatedReturns = purchases.filter(p => !['KEEP', 'CONSIDERING'].includes(p.status));
    const successfullyRefunded = purchases.filter(p => p.status === 'REFUNDED');
    const recoveryRate = initiatedReturns.length > 0
      ? Math.round((successfullyRefunded.length / initiatedReturns.length) * 100)
      : 100;

    res.json({
      summary: {
        capital_at_risk: Number(capitalAtRisk.toFixed(2)),
        pending_refunds_total: Number(pendingRefundsTotal.toFixed(2)),
        total_refunded: Number(totalRefunded.toFixed(2)),
        total_expired_loss: Number(totalExpiredLoss.toFixed(2)),
        total_tracked_value: Number(totalTrackedValue.toFixed(2)),
        active_tracked_count: activeTrackedCount,
        overdue_refunds_count: overdueRefundsCount,
        critical_items_count: criticalItemsCount,
        recovery_rate_percentage: recoveryRate,
        total_purchases_count: purchases.length
      },
      status_distribution: statusCounts,
      categories: {
        counts: categoryCounts,
        values: categoryValues
      },
      return_reasons: returnReasons,
      retailers: retailerList
    });
  });
}

module.exports = {
  registerAnalyticsRoutes
};
