# ARABIAN MANDI | Production Food Ordering & Delivery Platform

> **Location**: NH16 National Highway, Opposite Sangivalasa Bus Stop, Thagarapuvalasa, Andhra Pradesh 531162  
> **Cuisine**: Authentic Yemeni & Gulf Mandi, Charcoal Grills, Kebabs & Royal Kunafa

A full-stack, three-sided food ordering, kitchen management, and live GPS delivery tracking platform built specifically for **Arabian Mandi** operating in and around **Thagarapuvalasa, Andhra Pradesh, India**.

---

## 🌟 System Highlights & Key Features

### 1. Three-Sided Integrated Architecture
1. **Customer Web Application & PWA** (`/`, `/menu`, `/cart`, `/checkout`, `/orders/[id]`, `/profile`, `/offers`)
   - Authentic Arabian visual identity with charcoal & gold palette (`#D4AF37`)
   - Interactive menu with real-time search, category filters, pure-veg toggle, and price sorting
   - Dynamic food customization modal (Half/Full/Family portions, extra meats, rice, authentic toum dip, dakkoos)
   - Real-time address serviceability verification across Thagarapuvalasa zones
   - Server-side verified coupon & promo code system (`WELCOME50`, `MANDI100`, `FREEDEL`, etc.)
   - Multi-step checkout with Razorpay payment gateway (UPI, Cards, Netbanking) and Cash on Delivery (COD)
   - Live order tracking timeline with moving GPS delivery partner marker on interactive map
   - Customer account with order history, instant 1-click **"Order Again"**, and review submission

2. **Restaurant Kitchen Display System (KDS)** (`/admin/kitchen`)
   - Tablet-optimized kitchen queue with live elapsed cooking timers
   - Real-time audio chime upon receiving new customer orders
   - Large touch cards showing dish names, portion sizes, customized addons, and kitchen notes
   - Instant 1-tap workflow buttons: `ACCEPT` → `PREPARING` → `READY FOR PICKUP`

3. **Delivery Partner Dashboard** (`/delivery`)
   - Rider assignment acceptance / rejection
   - 5-stage delivery lifecycle:
     - `Stage 1`: New delivery request with customer area, distance, and earnings
     - `Stage 2`: Navigate to restaurant (`ARRIVED AT RESTAURANT`)
     - `Stage 3`: Pickup food (`START DELIVERY`) & broadcast live GPS coordinates
     - `Stage 4`: Delivering with customer navigation & direct phone call
     - `Stage 5`: Secure 4-digit customer Delivery OTP verification to complete delivery & credit earnings
   - Built-in GPS movement simulator along NH16 Thagarapuvalasa

4. **Restaurant Owner Admin Panel** (`/admin`)
   - Executive analytics: Today's orders & revenue, lifetime metrics, pending cooking queue, active riders
   - Daily revenue trend charts, popular dishes distribution, and payment method split
   - Order management table with filters (Status, Date range, Search) and thermal receipt printing
   - Menu catalog manager: Create dishes, adjust prices/discounts, and toggle live availability
   - Delivery partner fleet view and order assignment
   - Configurable business rules: Delivery radius (KM), minimum order, free delivery threshold, 5% GST rate, and COD toggle
   - 1-click CSV report export for Orders and Customers

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | React 19, Server Components & Dynamic API Routes |
| **Language** | **TypeScript** | Strict type-safety, zero build warnings |
| **Styling** | **Tailwind CSS** | Custom Arabian dark & gold design tokens |
| **Database** | **Prisma ORM & PostgreSQL** | SQLite for instant local zero-friction execution, PostgreSQL schema for production |
| **Authentication** | **JWT (`jose`) & `bcryptjs`** | Secure HTTP-only cookies, Bearer header fallback, role-based access control |
| **Payment Gateway** | **Razorpay** | Server-side cryptographic HMAC-SHA256 signature verification & COD |
| **Maps & Tracking** | **Leaflet & OpenStreetMap** | Zero external API key requirement, plus Google Maps Platform compatibility |
| **Real-Time Events**| **Server-Sent Events (SSE)** | Low-latency live broadcast of order status & rider GPS coordinates |
| **Validation** | **Zod** | Input sanitization on all checkout, auth, and order endpoints |
| **Testing** | **Node.js Test Runner** | Unit test suite covering distance, coupon logic, tax, and order state machines |

