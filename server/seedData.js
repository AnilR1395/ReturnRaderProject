// server/seedData.js - Initial knowledge base & demo data for ReturnRadar
const { randomUUID } = require('node:crypto');

const RETAILERS = [
  {
    id: 'ret-apple',
    name: 'Apple',
    return_days: 14,
    policy_type: 'strict_14_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: '0% restocking fee. Must include all cords, manuals, packaging.',
    dropoff_locations: 'Apple Store or free prepaid UPS return label',
    average_refund_days: 2,
    condition_notes: '14 calendar days from delivery. Software/gift cards non-returnable.',
    website: 'https://www.apple.com/shop/help/returns_refund',
    badge_color: 'gray'
  },
  {
    id: 'ret-bestbuy',
    name: 'Best Buy',
    return_days: 15,
    policy_type: 'tiered_electronics',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: '15% restocking fee on opened drones, DSLR cameras, lenses, projectors.',
    dropoff_locations: 'Any Best Buy store or UPS drop-off',
    average_refund_days: 4,
    condition_notes: '15 days standard. 60 days for My Best Buy Plus/Total members. Receipt required.',
    website: 'https://www.bestbuy.com/returns',
    badge_color: 'blue'
  },
  {
    id: 'ret-amazon',
    name: 'Amazon',
    return_days: 30,
    policy_type: 'standard_30_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'Usually $0, but up to 20-50% for missing accessories or customer damage.',
    dropoff_locations: 'Whole Foods, Kohl’s, UPS Store (QR code, box-free)',
    average_refund_days: 3,
    condition_notes: '30 days from delivery. Label-free, box-free returns at Whole Foods & Kohl’s.',
    website: 'https://www.amazon.com/returns',
    badge_color: 'amber'
  },
  {
    id: 'ret-target',
    name: 'Target',
    return_days: 90,
    policy_type: 'generous_90_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees.',
    dropoff_locations: 'Target Guest Services or free mail return',
    average_refund_days: 2,
    condition_notes: '90 days standard. Extra 30 days if paid with Target Circle Card. 30 days for electronics.',
    website: 'https://help.target.com/help/subcategoryarticle?childcat=Returns',
    badge_color: 'red'
  },
  {
    id: 'ret-walmart',
    name: 'Walmart',
    return_days: 90,
    policy_type: 'generous_90_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees.',
    dropoff_locations: 'Walmart Store customer service or carrier drop-off',
    average_refund_days: 3,
    condition_notes: '90 days general merchandise; 30 days electronics; 14 days cell phones.',
    website: 'https://www.walmart.com/help/article/walmart-standard-return-policy',
    badge_color: 'sky'
  },
  {
    id: 'ret-costco',
    name: 'Costco',
    return_days: 90,
    policy_type: 'satisfaction_guarantee',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: '0% restocking fee.',
    dropoff_locations: 'Costco warehouse membership desk or online return pickup',
    average_refund_days: 1,
    condition_notes: '90 days on electronics (TVs, computers, cameras). 100% lifetime satisfaction on general goods.',
    website: 'https://customerservice.costco.com/app/answers/detail/a_id/1191',
    badge_color: 'indigo'
  },
  {
    id: 'ret-zara',
    name: 'Zara',
    return_days: 30,
    policy_type: 'apparel_standard',
    free_returns: 0,
    return_shipping_fee: 4.95,
    restocking_fee_note: '$4.95 deducted for drop-off return points. Free return in Zara stores.',
    dropoff_locations: 'Zara retail store (Free) or carrier drop point ($4.95)',
    average_refund_days: 6,
    condition_notes: '30 days from shipment date. Unworn, undamaged, with all original tags attached.',
    website: 'https://www.zara.com/us/en/help/returns',
    badge_color: 'stone'
  },
  {
    id: 'ret-nordstrom',
    name: 'Nordstrom',
    return_days: 120,
    policy_type: 'ultra_flexible',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No fees. Case-by-case philosophy.',
    dropoff_locations: 'Nordstrom store, Nordstrom Rack, or curbside / free mail',
    average_refund_days: 3,
    condition_notes: 'No defined time limit, handled on case-by-case basis. Curbside drop-off available.',
    website: 'https://www.nordstrom.com/browse/customer-service/return-policy',
    badge_color: 'neutral'
  },
  {
    id: 'ret-nike',
    name: 'Nike',
    return_days: 60,
    policy_type: 'wear_test_60_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees.',
    dropoff_locations: 'Nike stores or UPS drop-off',
    average_refund_days: 4,
    condition_notes: '60 days trial. Can be worn outside for a test run. Free returns for Nike Members.',
    website: 'https://www.nike.com/help/a/returns-policy',
    badge_color: 'emerald'
  },
  {
    id: 'ret-sephora',
    name: 'Sephora',
    return_days: 30,
    policy_type: 'beauty_standard',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees.',
    dropoff_locations: 'Sephora stores or free return shipping label',
    average_refund_days: 3,
    condition_notes: '1-30 days: full refund to original payment. 31-60 days: online store credit. Gently used accepted.',
    website: 'https://www.sephora.com/beauty/returns-exchanges',
    badge_color: 'rose'
  },
  {
    id: 'ret-homedepot',
    name: 'Home Depot',
    return_days: 90,
    policy_type: 'generous_90_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: '15% on special orders cancelled after 72 hours.',
    dropoff_locations: 'Any Home Depot store or UPS return',
    average_refund_days: 3,
    condition_notes: '90 days with receipt. 30 days for major appliances, gas equipment, generators.',
    website: 'https://www.homedepot.com/c/Return_Policy',
    badge_color: 'orange'
  },
  {
    id: 'ret-asos',
    name: 'ASOS',
    return_days: 28,
    policy_type: 'fashion_28_day',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No fees if returned within 28 days.',
    dropoff_locations: 'UPS drop-off with paperless QR code',
    average_refund_days: 7,
    condition_notes: '28 days for original payment refund. 29-45 days for ASOS gift voucher.',
    website: 'https://www.asos.com/us/customer-care/returns-refunds/',
    badge_color: 'teal'
  },
  {
    id: 'ret-rei',
    name: 'REI',
    return_days: 365,
    policy_type: 'coop_guarantee',
    free_returns: 1,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees.',
    dropoff_locations: 'REI store or prepaid mail return',
    average_refund_days: 3,
    condition_notes: '365 days satisfaction guarantee for REI Co-op Members. 90 days for non-members.',
    website: 'https://www.rei.com/help/return-policy',
    badge_color: 'green'
  },
  {
    id: 'ret-ikea',
    name: 'IKEA',
    return_days: 365,
    policy_type: 'tiered_year',
    free_returns: 0,
    return_shipping_fee: 0,
    restocking_fee_note: 'No restocking fees in-store.',
    dropoff_locations: 'IKEA store returns counter or customer scheduled truck pickup',
    average_refund_days: 2,
    condition_notes: '365 days for unopened products with receipt; 180 days for opened products.',
    website: 'https://www.ikea.com/us/en/customer-service/returns-pubf5b87dc1',
    badge_color: 'yellow'
  },
  {
    id: 'ret-dell',
    name: 'Dell',
    return_days: 30,
    policy_type: 'tech_restocking_risk',
    free_returns: 0,
    return_shipping_fee: 0,
    restocking_fee_note: 'Up to 15% restocking fee on opened laptops/monitors unless defective.',
    dropoff_locations: 'Authorized FedEx drop-off with Dell RMA number',
    average_refund_days: 8,
    condition_notes: '30 days from invoice date (not delivery date). Requires RMA pre-authorization.',
    website: 'https://www.dell.com/learn/us/en/uscorp1/terms-of-sale-consumer-returns',
    badge_color: 'cyan'
  }
];

