# 📡 ReturnRadar: Purchase Return Deadline & Refund Tracker (v2.0 with Flipkart Storefront)

**ReturnRadar** is a production-grade, full-stack web application designed to eliminate missed return deadlines, forgotten refunds, and unpaid order cancellations. It pairs a **Flipkart-style e-commerce storefront** (ordering, cart drawer, checkout, payment deadline locks, status tracking) with an **Urgency Radar return deadline engine**, retailer intelligence, dispute generator, and live calendar export.

---

## 🛒 Flipkart-Style E-Commerce Features (v2.0)

### 1. 🛍️ Flipkart Storefront & Product Ordering
- **Iconic Flipkart Branding**: Authentic blue header (`#2874f0`), "Explore Plus ✦" membership badge, and animated banner carousel with Deals of the Day.
- **Category Strip**: One-click category filtering across *Mobiles & Tablets, Electronics, Fashion, Footwear, Home & Kitchen, Beauty & Grooming, and Top Offers*.
- **⚡ Flipkart Assured Quality**: Badged products with verified authentic ratings (`4.8 ★`), original MRP strike-through, percentage discounts (`14% off`), and delivery date estimations.
- **Product Details Modal**: Rich specs, high-resolution product imagery, stock availability, and return policy explanation.
- **Dual Actions**: "Add to Cart" and instant "Buy Now" checkout.

### 2. 🔐 Authentication & Flipkart User Profile
- **Split Dialog Login / Signup**: Left Flipkart branding banner with right input forms for Email/Mobile and Password/OTP.
- **1-Click Quick Demo Login**: Instantly switch to **Rahul Sharma (⭐ Flipkart Plus Member)** with pre-seeded orders.
- **Persistent User Session**: Active user state syncs with order history and profile dropdown in header.

### 3. 🛒 Cart Drawer & Price Details Breakdown
- **Live Cart Badge**: Real-time item count on navbar (`🛒 Cart [3]`).
- **Cart Management**: Item thumbnail, title, seller details, quantity stepper (`[- 1 +]`), and remove action.
- **Flipkart Price Details Card**: Total MRP, Item Discounts, Free Delivery seal, Packaging fee, Total Amount, and green savings badge (*"🎉 You will save $320.00 on this order"*).
- **One-Click Checkout**: Direct transition into secure checkout dialog.

### 4. ⏰ Notify Deadline of Payment (Live Countdown Ticking Banner)
- **"Reserve & Pay Later" Option**: Allows customers to lock in inventory and promotional discounts with a 24-hour payment lock.
- **Sticky Top Payment Deadline Banner**:
  - Eye-catching pulsating clock icon (`⏰`).
  - **Live ticking countdown display** (`16h : 38m : 14s`).
  - Order details and total price breakdown.
  - Direct **"⚡ Pay Now"** 1-click button that marks the order as paid and releases shipment immediately.
- **Critical In-App Alert Notifications**: Added to the bell notification panel when payment is pending.

### 5. 📦 Order Status Tracking & 1-Click Returns
- **"My Orders" Screen**: Filter orders by *All, Payment Pending, On The Way, Delivered, and Returns & Refunds*.
- **Visual Checkpoint Stepper**:
  - `1. Order Confirmed` ➔ `2. Shipped (Delhivery/BlueDart tracking)` ➔ `3. Out for Delivery` ➔ `4. Delivered`.
- **Active Return Window Countdown**:
  - Displays remaining days on the active return window (e.g., `🛡️ Return Window: 5 days remaining`).
  - **1-Click "Return / Replace Item"**: Prompts for return reason and refund method (*Original Payment Method, Flipkart Gift Card, or UPI Transfer*).
  - Automatically synchronizes with ReturnRadar's return lifecycle engine and Kanban board!
- **Interactive Status Simulation**: Demo button to cycle orders through delivery checkpoints.

---

## 🌟 ReturnRadar Core Platform Features

### 1. 🎯 Interactive Urgency Radar & Risk Scanner
- **Concentric Urgency Rings**:
  - **Center Core (🔴 &le; 48 hours)**: Critical items expiring imminently. Pulsing radar pings and live countdowns.
  - **Mid Ring (🟡 3–7 days)**: Approaching return window expiration.
  - **Outer Ring (🟢 &gt; 7 days)**: Safe return period.
  - **Pipeline Orbit (🟣 In-Transit)**: Items dropped off at carrier or awaiting merchant reimbursement.
- Real-time animated radar sweep line plotting items according to temporal closeness to deadline.
- Click any radar blip to open the full item drawer.

