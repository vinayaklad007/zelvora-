# Zarija Luxury Accessories | Production E-Commerce Platform

A production-ready full-stack e-commerce website for a real women's fashion accessories business in India. Built with React, Vite, Tailwind CSS, Node.js, Express, Firebase Firestore & Auth, and Razorpay payment gateway.

---

## 💎 Features Highlights

### 🛒 Customer E-Commerce Storefront
- **Luxury Fashion Aesthetics**: Elegant typography (Playfair Display & Inter), high-res image galleries with zoom, and responsive mobile-first UI.
- **Dynamic Category Navigation**: All 12 requested categories: Earrings, Necklaces, Rings, Bracelets, Bangles, Handbags, Wallets, Hair accessories, Sunglasses, Watches, Beauty/fashion accessories, and Gift collections.
- **Product Search & Filtering**: Multi-parameter search by title, SKU, or tags with category filters, price range sliders, rating filters, stock filters, and sorting.
- **Multi-Step Checkout & Pincode Checker**: Integrated Indian pincode delivery estimator, shipping address validation, GST tax computation (3%), free shipping threshold (over ₹999), and coupon discount support.
- **Visual Order Tracking Stepper**: Customer account portal with real-time tracking timeline (Order Placed ➔ Confirmed ➔ Processing ➔ Packed ➔ Shipped ➔ Delivered / Cancelled / Refunded).
- **Floating WhatsApp Concierge**: Instant WhatsApp contact button pre-filling contextual order inquiry details.
- **Complete Business & Policy Pages**: About Us, Contact Us, FAQ, Shipping Policy, Return & Refund Policy, Cancellation Policy, Privacy Policy, and Terms & Conditions.
- **SEO & Schema Markup**: Dynamic React Helmet head tags, Open Graph meta images, canonical URLs, JSON-LD Product & Organization schemas, dynamic `sitemap.xml`, and `robots.txt`.

### 🔐 Secure Admin Dashboard (`/admin`)
- **Real-Time Analytics & KPI Metrics**: Total Sales, Today's Sales, Monthly Sales, Total Orders, Pending Orders, Delivered Orders, Cancelled Orders, Active Customers, Low-Stock Alerts, and Recharts revenue area charts.
- **Full Product CRUD**: Multi-image support, setting price, MRP, SKU, stock level, category, subcategory, variants (color/material), specifications table, and status badges (Featured, Bestseller, New Arrival, Active).
- **Atomic Inventory Stock Reduction**: Prevents negative stock and handles concurrent orders safely via Firestore transactions.
- **Order Management & Tracking**: View all orders, update status (PLACED to SHIPPED), enter courier partner name & AWB tracking numbers, and process cancellation/refunds.
- **Dynamic Category & Coupon Manager**: Create fixed/percentage discount coupons with min order spend, max discount cap, and usage limits. Create custom categories dynamically.
- **Banner & Review Moderation**: Manage homepage promotional hero banners and moderate customer product reviews.

---

## 🔒 Security Architecture

1. **Zero Client Trust**: All pricing, stock availability, GST taxes, and shipping fees are computed authoritatively on the Express Node.js backend.
2. **Server-Side Razorpay HMAC Verification**: Razorpay payment signatures (`razorpay_order_id + "|" + razorpay_payment_id`) are verified using HMAC SHA256 with the secret key on the server before creating an order record.
3. **Role-Based Authorization**: Every sensitive admin API operation verifies the Firebase Auth token and checks for the `admin` role server-side.
4. **Security HTTP Headers & Rate Limiting**: Enforced via Helmet and Express Rate Limiter.
5. **Firestore Security Rules**: Strict document access rules (`firestore.rules`) preventing unauthorized client writes.

---

## 🛠️ Tech Stack & Directory Structure

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, React Hot Toast, React Helmet Async, Recharts.
- **Backend**: Node.js, Express.js, Firebase Admin SDK, Razorpay Node SDK, Helmet, CORS, Express Rate Limit, Express Validator.
- **Database**: Firebase Authentication & Firebase Firestore.

```
women_accessories/
├── client/                 # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ProductCard, WhatsAppButton, SEOHead, Skeletons
│   │   ├── context/        # AuthContext, CartContext, WishlistContext
│   │   ├── pages/          # Home, Shop, ProductDetail, Cart, Checkout, Account, OrderDetail, Policies
│   │   │   └── admin/      # AdminLogin, AdminDashboard, AdminProducts, AdminOrders, AdminCoupons, Banners, Reviews
│   │   ├── services/       # api.js, firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/                 # Node.js + Express REST API backend
│   ├── config/             # firebase-admin.js, razorpay.js
│   ├── controllers/        # productController, orderController, paymentController, couponController, categoryController, adminController
│   ├── middleware/         # authMiddleware, rateLimiter, errorHandler
│   ├── routes/             # API REST route modules
│   ├── utils/              # seedData.js, seedRunner.js
│   ├── index.js
│   └── .env.example
├── firestore.rules         # Production Firebase Security Rules
├── vercel.json             # Vercel SPA configuration
├── netlify.toml            # Netlify SPA configuration
├── render.yaml             # Render Node.js backend deployment configuration
└── README.md
```

---

## 🚀 Quick Start & Local Execution

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Populates sample product categories, products, coupons & banners
npm start        # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🌐 Production Deployment

- **Frontend Deployment (Vercel / Netlify)**: Connect repository branch, set build command to `npm run build` and output directory to `dist`. Set environment variable `VITE_API_BASE_URL` to your live Node backend URL.
- **Backend Deployment (Render / Railway)**: Deploy `server/` directory, set environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