const DISPUTE_TEMPLATES = [
  {
    id: 'tmpl-overdue',
    title: 'Overdue Refund Request (Item Received by Merchant)',
    category: 'Overdue Refund',
    subject: 'URGENT: Missing Refund for Returned Order #{ORDER_NUMBER} - Tracking #{TRACKING}',
    body: `Dear {RETAILER} Customer Support,

I am writing regarding my return for Order #{ORDER_NUMBER} ({PRODUCT_NAME}), which was delivered back to your return facility on {DELIVERY_TO_SELLER_DATE} via {CARRIER} (Tracking: {TRACKING}).

According to your stated return policy, refunds are processed within {AVG_DAYS} business days of receipt. It has now been {DAYS_ELAPSED} days since your warehouse received this return, yet I have not received the refund of {PRICE} to my {PAYMENT_METHOD}.

Please investigate this promptly and issue the full refund of {PRICE}. If the refund has already been initiated, please reply with the Acquirer Reference Number (ARN) or transaction ID so I can verify with my card issuer.

Thank you,
{CUSTOMER_NAME}`
  },
  {
    id: 'tmpl-discrepancy',
    title: 'Refund Discrepancy & Restocking Fee Dispute',
    category: 'Discrepancy / Deductions',
    subject: 'Inquiry Regarding Partial Refund on Order #{ORDER_NUMBER} (Shortfall of {DISCREPANCY_AMOUNT})',
    body: `Dear {RETAILER} Billing Support,

I received notice that my return for Order #{ORDER_NUMBER} ({PRODUCT_NAME}) was processed. However, only {ACTUAL_REFUND} was credited, whereas the purchase total was {EXPECTED_REFUND}.

There is an unexplained shortfall of {DISCREPANCY_AMOUNT}. 

The item was returned in pristine condition with all original packaging, tags, and accessories intact, within the required return deadline. I did not consent to any undisclosed restocking fees or unauthorized deductions.

Kindly clarify this deduction and credit the remaining balance of {DISCREPANCY_AMOUNT} to my original payment method at your earliest convenience.

Best regards,
{CUSTOMER_NAME}`
  },
  {
    id: 'tmpl-extension',
    title: 'Return Window Extension Request (Defective / Unopened)',
    category: 'Extension Request',
    subject: 'Customer Assistance: Return Window Consideration for Order #{ORDER_NUMBER}',
    body: `Dear {RETAILER} Customer Service,

I am a loyal customer and recently purchased {PRODUCT_NAME} under Order #{ORDER_NUMBER} on {PURCHASE_DATE}.

Due to {REASON}, I was unable to initiate the return within the standard {RETURN_DAYS}-day window. The item remains {ITEM_CONDITION} with original packaging.

Given my purchase history and the condition of the merchandise, I kindly ask if a one-time courtesy return authorization or store credit can be granted for this order.

I appreciate your consideration and exceptional customer care.

Sincerely,
{CUSTOMER_NAME}`
  },
  {
    id: 'tmpl-carrier-lost',
    title: 'Carrier Drop-off Proof & Stalled Tracking Inquiry',
    category: 'Carrier Issue',
    subject: 'Return Verification: Order #{ORDER_NUMBER} Dropped Off via {CARRIER}',
    body: `Dear {RETAILER} Returns Department,

I initiated return authorization #{RETURN_AUTH} for Order #{ORDER_NUMBER} ({PRODUCT_NAME}) and handed the parcel to {CARRIER} on {DROPOFF_DATE} (Tracking: {TRACKING}).

I hold the official drop-off receipt issued by the carrier. It appears the carrier tracking has stalled in transit. Per consumer protection guidelines, my return obligation was fulfilled upon handing the package to your designated carrier.

Could you please confirm receipt or release the refund of {PRICE} under your buyer protection program?

Thank you for your prompt assistance,
{CUSTOMER_NAME}`
  }
];

