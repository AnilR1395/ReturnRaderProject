// server/seedStoreData.js - Pre-seeded Flipkart-style products, users, and orders
const { randomUUID } = require('node:crypto');

const STORE_PRODUCTS = [
  {
    id: 'prod-iphone16',
    title: 'Apple iPhone 16 Pro Max (Desert Titanium, 256 GB)',
    brand: 'Apple',
    price: 1199.00,
    original_mrp: 1399.00,
    discount_percent: 14,
    rating: 4.8,
    rating_count: 3420,
    category: 'Mobiles',
    image_url: '/images/products/airpods_max.svg', // will use high res
    return_policy_days: 7,
    return_policy_type: '7 Days Replacement Policy',
    stock: 25,
    is_assured: 1,
    description: 'A18 Pro chip, Grade 5 Titanium design, 48MP Fusion Camera, and revolutionary Camera Control button.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-s24ultra',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    brand: 'Samsung',
    price: 1099.00,
    original_mrp: 1299.00,
    discount_percent: 15,
    rating: 4.7,
    rating_count: 2890,
    category: 'Mobiles',
    image_url: '/images/products/dell_monitor.svg',
    return_policy_days: 7,
    return_policy_type: '7 Days Replacement Policy',
    stock: 18,
    is_assured: 1,
    description: 'Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3 for Galaxy, and built-in S Pen.',
    delivery_time: 'Tomorrow, by 9 PM'
  },
  {
    id: 'prod-airpodsmax',
    title: 'Apple AirPods Max Bluetooth Headset (Space Gray)',
    brand: 'Apple',
    price: 549.00,
    original_mrp: 599.00,
    discount_percent: 8,
    rating: 4.6,
    rating_count: 1450,
    category: 'Electronics',
    image_url: '/images/products/airpods_max.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Return or Replacement',
    stock: 12,
    is_assured: 1,
    description: 'Apple-designed dynamic driver with Active Noise Cancellation and Transparency mode. Spatial audio with dynamic head tracking.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-sonycamera',
    title: 'Sony Alpha a7 IV Mirrorless Camera Body (Black)',
    brand: 'Sony',
    price: 2498.00,
    original_mrp: 2699.00,
    discount_percent: 7,
    rating: 4.9,
    rating_count: 820,
    category: 'Electronics',
    image_url: '/images/products/sony_camera.svg',
    return_policy_days: 15,
    return_policy_type: '15 Days Return Policy (Restocking fee on unsealed)',
    stock: 6,
    is_assured: 1,
    description: '33MP full-frame Exmor R back-illuminated CMOS sensor, BIONZ XR processing engine, 4K 60p 10-bit 4:2:2 recording.',
    delivery_time: 'In 2 days, by 2 PM'
  },
  {
    id: 'prod-zarablazer',
    title: 'Zara Tailored Wool-Blend Structured Slim Blazer',
    brand: 'Zara',
    price: 159.00,
    original_mrp: 219.00,
    discount_percent: 27,
    rating: 4.4,
    rating_count: 670,
    category: 'Fashion',
    image_url: '/images/products/zara_blazer.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Hassle-Free Return (Tags required)',
    stock: 35,
    is_assured: 1,
    description: 'Premium Italian wool-blend blazer featuring notched lapels, chest welt pocket, and double button closure.',
    delivery_time: 'Tomorrow, by 8 PM'
  },
  {
    id: 'prod-nikepegasus',
    title: 'Nike Air Zoom Pegasus 40 Road Running Shoes (Blue/Lime)',
    brand: 'Nike',
    price: 130.00,
    original_mrp: 160.00,
    discount_percent: 18,
    rating: 4.7,
    rating_count: 4210,
    category: 'Footwear',
    image_url: '/images/products/nike_pegasus.svg',
    return_policy_days: 60,
    return_policy_type: '60 Days Wear Trial Return Guarantee',
    stock: 40,
    is_assured: 1,
    description: 'Responsive cushioning in the Pegasus delivers an energized ride for everyday road running. Experience lighter weight React foam.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-ankerpower',
    title: 'Anker Prime 20,000mAh Power Bank (200W Output with Smart Display)',
    brand: 'Anker',
    price: 129.99,
    original_mrp: 159.99,
    discount_percent: 18,
    rating: 4.8,
    rating_count: 3120,
    category: 'Electronics',
    image_url: '/images/products/anker_powerbank.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Full Refund Guarantee',
    stock: 55,
    is_assured: 1,
    description: 'Massive 200W total output capable of fast charging two 14-inch MacBooks simultaneously. Built-in smart TFT digital display.',
    delivery_time: 'Tomorrow, by 6 PM'
  },
  {
    id: 'prod-sephoraperfume',
    title: 'Sephora Favorites Deluxe Eau de Parfum Sampler Collection',
    brand: 'Sephora',
    price: 85.00,
    original_mrp: 110.00,
    discount_percent: 22,
    rating: 4.5,
    rating_count: 980,
    category: 'Beauty',
    image_url: '/images/products/sephora_perfume.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Return (Gently used accepted)',
    stock: 22,
    is_assured: 1,
    description: 'Curated 7-piece luxury fragrance wardrobe with miniature spray bottles from Yves Saint Laurent, Gucci, and Maison Margiela.',
    delivery_time: 'Tomorrow, by 8 PM'
  },
  {
    id: 'prod-asospuffer',
    title: 'ASOS Design Oversized Heavyweight Puffer Coat (Matte Black)',
    brand: 'ASOS',
    price: 115.00,
    original_mrp: 145.00,
    discount_percent: 20,
    rating: 4.3,
    rating_count: 750,
    category: 'Fashion',
    image_url: '/images/products/asos_puffer.svg',
    return_policy_days: 28,
    return_policy_type: '28 Days Return with Free Drop-off QR',
    stock: 30,
    is_assured: 1,
    description: 'Stay insulated in chilly weather with this exaggerated baffle duvet coat. Thermal lining, high neck storm flap, and fleece-lined pockets.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-dellmonitor',
    title: 'Dell UltraSharp 27 4K USB-C Hub Monitor (U2723QE IPS Black)',
    brand: 'Dell',
    price: 620.00,
    original_mrp: 749.00,
    discount_percent: 17,
    rating: 4.8,
    rating_count: 1120,
    category: 'Electronics',
    image_url: '/images/products/dell_monitor.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Invoice Window',
    stock: 14,
    is_assured: 1,
    description: 'Groundbreaking IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 wide color gamut, and 90W USB-C Power Delivery.',
    delivery_time: 'In 2 days, by 4 PM'
  },
  {
    id: 'prod-boseearbuds',
    title: 'Bose QuietComfort Ultra True Wireless Noise Cancelling Earbuds',
    brand: 'Bose',
    price: 299.00,
    original_mrp: 329.00,
    discount_percent: 9,
    rating: 4.6,
    rating_count: 2450,
    category: 'Electronics',
    image_url: '/images/products/bose_earbuds.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Full Refund Window',
    stock: 20,
    is_assured: 1,
    description: 'Breakthrough spatialized audio for more immersive listening. World-class quiet mode with CustomTune technology.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-patagoniajacket',
    title: 'Patagonia Men\'s Nano Puff Lightweight Insulated Jacket',
    brand: 'Patagonia',
    price: 239.00,
    original_mrp: 279.00,
    discount_percent: 14,
    rating: 4.9,
    rating_count: 3680,
    category: 'Fashion',
    image_url: '/images/products/patagonia_jacket.svg',
    return_policy_days: 365,
    return_policy_type: '365 Days Co-op Member Satisfaction Guarantee',
    stock: 28,
    is_assured: 1,
    description: 'Warm, windproof, water-resistant—the Nano Puff Jacket uses incredibly lightweight and highly compressible 60-g PrimaLoft Gold Insulation.',
    delivery_time: 'Tomorrow, by 7 PM'
  },
  {
    id: 'prod-dysonvacuum',
    title: 'Dyson V15 Detect Cordless Vacuum Cleaner with Laser Head',
    brand: 'Dyson',
    price: 749.99,
    original_mrp: 849.99,
    discount_percent: 11,
    rating: 4.8,
    rating_count: 1890,
    category: 'Home & Kitchen',
    image_url: '/images/products/dyson_vacuum.svg',
    return_policy_days: 90,
    return_policy_type: '90 Days Generous Return Policy',
    stock: 9,
    is_assured: 1,
    description: 'Laser reveals microscopic dust. Intelligently optimizes suction and run time. Scientific proof of a deep clean on the LCD screen.',
    delivery_time: 'Tomorrow, by 11 PM'
  },
  {
    id: 'prod-logitechmouse',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse',
    brand: 'Logitech',
    price: 99.99,
    original_mrp: 119.99,
    discount_percent: 16,
    rating: 4.9,
    rating_count: 8900,
    category: 'Electronics',
    image_url: '/images/products/logitech_mouse.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Replacement or Return',
    stock: 60,
    is_assured: 1,
    description: 'Quiet Clicks, 8K DPI any-surface tracking, and ultra-fast MagSpeed electromagnetic scrolling wheel.',
    delivery_time: 'Tomorrow, by 5 PM'
  },
  {
    id: 'prod-instantpot',
    title: 'Instant Pot Duo 7-in-1 Multi-Use Programmable Pressure Cooker (6 Qt)',
    brand: 'Instant Pot',
    price: 89.99,
    original_mrp: 129.99,
    discount_percent: 31,
    rating: 4.8,
    rating_count: 24100,
    category: 'Home & Kitchen',
    image_url: '/images/products/instant_pot.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Replacement or Return',
    stock: 45,
    is_assured: 1,
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. Essential daily home cooking.',
    delivery_time: 'Tomorrow, by 11 AM'
  },
  {
    id: 'prod-kettle',
    title: 'Morphy Richards 1.7L Rapid Boil Stainless Steel Electric Kettle',
    brand: 'Morphy Richards',
    price: 24.99,
    original_mrp: 39.99,
    discount_percent: 38,
    rating: 4.7,
    rating_count: 9800,
    category: 'Home & Kitchen',
    image_url: '/images/products/electric_kettle.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Replacement Guarantee',
    stock: 75,
    is_assured: 1,
    description: 'Boils 1.7L of water in under 3 minutes with 2200W rapid boil element, auto shut-off, and boil-dry protection. Daily tea and coffee staple.',
    delivery_time: 'Tomorrow, by 1 PM'
  },
  {
    id: 'prod-nutribullet',
    title: 'NutriBullet Pro 900W High-Speed Personal Nutrient Extractor & Blender',
    brand: 'NutriBullet',
    price: 69.99,
    original_mrp: 99.99,
    discount_percent: 30,
    rating: 4.8,
    rating_count: 18400,
    category: 'Home & Kitchen',
    image_url: '/images/products/coffee_blender.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Return or Replacement',
    stock: 35,
    is_assured: 1,
    description: 'Powerful 900-watt motor breaks down tough ingredients like seeds, nuts, and whole fruits for daily morning smoothies, shakes, and protein blends.',
    delivery_time: 'Tomorrow, by 4 PM'
  },
  {
    id: 'prod-waterbottle',
    title: 'Milton Thermosteel Flip Lid Vacuum Insulated Hot & Cold Bottle (1000 ml)',
    brand: 'Milton',
    price: 18.99,
    original_mrp: 26.99,
    discount_percent: 30,
    rating: 4.9,
    rating_count: 31200,
    category: 'Home & Kitchen',
    image_url: '/images/products/water_bottle.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Replacement Policy',
    stock: 120,
    is_assured: 1,
    description: '100% leak-proof, food-grade 304 stainless steel. Keeps drinks ice cold for 24 hours or steaming hot for 24 hours. Daily gym, office, and travel essential.',
    delivery_time: 'Tomorrow, by 11 AM'
  },
  {
    id: 'prod-humidifier',
    title: 'Smart Ultrasonic Cool Mist Room Humidifier 4.5L with Essential Oil Diffuser',
    brand: 'Dr. Trust',
    price: 32.99,
    original_mrp: 49.99,
    discount_percent: 34,
    rating: 4.6,
    rating_count: 6700,
    category: 'Home & Kitchen',
    image_url: '/images/products/smart_humidifier.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Return Guarantee',
    stock: 40,
    is_assured: 1,
    description: 'Whisper-quiet ultrasonic operation with 4.5L tank lasting up to 36 hours. Relieves dry throat, nasal congestion, and dry skin for restful night sleep.',
    delivery_time: 'Tomorrow, by 6 PM'
  },
  {
    id: 'prod-toothbrush',
    title: 'Oral-B Pro 1000 CrossAction Rechargeable Electric Toothbrush',
    brand: 'Oral-B',
    price: 39.99,
    original_mrp: 59.99,
    discount_percent: 33,
    rating: 4.8,
    rating_count: 42000,
    category: 'Beauty',
    image_url: '/images/products/electric_toothbrush.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Money Back Guarantee',
    stock: 80,
    is_assured: 1,
    description: 'Removes 300% more plaque along the gumline than a manual toothbrush. Includes built-in 2-minute timer and pressure sensor to protect gums.',
    delivery_time: 'Tomorrow, by 11 AM'
  },
  {
    id: 'prod-cerave',
    title: 'CeraVe Daily Hydrating Facial Cleanser (473ml) & Moisturizing Lotion (355ml) Combo',
    brand: 'CeraVe',
    price: 24.99,
    original_mrp: 34.99,
    discount_percent: 29,
    rating: 4.9,
    rating_count: 53000,
    category: 'Beauty',
    image_url: '/images/products/skincare_combo.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Return Policy',
    stock: 110,
    is_assured: 1,
    description: 'Dermatologist recommended daily skincare duo with 3 essential ceramides and hyaluronic acid to restore the protective skin barrier.',
    delivery_time: 'Tomorrow, by 2 PM'
  },
  {
    id: 'prod-applewatch',
    title: 'Apple Watch Series 10 (GPS, 46mm OLED Retina Display, Jet Black Aluminum)',
    brand: 'Apple',
    price: 399.00,
    original_mrp: 429.00,
    discount_percent: 7,
    rating: 4.8,
    rating_count: 6400,
    category: 'Electronics',
    image_url: '/images/products/smartwatch.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Replacement or Return',
    stock: 22,
    is_assured: 1,
    description: 'Thinnest Apple Watch ever with our biggest display. Advanced daily fitness metrics, sleep apnea detection, ECG, crash detection, and fast charging.',
    delivery_time: 'Tomorrow, by 11 AM'
  },
  {
    id: 'prod-kindle',
    title: 'Amazon Kindle Paperwhite (16 GB, 6.8" 300 ppi Glare-Free Display, Warm Light)',
    brand: 'Amazon',
    price: 139.99,
    original_mrp: 159.99,
    discount_percent: 13,
    rating: 4.8,
    rating_count: 38900,
    category: 'Electronics',
    image_url: '/images/products/kindle_reader.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Return Policy',
    stock: 35,
    is_assured: 1,
    description: 'Reads like real paper even in bright sunlight. Up to 10 weeks of battery life, adjustable warm light, and waterproof design for daily reading anywhere.',
    delivery_time: 'Tomorrow, by 3 PM'
  },
  {
    id: 'prod-jblspeaker',
    title: 'JBL Flip 6 Waterproof Portable Bluetooth Speaker with 12-Hour Battery',
    brand: 'JBL',
    price: 99.99,
    original_mrp: 129.99,
    discount_percent: 23,
    rating: 4.8,
    rating_count: 21500,
    category: 'Electronics',
    image_url: '/images/products/bluetooth_speaker.svg',
    return_policy_days: 14,
    return_policy_type: '14 Days Replacement Guarantee',
    stock: 50,
    is_assured: 1,
    description: 'IP67 waterproof and dustproof. Bold JBL Original Pro Sound with 2-way speaker system delivering crystal clear highs and deep punchy bass.',
    delivery_time: 'Tomorrow, by 12 PM'
  },
  {
    id: 'prod-backpack',
    title: 'Wildcraft 35L Water-Resistant Ergonomic Commuter Laptop Backpack with Rain Cover',
    brand: 'Wildcraft',
    price: 34.99,
    original_mrp: 49.99,
    discount_percent: 30,
    rating: 4.7,
    rating_count: 14200,
    category: 'Fashion',
    image_url: '/images/products/laptop_backpack.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Return or Exchange',
    stock: 85,
    is_assured: 1,
    description: 'Dedicated 15.6" padded laptop sleeve, 3 spacious compartments, breathable air-mesh back padding, and integrated rain cover. Daily office/college carry.',
    delivery_time: 'Tomorrow, by 11 AM'
  },
  {
    id: 'prod-crocs',
    title: 'Crocs Unisex Classic All-Day Comfort Slip-On Clogs with Arch Support',
    brand: 'Crocs',
    price: 39.99,
    original_mrp: 49.99,
    discount_percent: 20,
    rating: 4.8,
    rating_count: 76000,
    category: 'Footwear',
    image_url: '/images/products/crocs_clogs.svg',
    return_policy_days: 30,
    return_policy_type: '30 Days Hassle-Free Returns',
    stock: 95,
    is_assured: 1,
    description: 'Incredibly light and easy to wear. Croslite foam cushioning, pivoting heel straps, and ventilation ports for water and debris shedding. Daily comfort footwear.',
    delivery_time: 'Tomorrow, by 10 AM'
  }
];

