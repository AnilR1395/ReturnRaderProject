// server/utils/generateReceipts.js - Creates realistic receipt & label SVGs
const fs = require('node:fs');
const path = require('node:path');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function createReceiptSVG(store, order, date, item, price, tax, total, policy, barcode) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="100%" height="100%">
    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
      </filter>
    </defs>
    <!-- Paper background -->
    <rect x="10" y="10" width="380" height="540" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#shadow)"/>
    <path d="M 10 540 Q 20 548 30 540 Q 40 548 50 540 Q 60 548 70 540 Q 80 548 90 540 Q 100 548 110 540 Q 120 548 130 540 Q 140 548 150 540 Q 160 548 170 540 Q 180 548 190 540 Q 200 548 210 540 Q 220 548 230 540 Q 240 548 250 540 Q 260 548 270 540 Q 280 548 290 540 Q 300 548 310 540 Q 320 548 330 540 Q 340 548 350 540 Q 360 548 370 540 Q 380 548 390 540" fill="none" stroke="#E2E8F0" stroke-width="2"/>
    
    <!-- Header -->
    <text x="200" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" text-anchor="middle" fill="#0F172A">${store.toUpperCase()}</text>
    <text x="200" y="65" font-family="monospace" font-size="11" text-anchor="middle" fill="#64748B">OFFICIAL SALES RECEIPT</text>
    <line x1="30" y1="80" x2="370" y2="80" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4 4"/>
    
    <!-- Metadata -->
    <text x="35" y="105" font-family="monospace" font-size="11" fill="#475569">ORDER #: ${order}</text>
    <text x="35" y="125" font-family="monospace" font-size="11" fill="#475569">DATE: ${date}</text>
    <text x="35" y="145" font-family="monospace" font-size="11" fill="#475569">PAYMENT: APPROVED (CHIP VERIFIED)</text>
    <line x1="30" y1="160" x2="370" y2="160" stroke="#CBD5E1" stroke-width="1"/>
    
    <!-- Item Table Header -->
    <text x="35" y="180" font-family="monospace" font-size="11" font-weight="700" fill="#1E293B">ITEM DESCRIPTION</text>
    <text x="365" y="180" font-family="monospace" font-size="11" font-weight="700" text-anchor="end" fill="#1E293B">AMT</text>
    
    <!-- Item -->
    <text x="35" y="210" font-family="monospace" font-size="12" font-weight="600" fill="#0F172A">${item}</text>
    <text x="365" y="210" font-family="monospace" font-size="12" font-weight="600" text-anchor="end" fill="#0F172A">$${price}</text>
    
    <!-- Subtotals -->
    <line x1="30" y1="240" x2="370" y2="240" stroke="#E2E8F0" stroke-width="1"/>
    <text x="35" y="265" font-family="monospace" font-size="11" fill="#64748B">SUBTOTAL</text>
    <text x="365" y="265" font-family="monospace" font-size="11" text-anchor="end" fill="#334155">$${price}</text>
    <text x="35" y="285" font-family="monospace" font-size="11" fill="#64748B">EST. SALES TAX</text>
    <text x="365" y="285" font-family="monospace" font-size="11" text-anchor="end" fill="#334155">$${tax}</text>
    <line x1="30" y1="300" x2="370" y2="300" stroke="#0F172A" stroke-width="1.5"/>
    
    <text x="35" y="325" font-family="monospace" font-size="14" font-weight="800" fill="#0F172A">TOTAL PAID</text>
    <text x="365" y="325" font-family="monospace" font-size="14" font-weight="800" text-anchor="end" fill="#0F172A">$${total}</text>
    
    <!-- Return Policy box -->
    <rect x="30" y="350" width="340" height="70" rx="4" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="40" y="370" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#334155">RETURN POLICY SUMMARY:</text>
    <text x="40" y="390" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">${policy.slice(0, 55)}</text>
    <text x="40" y="405" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" fill="#64748B">${policy.slice(55, 115) || ''}</text>
    
    <!-- Barcode simulation -->
    <g transform="translate(45, 440)">
      <rect x="0" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="5" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="14" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="20" y="0" width="7" height="45" fill="#0F172A"/>
      <rect x="30" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="37" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="42" y="0" width="5" height="45" fill="#0F172A"/>
      <rect x="50" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="55" y="0" width="8" height="45" fill="#0F172A"/>
      <rect x="66" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="72" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="77" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="86" y="0" width="4" height="45" fill="#0F172A"/>
      <rect x="93" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="98" y="0" width="7" height="45" fill="#0F172A"/>
      <rect x="108" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="114" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="123" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="128" y="0" width="5" height="45" fill="#0F172A"/>
      <rect x="136" y="0" width="4" height="45" fill="#0F172A"/>
      <rect x="143" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="148" y="0" width="8" height="45" fill="#0F172A"/>
      <rect x="159" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="165" y="0" width="5" height="45" fill="#0F172A"/>
      <rect x="173" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="178" y="0" width="7" height="45" fill="#0F172A"/>
      <rect x="188" y="0" width="4" height="45" fill="#0F172A"/>
      <rect x="195" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="200" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="209" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="215" y="0" width="5" height="45" fill="#0F172A"/>
      <rect x="223" y="0" width="8" height="45" fill="#0F172A"/>
      <rect x="234" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="239" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="248" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="254" y="0" width="7" height="45" fill="#0F172A"/>
      <rect x="264" y="0" width="4" height="45" fill="#0F172A"/>
      <rect x="271" y="0" width="2" height="45" fill="#0F172A"/>
      <rect x="276" y="0" width="6" height="45" fill="#0F172A"/>
      <rect x="285" y="0" width="3" height="45" fill="#0F172A"/>
      <rect x="291" y="0" width="8" height="45" fill="#0F172A"/>
      <rect x="302" y="0" width="4" height="45" fill="#0F172A"/>
    </g>
    <text x="200" y="505" font-family="monospace" font-size="11" text-anchor="middle" fill="#64748B">${barcode || order}</text>
    <text x="200" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" text-anchor="middle" fill="#94A3B8">Tracked via ReturnRadar</text>
  </svg>`;
}

function createUPSLabelSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
    <rect x="10" y="10" width="380" height="480" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
    <rect x="20" y="20" width="90" height="45" fill="#351C15"/>
    <text x="65" y="50" font-family="sans-serif" font-size="22" font-weight="900" fill="#FFB500" text-anchor="middle">UPS</text>
    <text x="120" y="45" font-family="sans-serif" font-size="16" font-weight="800">GROUND RETURN SERVICE</text>
    <line x1="10" y1="75" x2="390" y2="75" stroke="#000000" stroke-width="2"/>
    <text x="25" y="95" font-family="monospace" font-size="10">SHIP FROM: VALUED CUSTOMER</text>
    <text x="25" y="110" font-family="monospace" font-size="10">RETURNRADAR VERIFIED SENDER</text>
    <line x1="10" y1="130" x2="390" y2="130" stroke="#000000" stroke-width="1"/>
    <text x="25" y="150" font-family="sans-serif" font-size="12" font-weight="700">SHIP TO:</text>
    <text x="25" y="170" font-family="sans-serif" font-size="13" font-weight="800">NIKE LOGISTICS RETURN CENTER</text>
    <text x="25" y="188" font-family="sans-serif" font-size="11">DOCK 4, 1500 VICTORY BLVD</text>
    <text x="25" y="204" font-family="sans-serif" font-size="11">MEMPHIS TN 38118</text>
    <line x1="10" y1="225" x2="390" y2="225" stroke="#000000" stroke-width="3"/>
    <text x="200" y="255" font-family="sans-serif" font-size="18" font-weight="900" text-anchor="middle">TRACKING #: 1Z 999 999 03 9281 7291</text>
    <!-- Barcode -->
    <g transform="translate(30, 275)">
      <rect x="0" y="0" width="4" height="90" fill="#000"/>
      <rect x="7" y="0" width="7" height="90" fill="#000"/>
      <rect x="18" y="0" width="3" height="90" fill="#000"/>
      <rect x="25" y="0" width="10" height="90" fill="#000"/>
      <rect x="40" y="0" width="4" height="90" fill="#000"/>
      <rect x="48" y="0" width="2" height="90" fill="#000"/>
      <rect x="55" y="0" width="9" height="90" fill="#000"/>
      <rect x="68" y="0" width="3" height="90" fill="#000"/>
      <rect x="75" y="0" width="6" height="90" fill="#000"/>
      <rect x="85" y="0" width="12" height="90" fill="#000"/>
      <rect x="102" y="0" width="4" height="90" fill="#000"/>
      <rect x="110" y="0" width="8" height="90" fill="#000"/>
      <rect x="122" y="0" width="3" height="90" fill="#000"/>
      <rect x="128" y="0" width="9" height="90" fill="#000"/>
      <rect x="142" y="0" width="5" height="90" fill="#000"/>
      <rect x="150" y="0" width="3" height="90" fill="#000"/>
      <rect x="156" y="0" width="10" height="90" fill="#000"/>
      <rect x="170" y="0" width="4" height="90" fill="#000"/>
      <rect x="178" y="0" width="6" height="90" fill="#000"/>
      <rect x="188" y="0" width="11" height="90" fill="#000"/>
      <rect x="203" y="0" width="3" height="90" fill="#000"/>
      <rect x="210" y="0" width="7" height="90" fill="#000"/>
      <rect x="221" y="0" width="4" height="90" fill="#000"/>
      <rect x="228" y="0" width="8" height="90" fill="#000"/>
      <rect x="240" y="0" width="5" height="90" fill="#000"/>
      <rect x="248" y="0" width="10" height="90" fill="#000"/>
      <rect x="262" y="0" width="3" height="90" fill="#000"/>
      <rect x="268" y="0" width="8" height="90" fill="#000"/>
      <rect x="280" y="0" width="5" height="90" fill="#000"/>
      <rect x="290" y="0" width="12" height="90" fill="#000"/>
      <rect x="306" y="0" width="4" height="90" fill="#000"/>
      <rect x="314" y="0" width="6" height="90" fill="#000"/>
      <rect x="325" y="0" width="4" height="90" fill="#000"/>
    </g>
    <line x1="10" y1="390" x2="390" y2="390" stroke="#000000" stroke-width="2"/>
    <text x="200" y="420" font-family="sans-serif" font-size="14" font-weight="800" text-anchor="middle">AUTHORIZED PREPAID RETURN LABEL</text>
    <text x="200" y="440" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#4B5563">Drop off at any UPS Store, Customer Center, or Authorized Drop Box</text>
    <text x="200" y="470" font-family="monospace" font-size="10" text-anchor="middle" fill="#6B7280">RMA # NK-99214-PEGA40</text>
  </svg>`;
}