// Reference date for realistic relative deadlines: 2026-11-20
const SAMPLE_PURCHASES = [
  {
    id: 'pur-101',
    product_name: 'Apple AirPods Max - Space Gray',
    retailer: 'Apple',
    order_number: 'W1084920194',
    price: 549.00,
    currency: 'USD',
    purchase_date: '2026-11-08',
    delivery_date: '2026-11-09',
    return_policy_days: 14,
    return_deadline: '2026-11-23', // 3 days remaining!
    status: 'CONSIDERING',
    category: 'Electronics',
    payment_method: 'Apple Pay (Amex)',
    refund_method: 'Original Payment',
    expected_refund_amount: 549.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Apple Store Drop-off',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: 'Fit & Comfort Issue',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Original box, lightning to USB-C cable, smart case',
    receipt_url: '/uploads/receipt_apple_airpods.svg',
    return_label_url: null,
    image_url: '/images/products/airpods_max.svg',
    notes: 'Sound quality is elite, but headband feels too heavy after 90 minutes. Testing over the weekend. Return deadline is Monday Nov 23!',
    tags: JSON.stringify(['#tech', '#audio', '#decision-needed']),
    timeline: JSON.stringify([
      { date: '2026-11-08', title: 'Ordered Online', note: 'Purchased from Apple Store Online' },
      { date: '2026-11-09', title: 'Delivered', note: 'Signed for by FedEx delivery' },
      { date: '2026-11-18', title: 'Radar Alert Sent', note: '5 days remaining notice' }
    ]),
    created_at: '2026-11-08T14:30:00Z',
    updated_at: '2026-11-18T09:00:00Z'
  },
  {
    id: 'pur-102',
    product_name: 'Sony Alpha a7 IV Mirrorless Camera Body',
    retailer: 'Best Buy',
    order_number: 'BBY01-90492812',
    price: 2498.00,
    currency: 'USD',
    purchase_date: '2026-11-06',
    delivery_date: '2026-11-07',
    return_policy_days: 15,
    return_deadline: '2026-11-22', // 2 days left (CRITICAL!)
    status: 'CONSIDERING',
    category: 'Electronics',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 2498.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Best Buy Store Counter',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: 'Found Better Price',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: '15% fee if unsealed without defect! Keep factory seal intact if returning.',
    receipt_url: '/uploads/receipt_bestbuy_camera.svg',
    return_label_url: null,
    image_url: '/images/products/sony_camera.svg',
    notes: 'HIGH CAPITAL AT RISK ($2,498.00). B&H has it bundled with a free 24-70mm lens. Must return to local Best Buy before 9 PM Sunday!',
    tags: JSON.stringify(['#high-value', '#camera', '#urgent']),
    timeline: JSON.stringify([
      { date: '2026-11-06', title: 'Purchased In Store', note: 'Best Buy Midtown branch' },
      { date: '2026-11-19', title: 'Critical Alert', note: 'Less than 72 hours until 15-day window closes' }
    ]),
    created_at: '2026-11-06T18:15:00Z',
    updated_at: '2026-11-19T08:00:00Z'
  },
  {
    id: 'pur-103',
    product_name: 'Zara Tailored Wool-Blend Structured Blazer',
    retailer: 'Zara',
    order_number: 'ZR-5829104',
    price: 159.00,
    currency: 'USD',
    purchase_date: '2026-10-25',
    delivery_date: '2026-10-28',
    return_policy_days: 30,
    return_deadline: '2026-11-24', // 4 days remaining
    status: 'CONSIDERING',
    category: 'Clothing & Apparel',
    payment_method: 'Credit Card (Mastercard)',
    refund_method: 'Original Payment',
    expected_refund_amount: 159.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Zara Store (Free)',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: 'Wrong Size/Fit',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'All security tags & labels attached, unworn',
    receipt_url: '/uploads/receipt_zara.svg',
    return_label_url: null,
    image_url: '/images/products/zara_blazer.svg',
    notes: 'Sleeves are slightly too long. Return in store to avoid $4.95 postal dropoff fee.',
    tags: JSON.stringify(['#apparel', '#fashion', '#avoid-fee']),
    timeline: JSON.stringify([
      { date: '2026-10-25', title: 'Purchased Online', note: 'Zara US Web' },
      { date: '2026-10-28', title: 'Delivered', note: 'Delivered to front porch' }
    ]),
    created_at: '2026-10-25T11:20:00Z',
    updated_at: '2026-11-15T10:00:00Z'
  },
  {
    id: 'pur-104',
    product_name: 'Nike Air Zoom Pegasus 40 Running Shoes',
    retailer: 'Nike',
    order_number: 'C0192841920',
    price: 130.00,
    currency: 'USD',
    purchase_date: '2026-10-18',
    delivery_date: '2026-10-21',
    return_policy_days: 60,
    return_deadline: '2026-12-17',
    status: 'INITIATED',
    category: 'Footwear',
    payment_method: 'PayPal',
    refund_method: 'Original Payment',
    expected_refund_amount: 130.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'UPS Drop-off',
    return_tracking_number: '1Z9999990392817291',
    return_carrier: 'UPS',
    return_reason: 'Wrong Size/Fit',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Nike 60-day wear trial allows outdoor test',
    receipt_url: '/uploads/receipt_nike.svg',
    return_label_url: '/uploads/label_nike_ups.svg',
    image_url: '/images/products/nike_pegasus.svg',
    notes: 'Printed prepaid return label. Need to drop off at local UPS Store by Friday.',
    tags: JSON.stringify(['#shoes', '#running', '#label-printed']),
    timeline: JSON.stringify([
      { date: '2026-10-18', title: 'Ordered', note: 'Nike Member account' },
      { date: '2026-10-21', title: 'Delivered', note: 'Arrived via UPS' },
      { date: '2026-11-17', title: 'Return Initiated', note: 'Generated RMA #NK-99214 and UPS Label' }
    ]),
    created_at: '2026-10-18T09:12:00Z',
    updated_at: '2026-11-17T14:40:00Z'
  },
  {
    id: 'pur-105',
    product_name: 'Anker Prime 20,000mAh Laptop Power Bank',
    retailer: 'Amazon',
    order_number: '114-8291048-2819203',
    price: 129.99,
    currency: 'USD',
    purchase_date: '2026-11-04',
    delivery_date: '2026-11-06',
    return_policy_days: 30,
    return_deadline: '2026-12-04',
    status: 'DROPPED_OFF',
    category: 'Electronics',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 129.99,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Whole Foods Market Drop-off',
    return_tracking_number: '1Z8739182390192847',
    return_carrier: 'UPS',
    return_reason: 'Defective / Port Loose',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Packaged in original box',
    receipt_url: '/uploads/receipt_amazon.svg',
    return_label_url: null,
    image_url: '/images/products/anker_powerbank.svg',
    notes: 'Dropped off at Whole Foods customer service counter using Amazon QR Code. Holding receipt #WF-8819.',
    tags: JSON.stringify(['#amazon', '#in-transit']),
    timeline: JSON.stringify([
      { date: '2026-11-04', title: 'Purchased', note: 'Amazon Prime 1-day delivery' },
      { date: '2026-11-15', title: 'Return Initiated', note: 'Reason: USB-C port loose connection' },
      { date: '2026-11-18', title: 'Dropped Off', note: 'Customer Service Whole Foods scanning confirmed' }
    ]),
    created_at: '2026-11-04T12:00:00Z',
    updated_at: '2026-11-18T16:15:00Z'
  },
  {
    id: 'pur-106',
    product_name: 'Sephora Favorites Deluxe Fragrance Sampler',
    retailer: 'Sephora',
    order_number: 'SEP-9810482',
    price: 85.00,
    currency: 'USD',
    purchase_date: '2026-10-30',
    delivery_date: '2026-11-02',
    return_policy_days: 30,
    return_deadline: '2026-11-29',
    status: 'DELIVERED_TO_SELLER',
    category: 'Beauty & Health',
    payment_method: 'Debit Card',
    refund_method: 'Original Payment',
    expected_refund_amount: 85.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Prepaid USPS Return',
    return_tracking_number: '9405511899223192837102',
    return_carrier: 'USPS',
    return_reason: 'Not as Pictured',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Gently used allowed under 30-day window',
    receipt_url: '/uploads/receipt_sephora.svg',
    return_label_url: null,
    image_url: '/images/products/sephora_perfume.svg',
    notes: 'USPS Tracking shows delivered to Sephora Maryland warehouse on Nov 17. Awaiting inspection and refund confirmation.',
    tags: JSON.stringify(['#beauty', '#delivered-to-seller']),
    timeline: JSON.stringify([
      { date: '2026-10-30', title: 'Purchased', note: 'Sephora App VIB Rouge' },
      { date: '2026-11-11', title: 'Dropped Off', note: 'Handed to postal carrier' },
      { date: '2026-11-17', title: 'Delivered to Facility', note: 'Delivered at Sephora Return Logistics Center' }
    ]),
    created_at: '2026-10-30T10:00:00Z',
    updated_at: '2026-11-17T11:30:00Z'
  },
  {
    id: 'pur-107',
    product_name: 'ASOS Design Oversized Puffer Coat with Hood',
    retailer: 'ASOS',
    order_number: 'ASOS-77192841',
    price: 115.00,
    currency: 'USD',
    purchase_date: '2026-10-10',
    delivery_date: '2026-10-14',
    return_policy_days: 28,
    return_deadline: '2026-11-07',
    status: 'REFUND_PENDING',
    category: 'Clothing & Apparel',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 115.00,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'UPS Drop-off',
    return_tracking_number: '1Z9182390192847162',
    return_carrier: 'UPS',
    return_reason: 'Wrong Size/Fit',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Original tags attached',
    receipt_url: '/uploads/receipt_asos.svg',
    return_label_url: null,
    image_url: '/images/products/asos_puffer.svg',
    notes: 'ALERT: ASOS confirmed warehouse receipt on Nov 8 (12 days ago!). Expected refund turnaround is 7 days. Refund is currently OVERDUE by 5 days. Ready to send dispute letter!',
    tags: JSON.stringify(['#overdue-refund', '#dispute-candidate', '#apparel']),
    timeline: JSON.stringify([
      { date: '2026-10-10', title: 'Purchased', note: 'Online order' },
      { date: '2026-10-28', title: 'Return Initiated', note: 'Generated return code' },
      { date: '2026-11-02', title: 'Dropped Off', note: 'UPS Store receipt retained' },
      { date: '2026-11-08', title: 'Delivered to ASOS Warehouse', note: 'Confirmed received by ASOS Atlanta Depot' },
      { date: '2026-11-19', title: 'Overdue Alert', note: 'Exceeded 7-day policy window without credit' }
    ]),
    created_at: '2026-10-10T15:00:00Z',
    updated_at: '2026-11-19T09:30:00Z'
  },
  {
    id: 'pur-108',
    product_name: 'Dell UltraSharp 27 4K USB-C Hub Monitor (U2723QE)',
    retailer: 'Dell',
    order_number: 'DELL-4491820',
    price: 620.00,
    currency: 'USD',
    purchase_date: '2026-10-12',
    delivery_date: '2026-10-15',
    return_policy_days: 30,
    return_deadline: '2026-11-11',
    status: 'DISPUTED',
    category: 'Electronics',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 620.00,
    actual_refund_amount: 527.00,
    refund_received_date: '2026-11-15',
    return_method: 'FedEx Drop-off with RMA',
    return_tracking_number: '789123849182',
    return_carrier: 'FedEx',
    return_reason: 'Defective Screen Tint',
    return_shipping_cost: 0,
    restocking_fee: 93.00,
    condition_required: 'RMA number written on label, factory accessories',
    receipt_url: '/uploads/receipt_dell.svg',
    return_label_url: null,
    image_url: '/images/products/dell_monitor.svg',
    notes: 'DISCREPANCY DETECTED: Dell refunded $527.00, deducting $93.00 (15% restocking fee) despite item having panel yellow tint defect. Dispute letter drafted to challenge unauthorized deduction.',
    tags: JSON.stringify(['#dispute', '#restocking-fee-contested', '#tech']),
    timeline: JSON.stringify([
      { date: '2026-10-12', title: 'Purchased', note: 'Dell Premier Store' },
      { date: '2026-10-28', title: 'RMA Issued', note: 'Reported defective panel uniformity' },
      { date: '2026-11-04', title: 'Delivered to Dell', note: 'FedEx signature recorded' },
      { date: '2026-11-15', title: 'Partial Refund Credited', note: 'Received $527.00 ($93.00 fee deducted)' },
      { date: '2026-11-16', title: 'Dispute Flagged', note: 'Discrepancy logged in ReturnRadar' }
    ]),
    created_at: '2026-10-12T14:10:00Z',
    updated_at: '2026-11-16T12:00:00Z'
  },
  {
    id: 'pur-109',
    product_name: 'Bose QuietComfort Ultra Noise-Cancelling Earbuds',
    retailer: 'Amazon',
    order_number: '113-9028471-1928471',
    price: 299.00,
    currency: 'USD',
    purchase_date: '2026-10-15',
    delivery_date: '2026-10-17',
    return_policy_days: 30,
    return_deadline: '2026-11-14',
    status: 'REFUNDED',
    category: 'Electronics',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 299.00,
    actual_refund_amount: 299.00,
    refund_received_date: '2026-11-13',
    return_method: 'UPS Store Drop-off',
    return_tracking_number: '1Z0918239019284712',
    return_carrier: 'UPS',
    return_reason: 'Changed Mind',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Original packaging',
    receipt_url: '/uploads/receipt_bose.svg',
    return_label_url: null,
    image_url: '/images/products/bose_earbuds.svg',
    notes: 'SUCCESSFUL RECOVERY: Full refund of $299.00 credited back to Visa ending in 4092 within 48 hours of drop-off.',
    tags: JSON.stringify(['#recovered', '#completed']),
    timeline: JSON.stringify([
      { date: '2026-10-15', title: 'Purchased', note: 'Amazon.com' },
      { date: '2026-11-09', title: 'Return Initiated', note: 'Selected UPS dropoff' },
      { date: '2026-11-11', title: 'Dropped Off', note: 'UPS Store receipt #991' },
      { date: '2026-11-13', title: 'Full Refund Processed', note: '$299.00 credited to Visa' }
    ]),
    created_at: '2026-10-15T11:00:00Z',
    updated_at: '2026-11-13T17:45:00Z'
  },
  {
    id: 'pur-110',
    product_name: 'Patagonia Men’s Nano Puff Insulated Jacket',
    retailer: 'REI',
    order_number: 'REI-99104820',
    price: 239.00,
    currency: 'USD',
    purchase_date: '2026-09-20',
    delivery_date: '2026-09-23',
    return_policy_days: 365,
    return_deadline: '2027-09-20',
    status: 'REFUNDED',
    category: 'Clothing & Apparel',
    payment_method: 'Credit Card (Mastercard)',
    refund_method: 'Original Payment',
    expected_refund_amount: 239.00,
    actual_refund_amount: 239.00,
    refund_received_date: '2026-11-05',
    return_method: 'In-Store Return',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: 'Wrong Size/Fit',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'REI Co-op member guarantee',
    receipt_url: '/uploads/receipt_patagonia.svg',
    return_label_url: null,
    image_url: '/images/products/patagonia_jacket.svg',
    notes: 'Returned in-store at REI Seattle Flagship. Instant refund to credit card.',
    tags: JSON.stringify(['#outdoor', '#recovered', '#in-store']),
    timeline: JSON.stringify([
      { date: '2026-09-20', title: 'Purchased', note: 'REI Online Store' },
      { date: '2026-11-05', title: 'Returned In-Store', note: 'Processed at customer counter' },
      { date: '2026-11-05', title: 'Refunded', note: 'Instant credit of $239.00' }
    ]),
    created_at: '2026-09-20T16:00:00Z',
    updated_at: '2026-11-05T13:20:00Z'
  },
  {
    id: 'pur-111',
    product_name: 'Dyson V15 Detect Cordless Stick Vacuum',
    retailer: 'Target',
    order_number: 'TGT-90182940',
    price: 749.99,
    currency: 'USD',
    purchase_date: '2026-10-01',
    delivery_date: '2026-10-04',
    return_policy_days: 90,
    return_deadline: '2026-12-30', // 40 days left (SAFE)
    status: 'KEEP',
    category: 'Home & Kitchen',
    payment_method: 'Target Circle Card',
    refund_method: 'Original Payment',
    expected_refund_amount: 749.99,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Target Guest Services',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: null,
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: 'Original packaging and accessories',
    receipt_url: '/uploads/receipt_dyson.svg',
    return_label_url: null,
    image_url: '/images/products/dyson_vacuum.svg',
    notes: 'Decided to keep! The laser illumination and filtration are fantastic. Warranty registered with Dyson.',
    tags: JSON.stringify(['#home', '#appliances', '#decided-to-keep']),
    timeline: JSON.stringify([
      { date: '2026-10-01', title: 'Purchased', note: 'Target Circle bonus points' },
      { date: '2026-11-10', title: 'Status Updated', note: 'Marked as KEEP' }
    ]),
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-11-10T15:00:00Z'
  },
  {
    id: 'pur-112',
    product_name: 'Logitech MX Master 3S Wireless Performance Mouse',
    retailer: 'Walmart',
    order_number: 'WMT-11029482',
    price: 99.99,
    currency: 'USD',
    purchase_date: '2026-09-12',
    delivery_date: '2026-09-15',
    return_policy_days: 30,
    return_deadline: '2026-10-15', // Past deadline (EXPIRED)
    status: 'EXPIRED',
    category: 'Electronics',
    payment_method: 'Credit Card (Visa)',
    refund_method: 'Original Payment',
    expected_refund_amount: 99.99,
    actual_refund_amount: null,
    refund_received_date: null,
    return_method: 'Walmart Store Return',
    return_tracking_number: null,
    return_carrier: 'In-Store',
    return_reason: 'Ergonomic shape too large',
    return_shipping_cost: 0,
    restocking_fee: 0,
    condition_required: '30-day electronics policy',
    receipt_url: '/uploads/receipt_logitech.svg',
    return_label_url: null,
    image_url: '/images/products/logitech_mouse.svg',
    notes: 'MISSED DEADLINE: Intended to return due to hand cramps, but missed 30-day electronics window by 36 days. Sold on eBay instead or can request courtesy exchange.',
    tags: JSON.stringify(['#missed-window', '#tech', '#lesson-learned']),
    timeline: JSON.stringify([
      { date: '2026-09-12', title: 'Purchased', note: 'Walmart online' },
      { date: '2026-10-15', title: 'Window Expired', note: '30 days elapsed without return action' }
    ]),
    created_at: '2026-09-12T13:00:00Z',
    updated_at: '2026-10-16T00:00:00Z'
  }
];

