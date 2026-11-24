// server/utils/icsGenerator.js - Generates RFC 5545 iCalendar strings
function formatDateToICS(dateStr, timeStr = '090000') {
  if (!dateStr) return '';
  const cleanDate = dateStr.replace(/-/g, '');
  return `${cleanDate}T${timeStr}Z`;
}

function generatePurchaseICS(purchase) {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const deadlineStr = purchase.return_deadline.replace(/-/g, '');
  const uid = `returnradar-${purchase.id}@returnradar.local`;

  const summary = `⚠️ Return Deadline: ${purchase.product_name} (${purchase.retailer})`;
  const description = [
    `ReturnRadar Alert`,
    `----------------------------------`,
    `Product: ${purchase.product_name}`,
    `Retailer: ${purchase.retailer}`,
    `Order Number: ${purchase.order_number || 'N/A'}`,
    `Price: $${purchase.price.toFixed(2)}`,
    `Return Policy Window: ${purchase.return_policy_days} days`,
    `Return Method: ${purchase.return_method || 'Standard Store/Mail'}`,
    `Tracking Number: ${purchase.return_tracking_number || 'N/A'}`,
    `Condition: ${purchase.condition_required || 'Standard condition'}`,
    `Notes: ${purchase.notes || 'None'}`,
    `----------------------------------`,
    `Managed with ReturnRadar: Purchase Return Deadline & Refund Tracker`
  ].join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ReturnRadar//Purchase Return Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${deadlineStr}`,
    `DTEND;VALUE=DATE:${deadlineStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${purchase.retailer}`,
    'STATUS:CONFIRMED',
    // 2-day reminder alarm
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Return deadline approaching in 48 hours!',
    'TRIGGER:-P2D',
    'END:VALARM',
    // 1-day reminder alarm
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:URGENT: Return deadline is tomorrow!',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function generateAllPurchasesICS(purchases) {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const events = purchases
    .filter(p => !['REFUNDED', 'KEEP', 'EXPIRED'].includes(p.status) && p.return_deadline)
    .map(purchase => {
      const deadlineStr = purchase.return_deadline.replace(/-/g, '');
      const uid = `returnradar-${purchase.id}@returnradar.local`;
      const summary = `⚠️ Return Deadline: ${purchase.product_name} (${purchase.retailer})`;
      const description = `Product: ${purchase.product_name}\\nStore: ${purchase.retailer}\\nValue: $${purchase.price}\\nOrder: ${purchase.order_number || 'N/A'}`;
      
      return [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${deadlineStr}`,
        `DTEND;VALUE=DATE:${deadlineStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:Return deadline approaching in 48 hours!',
        'TRIGGER:-P2D',
        'END:VALARM',
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ReturnRadar//All Purchases Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    events,
    'END:VCALENDAR'
  ].join('\r\n');
}

module.exports = {
  generatePurchaseICS,
  generateAllPurchasesICS
};
