// server/utils/dateUtils.js
// Current simulated reference date is 2026-11-20

function getTodayString() {
  // Using 2026-11-20 as the reference date for consistent tracking
  return '2026-11-20';
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59);
  }
  return new Date(dateStr);
}

function calculateDaysRemaining(deadlineStr, referenceDateStr = getTodayString()) {
  if (!deadlineStr) return null;
  const deadline = parseDate(deadlineStr);
  const ref = parseDate(referenceDateStr);
  
  const diffMs = deadline.getTime() - ref.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getUrgencyLevel(status, daysRemaining) {
  if (status === 'REFUNDED') return 'RESOLVED';
  if (status === 'KEEP') return 'KEPT';
  if (status === 'EXPIRED') return 'EXPIRED';
  if (status === 'DISPUTED') return 'DISPUTED';
  if (['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING'].includes(status)) {
    return 'IN_REFUND_PIPELINE';
  }

  if (daysRemaining === null) return 'UNKNOWN';
  if (daysRemaining < 0) return 'EXPIRED';
  if (daysRemaining <= 2) return 'CRITICAL';
  if (daysRemaining <= 7) return 'WARNING';
  return 'SAFE';
}

function calculateDeadline(startDateStr, policyDays) {
  if (!startDateStr || !policyDays) return null;
  const start = parseDate(startDateStr);
  start.setDate(start.getDate() + parseInt(policyDays, 10));
  
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, '0');
  const day = String(start.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isRefundOverdue(purchase, averageDays = 5) {
  if (!['DROPPED_OFF', 'DELIVERED_TO_SELLER', 'REFUND_PENDING'].includes(purchase.status)) {
    return false;
  }
  
  // Look at timeline for drop-off or delivery date
  let actionDate = purchase.delivery_date || purchase.purchase_date;
  if (purchase.timeline) {
    try {
      const events = JSON.parse(purchase.timeline);
      const dropEvent = events.find(e => 
        e.title.toLowerCase().includes('drop') || 
        e.title.toLowerCase().includes('delivered to') ||
        e.title.toLowerCase().includes('return initiated')
      );
      if (dropEvent && dropEvent.date) {
        actionDate = dropEvent.date;
      }
    } catch (e) {
      // ignore
    }
  }

  const daysSince = -calculateDaysRemaining(actionDate);
  return daysSince > (averageDays + 2);
}

module.exports = {
  getTodayString,
  parseDate,
  calculateDaysRemaining,
  getUrgencyLevel,
  calculateDeadline,
  isRefundOverdue
};