---

## 🚀 Demo & Default User Credentials

You can test all user personas with 1-click on the [Login Page](http://localhost:3000/login):

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Restaurant Admin** | `admin@arabianmandi.in` | `Admin@123` | `/admin` (Analytics, Menu, Settings) |
| **Kitchen Master Chef** | `kitchen@arabianmandi.in` | `Kitchen@123` | `/admin/kitchen` (KDS Cooking Queue) |
| **Delivery Partner 1** | `rider1@arabianmandi.in` | `Rider@123` | `/delivery` (Rider Dashboard, OTP Deliver) |
| **Delivery Partner 2** | `rider2@arabianmandi.in` | `Rider@123` | `/delivery` (Rider Dashboard) |
| **Customer** | `customer@arabianmandi.in` | `Customer@123` | Customer Storefront, Profile & Orders |

---

## 📍 Delivery Zones & Thagarapuvalasa Coverage

Arabian Mandi enforces dynamic, non-hardcoded delivery radius checks calculated using the Haversine formula against our NH16 kitchen (17.9288° N, 83.4350° E):

- **Zone A (0 – 3.5 km)**: Sangivalasa, NRI Hospital Campus, Thagarapuvalasa RTC Complex & Main Bazaar (`₹30 Delivery Fee`)
- **Zone B (3.5 – 8.0 km)**: Chittivalasa Jute Mill Quarters, Anandapuram NH16 Junction (`₹50 Delivery Fee`)
- **Zone C (8.0 – 15.0 km)**: Bheemunipatnam (Bheemili Beach Road), Padmanabham Road (`₹80 Delivery Fee`)
- **Beyond 15 km**: Automatically detected and gracefully marked as unserviceable before checkout.
- **Free Delivery**: Automatically applies when order subtotal exceeds the configurable threshold (`₹599`).

---

## 🗄️ Database Setup & Dual-Engine Architecture

The platform supports both **SQLite** (for instantaneous zero-configuration local development) and **PostgreSQL** (for production environments such as Supabase, Neon, AWS RDS, Railway, and Docker):

### 1. Local Development (SQLite)
Already configured in `prisma/schema.prisma`.
```bash
# Push schema & generate client
npm run prisma:push

# Populate with authentic Arabian Mandi dishes, coupons & users
node prisma/seed.js
```

### 2. Production PostgreSQL
A dedicated PostgreSQL schema with indexes is provided in `prisma/schema.postgresql.prisma`.
To use PostgreSQL:
1. Start PostgreSQL with Docker:
   ```bash
   docker compose up -d
   ```
2. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/arabian_mandi?schema=public"
   ```
3. Run `npx prisma db push --schema=prisma/schema.postgresql.prisma` and re-run seed.

---

## 🏃 Running the Application

### Development Server:
```bash
npm run dev
# App will be accessible at http://localhost:3000
```

### Production Build & Server:
```bash
npm run build
npm run start
```

### Running Automated Test Suite:
```bash
node --test tests/calculations.test.js
```

---

## 🔒 Security Best Practices Implemented

1. **Server-Side Single Source of Truth**: Cart subtotals, GST taxes (5%), packaging fees (₹25), discounts, and delivery charges are re-calculated and verified server-side. Tampering with client parameters is rejected.
2. **Cryptographic Payment Verification**: Razorpay order signatures are validated using HMAC-SHA256 before orders are confirmed or marked as paid.
3. **Delivery OTP Security**: Orders cannot be marked as delivered without the customer's unique 4-digit delivery OTP.
4. **Live Tracking Privacy**: Delivery partner GPS locations are only broadcasted when an order status is `OUT_FOR_DELIVERY` and cease immediately upon delivery or cancellation.
5. **Role-Based API Protection**: Strict checks on `/api/admin/*`, `/api/delivery/*`, and order details ensure customers cannot view or modify unauthorized orders.