const receipts = [
  { name: 'receipt_apple_airpods.svg', store: 'Apple Store', order: 'W1084920194', date: '2026-11-08', item: 'AirPods Max - Space Gray', price: '549.00', tax: '45.29', total: '594.29', policy: '14 days return policy. Standard Apple hardware warranty.', barcode: 'APPL-99281-W108' },
  { name: 'receipt_bestbuy_camera.svg', store: 'Best Buy', order: 'BBY01-90492812', date: '2026-11-06', item: 'Sony Alpha a7 IV Body', price: '2498.00', tax: '206.09', total: '2704.09', policy: '15-day return window. 15% restocking fee on unsealed cameras.', barcode: 'BBY-SONY-77810' },
  { name: 'receipt_zara.svg', store: 'Zara USA', order: 'ZR-5829104', date: '2026-10-25', item: 'Tailored Wool-Blend Blazer', price: '159.00', tax: '13.12', total: '172.12', policy: '30 days from shipment date. Free return in-store, $4.95 via post.', barcode: 'ZR-BLZ-5829104' },
  { name: 'receipt_nike.svg', store: 'Nike Store', order: 'C0192841920', date: '2026-10-18', item: 'Air Zoom Pegasus 40 (Size 10.5)', price: '130.00', tax: '10.73', total: '140.73', policy: '60 days wear trial for Nike Members. Free return shipping.', barcode: 'NK-PEG40-105' },
  { name: 'receipt_amazon.svg', store: 'Amazon.com', order: '114-8291048-2819203', date: '2026-11-04', item: 'Anker Prime 20000mAh Power Bank', price: '129.99', tax: '10.72', total: '140.71', policy: '30 days return window. Drop off box-free at Whole Foods.', barcode: 'AMZ-ANKER-9912' },
  { name: 'receipt_sephora.svg', store: 'Sephora', order: 'SEP-9810482', date: '2026-10-30', item: 'Deluxe Fragrance Sampler', price: '85.00', tax: '7.01', total: '92.01', policy: '30 days original payment. Gently used accepted.', barcode: 'SEP-FRAG-9810' },
  { name: 'receipt_asos.svg', store: 'ASOS US', order: 'ASOS-77192841', date: '2026-10-10', item: 'Oversized Puffer Coat', price: '115.00', tax: '9.49', total: '124.49', policy: '28-day return policy. Free return drop-off with QR code.', barcode: 'ASOS-PUFF-7719' },
  { name: 'receipt_dell.svg', store: 'Dell Premier', order: 'DELL-4491820', date: '2026-10-12', item: 'UltraSharp 27 4K Monitor (U2723QE)', price: '620.00', tax: '51.15', total: '671.15', policy: '30 days from invoice date. RMA authorization required.', barcode: 'DELL-U2723-RMA' },
  { name: 'receipt_bose.svg', store: 'Amazon / Bose', order: '113-9028471-1928471', date: '2026-10-15', item: 'Bose QC Ultra Earbuds', price: '299.00', tax: '24.67', total: '323.67', policy: '30-day Amazon returns window. Full refund guarantee.', barcode: 'AMZ-BOSE-QCULTRA' },
  { name: 'receipt_patagonia.svg', store: 'REI Co-op', order: 'REI-99104820', date: '2026-09-20', item: 'Nano Puff Insulated Jacket', price: '239.00', tax: '19.72', total: '258.72', policy: '365 days 100% satisfaction guarantee for REI Members.', barcode: 'REI-PATAG-9910' },
  { name: 'receipt_dyson.svg', store: 'Target', order: 'TGT-90182940', date: '2026-10-01', item: 'Dyson V15 Detect Vacuum', price: '749.99', tax: '61.87', total: '811.86', policy: '90-day Target return policy. Target Circle perks.', barcode: 'TGT-DYSON-V15' },
  { name: 'receipt_logitech.svg', store: 'Walmart', order: 'WMT-11029482', date: '2026-09-12', item: 'MX Master 3S Wireless Mouse', price: '99.99', tax: '8.25', total: '108.24', policy: '30-day electronics return window. Receipt required.', barcode: 'WMT-LOGI-MX3S' }
];

for (const r of receipts) {
  const filePath = path.join(UPLOADS_DIR, r.name);
  fs.writeFileSync(filePath, createReceiptSVG(r.store, r.order, r.date, r.item, r.price, r.tax, r.total, r.policy, r.barcode));
}

// Write UPS Label SVG
fs.writeFileSync(path.join(UPLOADS_DIR, 'label_nike_ups.svg'), createUPSLabelSVG());
console.log(`Generated ${receipts.length + 1} SVG receipts and labels.`);