### 2. 📋 Kanban Return Pipeline Board
- Six distinct return stages:
  1. `Considering / Trial Period`
  2. `Return Initiated (Drop-off Needed)`
  3. `Dropped Off / In Transit`
  4. `Delivered to Seller`
  5. `Refund Pending`
  6. `Refunded & Resolved`
- 1-click stage advancement with automatic timeline logging.
- Direct links to UPS, FedEx, USPS, and DHL tracking pages.
- Highlights overdue refunds (> 7 business days since warehouse receipt).

### 3. 🏪 Retailer Return Policy Intelligence Engine
- Pre-loaded with accurate return policies for 15+ major retailers:
  - **Apple**: 14 calendar days, 0% restocking fee, free UPS label or Apple Store.
  - **Best Buy**: 15 days standard, 15% restocking fee on opened cameras/drones.
  - **Amazon**: 30 days from delivery, label-free & box-free drop-off at Whole Foods & Kohl's.
  - **Target**: 90 days standard (+30 days with Circle Card).
  - **Costco**: 90 days on electronics, 100% lifetime satisfaction on general goods.
  - **Zara**: 30 days, $4.95 carrier drop-off fee (free in-store).
  - **Nike**: 60-day wear-test trial for Nike members.
  - **Sephora**: 30 days for original payment, gently used allowed.
  - **Nordstrom**: Flexible case-by-case policy, free returns.
  - **REI**: 365 days satisfaction guarantee for Co-op members.
  - **Dell**: 30 days from invoice, up to 15% restocking fee on non-defective items.
  - **Custom Stores**: Add custom retailers with specific return days, drop-off locations, and notes.

### 4. 💰 Financial Recovery & Return Health Analytics
- **Capital at Risk**: Total dollar amount of items expiring within 48–72 hours.
- **Pending Reimbursements**: Total dollar value awaiting merchant refund.
- **Total Recovered**: Cumulative refund dollars successfully credited back to payment accounts.
- **Expired Losses**: Value lost to expired return deadlines.
- **Retailer Return Rate Leaderboard**: Percentage of items returned vs. kept per retailer.
- **Return Reasons Breakdown**: Wrong Size/Fit, Defective, Found Better Price, Changed Mind, etc.

### 5. ⚖️ Customer Service Dispute & Demand Letter Generator
- Auto-generates tailored formal letters for customer chat, email support, or credit card chargebacks:
  - **Overdue Refund Inquiry**: Cites delivery to warehouse date, elapsed days, tracking number, and stated merchant policy.
  - **Restocking Fee / Discrepancy Dispute**: Challenges unauthorized deductions when items are returned intact.
  - **Return Window Extension Request**: Courtesy request for unopened merchandise or travel delays.
  - **Carrier In-Transit Lost Parcel Claim**: Protects consumer obligations once parcel is accepted by carrier.
- 1-click "Copy Letter to Clipboard" and "Open in Email Client".

### 6. 📱 In-Store Scannable Barcode & QR Code Engine
- Renders scannable SVG barcodes (Code-128) and QR codes right on the screen.
- Allows shoppers to hold up their phone or screen at Best Buy, Target, Apple, or UPS counters for instantaneous scanning without printing papers.

### 7. 📅 Calendar Integration (.ICS) & CSV Export
- **RFC 5545 iCalendar Export**: One-click download to sync return deadlines to Apple Calendar, Google Calendar, or Outlook.
  - Pre-configured alarms: 2 days prior, 1 day prior, and morning of deadline.
- **CSV Spreadsheet Export**: Export full return history with dates, prices, carriers, tracking, and refund status for budgeting or tax tracking.

### 8. 📸 Digital Receipt & Drop-off Documentation Hub
- Digital storage of sales receipts and drop-off slips.
- Supports image upload, drag-and-drop, and base64 storage.
- Full-screen high-resolution receipt modal viewer.

---

## 🛠️ Architecture & Tech Stack

- **Backend**:
  - Node.js native HTTP server (`server/serverFramework.js`) with custom routing, middleware, CORS, and multipart file upload handling.
  - SQLite database using Node.js's built-in `node:sqlite` (`DatabaseSync`). Zero native compilation issues, zero external vulnerabilities.
  - Modular REST API endpoints under `/api/*`.
- **Frontend**:
  - Pure Single Page Application (SPA) using ES modules.
  - Tailwind CSS design system with Dark/Light theme switching.
  - Responsive, glassmorphism design with SVG concentric radar visualizer.
  - Client-side Barcode & QR generator.

---

## 🚀 Quick Start & Usage