function seedDatabase(db) {
  // Check if retailers exist
  const existingRetailers = db.prepare('SELECT COUNT(*) as count FROM retailers').get();
  if (existingRetailers.count === 0) {
    const insertRetailer = db.prepare(`
      INSERT INTO retailers (
        id, name, return_days, policy_type, free_returns, return_shipping_fee,
        restocking_fee_note, dropoff_locations, average_refund_days, condition_notes,
        website, badge_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const ret of RETAILERS) {
      insertRetailer.run(
        ret.id, ret.name, ret.return_days, ret.policy_type, ret.free_returns,
        ret.return_shipping_fee, ret.restocking_fee_note, ret.dropoff_locations,
        ret.average_refund_days, ret.condition_notes, ret.website, ret.badge_color
      );
    }
    console.log(`Seeded ${RETAILERS.length} retailers.`);
  }

  // Check dispute templates
  const existingTemplates = db.prepare('SELECT COUNT(*) as count FROM dispute_templates').get();
  if (existingTemplates.count === 0) {
    const insertTemplate = db.prepare(`
      INSERT INTO dispute_templates (id, title, category, subject, body)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const tmpl of DISPUTE_TEMPLATES) {
      insertTemplate.run(tmpl.id, tmpl.title, tmpl.category, tmpl.subject, tmpl.body);
    }
    console.log(`Seeded ${DISPUTE_TEMPLATES.length} dispute templates.`);
  }

  // Check purchases
  const existingPurchases = db.prepare('SELECT COUNT(*) as count FROM purchases').get();
  if (existingPurchases.count === 0) {
    const insertPurchase = db.prepare(`
      INSERT INTO purchases (
        id, product_name, retailer, order_number, price, currency,
        purchase_date, delivery_date, return_policy_days, return_deadline,
        status, category, payment_method, refund_method, expected_refund_amount,
        actual_refund_amount, refund_received_date, return_method, return_tracking_number,
        return_carrier, return_reason, return_shipping_cost, restocking_fee,
        condition_required, receipt_url, return_label_url, image_url, notes, tags, timeline,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?
      )
    `);

    for (const p of SAMPLE_PURCHASES) {
      insertPurchase.run(
        p.id, p.product_name, p.retailer, p.order_number, p.price, p.currency,
        p.purchase_date, p.delivery_date, p.return_policy_days, p.return_deadline,
        p.status, p.category, p.payment_method, p.refund_method, p.expected_refund_amount,
        p.actual_refund_amount, p.refund_received_date, p.return_method, p.return_tracking_number,
        p.return_carrier, p.return_reason, p.return_shipping_cost, p.restocking_fee,
        p.condition_required, p.receipt_url, p.return_label_url, p.image_url || null, p.notes, p.tags, p.timeline,
        p.created_at, p.updated_at
      );
    }
    console.log(`Seeded ${SAMPLE_PURCHASES.length} sample purchases.`);
  }

  // Generate initial notifications
  const existingNotifs = db.prepare('SELECT COUNT(*) as count FROM notifications').get();
  if (existingNotifs.count === 0) {
    const insertNotif = db.prepare(`
      INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertNotif.run(
      'notif-1',
      'pur-102',
      '🚨 Critical Deadline: Best Buy Camera',
      'Sony Alpha a7 IV return window closes in under 48 hours! $2,498.00 at risk.',
      'critical',
      0,
      '2026-11-20T08:00:00Z'
    );

    insertNotif.run(
      'notif-2',
      'pur-107',
      '💰 Refund Overdue: ASOS Puffer Coat',
      'Item delivered to ASOS warehouse 12 days ago without refund credit ($115.00). Dispute template ready.',
      'warning',
      0,
      '2026-11-19T14:00:00Z'
    );

    insertNotif.run(
      'notif-3',
      'pur-108',
      '⚠️ Refund Discrepancy: Dell Monitor',
      'Dell deducted $93.00 restocking fee from your return. Review dispute letter.',
      'alert',
      0,
      '2026-11-16T12:00:00Z'
    );

    insertNotif.run(
      'notif-4',
      'pur-104',
      '📦 Action Needed: Nike Running Shoes',
      'Return label generated for Nike Pegasus 40. Remember to drop off at UPS.',
      'info',
      0,
      '2026-11-18T10:00:00Z'
    );
  }
}

function resetDatabase(db) {
  db.exec('DELETE FROM purchases');
  db.exec('DELETE FROM retailers');
  db.exec('DELETE FROM dispute_templates');
  db.exec('DELETE FROM notifications');
  seedDatabase(db);
}

module.exports = {
  RETAILERS,
  DISPUTE_TEMPLATES,
  SAMPLE_PURCHASES,
  seedDatabase,
  resetDatabase
};