const DEMO_USERS = [
  {
    id: 'usr-rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    address: 'Flat 402, Prestige Greenwoods, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
    is_plus_member: 1,
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 'usr-priya',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 91234 56789',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    address: 'Tower 4, Apt 803, Palm Grove Heights, HSR Layout, Bengaluru 560102',
    is_plus_member: 1,
    created_at: '2026-02-10T11:00:00Z'
  },
  {
    id: 'usr-alex',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 415 555 2671',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    address: '742 Evergreen Terrace, Palo Alto, CA 94301',
    is_plus_member: 0,
    created_at: '2026-03-01T09:00:00Z'
  }
];

const DEFAULT_USER = DEMO_USERS[0];

const SAMPLE_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'OD8829104192',
    user_id: 'usr-rahul',
    items: JSON.stringify([
      {
        product_id: 'prod-s24ultra',
        title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
        brand: 'Samsung',
        price: 1099.00,
        original_mrp: 1299.00,
        quantity: 1,
        image_url: '/images/products/dell_monitor.svg',
        return_policy_days: 7
      }
    ]),
    total_amount: 1099.00,
    original_mrp_total: 1299.00,
    discount_amount: 200.00,
    payment_status: 'PENDING',
    payment_method: 'Reserve & Pay Later',
    payment_deadline: '2026-11-25T14:30:00Z', // Active payment deadline!
    payment_deadline_alert_sent: 0,
    order_status: 'PAYMENT_PENDING',
    delivery_date: 'Expected Nov 27',
    shipping_address: 'Flat 402, Prestige Greenwoods, Indiranagar, Bengaluru 560038',
    tracking_number: 'EKART-8829104',
    carrier: 'Ekart Logistics',
    return_deadline: null,
    return_policy_days: 7,
    purchase_id: null,
    created_at: '2026-11-24T14:30:00Z',
    updated_at: '2026-11-24T14:30:00Z'
  },
  {
    id: 'ord-102',
    order_number: 'OD7729104812',
    user_id: 'usr-rahul',
    items: JSON.stringify([
      {
        product_id: 'prod-airpodsmax',
        title: 'Apple AirPods Max Bluetooth Headset (Space Gray)',
        brand: 'Apple',
        price: 549.00,
        original_mrp: 599.00,
        quantity: 1,
        image_url: '/images/products/airpods_max.svg',
        return_policy_days: 14
      }
    ]),
    total_amount: 549.00,
    original_mrp_total: 599.00,
    discount_amount: 50.00,
    payment_status: 'PAID',
    payment_method: 'UPI (Google Pay)',
    payment_deadline: null,
    payment_deadline_alert_sent: 0,
    order_status: 'DELIVERED',
    delivery_date: '2026-11-20',
    shipping_address: 'Flat 402, Prestige Greenwoods, Indiranagar, Bengaluru 560038',
    tracking_number: 'FMPC092182910',
    carrier: 'Ekart Logistics',
    return_deadline: '2026-12-04', // Active return window!
    return_policy_days: 14,
    purchase_id: 'pur-101',
    created_at: '2026-11-18T10:00:00Z',
    updated_at: '2026-11-20T16:20:00Z'
  },
  {
    id: 'ord-103',
    order_number: 'OD6619284019',
    user_id: 'usr-rahul',
    items: JSON.stringify([
      {
        product_id: 'prod-nikepegasus',
        title: 'Nike Air Zoom Pegasus 40 Road Running Shoes (Blue/Lime)',
        brand: 'Nike',
        price: 130.00,
        original_mrp: 160.00,
        quantity: 1,
        image_url: '/images/products/nike_pegasus.svg',
        return_policy_days: 60
      }
    ]),
    total_amount: 130.00,
    original_mrp_total: 160.00,
    discount_amount: 30.00,
    payment_status: 'PAID',
    payment_method: 'Credit Card (HDFC Bank)',
    payment_deadline: null,
    payment_deadline_alert_sent: 0,
    order_status: 'OUT_FOR_DELIVERY',
    delivery_date: 'Today, by 9 PM',
    shipping_address: 'Flat 402, Prestige Greenwoods, Indiranagar, Bengaluru 560038',
    tracking_number: 'FMPC081928312',
    carrier: 'Delhivery Express',
    return_deadline: null,
    return_policy_days: 60,
    purchase_id: 'pur-104',
    created_at: '2026-11-22T08:15:00Z',
    updated_at: '2026-11-24T09:00:00Z'
  },
  {
    id: 'ord-104',
    order_number: 'OD5519283011',
    user_id: 'usr-rahul',
    items: JSON.stringify([
      {
        product_id: 'prod-zarablazer',
        title: 'Zara Tailored Wool-Blend Structured Slim Blazer',
        brand: 'Zara',
        price: 159.00,
        original_mrp: 219.00,
        quantity: 1,
        image_url: '/images/products/zara_blazer.svg',
        return_policy_days: 30
      }
    ]),
    total_amount: 159.00,
    original_mrp_total: 219.00,
    discount_amount: 60.00,
    payment_status: 'PAID',
    payment_method: 'NetBanking (ICICI)',
    payment_deadline: null,
    payment_deadline_alert_sent: 0,
    order_status: 'RETURN_INITIATED',
    delivery_date: '2026-11-15',
    shipping_address: 'Flat 402, Prestige Greenwoods, Indiranagar, Bengaluru 560038',
    tracking_number: 'RET-ZR-58291',
    carrier: 'Ekart Return Pickup',
    return_deadline: '2026-12-15',
    return_policy_days: 30,
    purchase_id: 'pur-103',
    created_at: '2026-11-10T12:00:00Z',
    updated_at: '2026-11-23T11:00:00Z'
  },
  {
    id: 'ord-105',
    order_number: 'OD4419281001',
    user_id: 'usr-rahul',
    items: JSON.stringify([
      {
        product_id: 'prod-boseearbuds',
        title: 'Bose QuietComfort Ultra True Wireless Noise Cancelling Earbuds',
        brand: 'Bose',
        price: 299.00,
        original_mrp: 329.00,
        quantity: 1,
        image_url: '/images/products/bose_earbuds.svg',
        return_policy_days: 30
      }
    ]),
    total_amount: 299.00,
    original_mrp_total: 329.00,
    discount_amount: 30.00,
    payment_status: 'REFUNDED',
    payment_method: 'Credit Card (Visa)',
    payment_deadline: null,
    payment_deadline_alert_sent: 0,
    order_status: 'REFUNDED',
    delivery_date: '2026-10-25',
    shipping_address: 'Flat 402, Prestige Greenwoods, Indiranagar, Bengaluru 560038',
    tracking_number: 'REF-BSE-99124',
    carrier: 'Ekart Logistics',
    return_deadline: '2026-11-24',
    return_policy_days: 30,
    purchase_id: 'pur-109',
    created_at: '2026-10-20T14:00:00Z',
    updated_at: '2026-11-13T17:45:00Z'
  }
];