### 1. Run the API Tests
```bash
npm test
```
Runs comprehensive automated verification across all endpoints: purchase creation, deadline calculations, analytics calculations, dispute generation, and calendar exports.

### 2. Start the Server
```bash
npm start
```
Starts the ReturnRadar application at:
```
http://localhost:3000
```

### 3. Reseed Sample Data (Optional)
To reset the application to realistic sample purchases across all lifecycle stages:
```bash
npm run seed
```
Or simply click the **"🔄 Reset Demo"** button in the app header!

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/purchases` | List purchases with optional query filters (`status`, `retailer`, `urgency`, `search`, `sort`) |
| `POST` | `/api/purchases` | Create purchase with auto-computed return deadline |
| `GET` | `/api/purchases/:id` | Get purchase details with days remaining & discrepancy amount |
| `PUT` | `/api/purchases/:id` | Update purchase fields |
| `DELETE`| `/api/purchases/:id` | Delete purchase record |
| `POST` | `/api/purchases/:id/status` | Advance lifecycle status (`INITIATED`, `DROPPED_OFF`, `REFUNDED`, etc.) |
| `POST` | `/api/purchases/:id/refund` | Record refund amount and flag any discrepancy below expected |
| `GET` | `/api/retailers` | Knowledge base of retailer return policies |
| `POST` | `/api/retailers` | Add custom retailer policy |
| `GET` | `/api/analytics` | Financial metrics, capital at risk, return rates, and reasons |
| `POST` | `/api/dispute-generator`| Generate filled dispute letter with order #, tracking #, and discrepancy |
| `GET` | `/api/export/ics/:id` | Download iCalendar `.ics` file for a single purchase |
| `GET` | `/api/export/ics` | Download all active upcoming return deadlines as single `.ics` |
| `GET` | `/api/export/csv` | Download full purchases inventory as CSV spreadsheet |
| `POST` | `/api/upload` | Upload receipt or drop-off slip document |
| `GET` | `/api/notifications` | Get active deadline and overdue refund notifications |
| `POST` | `/api/seed` | Reset & reseed database with realistic sample items |

---

## 📂 Project Structure

```
├── server.js                     # Main application entry point & HTTP listener
├── package.json                  # Scripts & project metadata
├── README.md                     # Comprehensive documentation
├── data/
│   └── returnradar.db            # Persistent SQLite database
├── server/
│   ├── db.js                     # SQLite initialization with node:sqlite
│   ├── seedData.js               # Retailer policies & realistic sample purchases
│   ├── serverFramework.js        # Lightweight HTTP server & router
│   ├── testRoutes.js             # API test suite
│   ├── routes/
│   │   ├── purchases.js          # Purchases CRUD, filters & status transitions
│   │   ├── retailers.js          # Retailer policy database
│   │   ├── analytics.js          # Financial metrics & return rate calculations
│   │   ├── dispute.js            # Formal dispute & customer demand generator
│   │   ├── calendar.js           # .ICS iCalendar & CSV export
│   │   ├── upload.js             # Receipt image upload handler
│   │   └── notifications.js      # Alert center & unread counters
│   └── utils/
│       ├── dateUtils.js          # Urgency, business days & deadline calculators
│       ├── icsGenerator.js       # RFC 5545 iCalendar string builder
│       └── generateReceipts.js   # SVG receipt & shipping label generator
└── public/
    ├── index.html                # Main SPA interface
    ├── css/
    │   └── styles.css            # Animations, radar sweep & theme rules
    ├── js/
    │   ├── app.js                # SPA state manager & event orchestrator
    │   ├── api.js                # REST client communication layer
    │   ├── components/
    │   │   ├── radarView.js      # Urgency radar visualizer & blip plotter
    │   │   ├── kanban.js         # 6-stage lifecycle pipeline board
    │   │   ├── table.js          # Sortable & filterable inventory table
    │   │   ├── analyticsView.js  # Financial KPI charts & recovery rates
    │   │   ├── retailersView.js  # Store policy cheat sheet
    │   │   ├── modal.js          # Add/Edit purchase wizard
    │   │   ├── detailDrawer.js   # Slide-over details, barcode, receipts & timeline
    │   │   ├── refundModal.js    # Refund reconciliation & discrepancy flagger
    │   │   ├── disputeModal.js   # Dispute letter builder
    │   │   └── notifications.js  # Alerts panel & push notification trigger
    │   └── utils/
    │       ├── helpers.js        # Formatting, relative time, badges & toasts
    │       └── barcode.js        # Code-128 & QR code SVG generator
    └── uploads/                  # Sample receipts and uploaded files
```
