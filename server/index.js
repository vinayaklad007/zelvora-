require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { seedDatabase } = require('./utils/seedData');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security HTTP headers & CORS
app.use(helmet({
  crossOriginResourcePolicy: false
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS configuration'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to API routes
app.use('/api', generalLimiter);

// API Route Handlers
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zarija Accessories REST API is active and running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Dynamic Sitemap XML Endpoint for SEO
app.get('/sitemap.xml', async (req, res) => {
  try {
    const firestoreService = require('./services/firestoreService');
    const products = await firestoreService.getCollection('products');
    const categories = await firestoreService.getCollection('categories');
    
    const baseUrl = process.env.CLIENT_URL || 'https://aurazarija.com';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ['', '/shop', '/about-us', '/contact-us', '/faq', '/shipping-policy', '/return-refund-policy', '/privacy-policy'];
    staticPages.forEach(p => {
      xml += `  <url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    // Categories
    categories.forEach(c => {
      xml += `  <url><loc>${baseUrl}/shop?category=${c.slug}</loc><changefreq>daily</changefreq><priority>0.9</priority></url>\n`;
    });

    // Products
    products.forEach(prod => {
      xml += `  <url><loc>${baseUrl}/products/${prod.slug || prod.id}</loc><lastmod>${(prod.updatedAt || prod.createdAt || '').split('T')[0]}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'https://aurazarija.com';
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nSitemap: ${baseUrl}/sitemap.xml`);
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Central Error Handler
app.use(errorHandler);

// Auto-seed database on initial startup if empty
seedDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT} [${process.env.NODE_ENV || 'development'} mode]`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database seeder:', err);
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT} (Seeder bypassed)`);
    });
  });