function seedStoreDatabase(db) {
  // Check users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, phone, password, avatar, address, is_plus_member, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const u of DEMO_USERS) {
      insertUser.run(
        u.id,
        u.name,
        u.email,
        u.phone,
        u.password,
        u.avatar,
        u.address,
        u.is_plus_member,
        u.created_at
      );
    }
    console.log(`Seeded ${DEMO_USERS.length} demo users: Rahul Sharma, Priya Patel, Alex Chen`);
  }

  // Check products - insert any missing products from STORE_PRODUCTS
  const insertProd = db.prepare(`
    INSERT OR IGNORE INTO products (
      id, title, brand, price, original_mrp, discount_percent, rating, rating_count,
      category, image_url, return_policy_days, return_policy_type, stock, is_assured,
      description, delivery_time, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of STORE_PRODUCTS) {
    insertProd.run(
      p.id, p.title, p.brand, p.price, p.original_mrp, p.discount_percent,
      p.rating, p.rating_count, p.category, p.image_url, p.return_policy_days,
      p.return_policy_type, p.stock, p.is_assured, p.description, p.delivery_time,
      new Date().toISOString()
    );
  }
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  console.log(`RadarStore catalog active: ${totalProducts} products available.`);

  // Check orders
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, items, total_amount, original_mrp_total, discount_amount,
        payment_status, payment_method, payment_deadline, payment_deadline_alert_sent,
        order_status, delivery_date, shipping_address, tracking_number, carrier,
        return_deadline, return_policy_days, purchase_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const o of SAMPLE_ORDERS) {
      insertOrder.run(
        o.id, o.order_number, o.user_id, o.items, o.total_amount, o.original_mrp_total,
        o.discount_amount, o.payment_status, o.payment_method, o.payment_deadline,
        o.payment_deadline_alert_sent, o.order_status, o.delivery_date, o.shipping_address,
        o.tracking_number, o.carrier, o.return_deadline, o.return_policy_days,
        o.purchase_id, o.created_at, o.updated_at
      );
    }
    console.log(`Seeded ${SAMPLE_ORDERS.length} sample orders.`);

    // Add a critical notification for the pending payment deadline
    const notifCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE title LIKE ?').get('%Payment Deadline%').count;
    if (notifCount === 0) {
      db.prepare(`
        INSERT INTO notifications (id, purchase_id, title, message, type, is_read, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        'notif-pay-deadline',
        null,
        '⏰ Urgent: Payment Deadline for Order #OD8829104192',
        'Complete payment of $1,099.00 before deadline expires in 17 hours to secure Samsung S24 Ultra & lock return guarantee!',
        'critical',
        0,
        new Date().toISOString()
      );
    }
  }
}

module.exports = {
  STORE_PRODUCTS,
  DEFAULT_USER,
  DEMO_USERS,
  SAMPLE_ORDERS,
  seedStoreDatabase
};
