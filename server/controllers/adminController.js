const firestoreService = require('../services/firestoreService');
const { auth, isMockMode } = require('../config/firebase-admin');

const adminController = {
  // GET /api/admin/dashboard-stats
  getDashboardStats: async (req, res, next) => {
    try {
      const orders = await firestoreService.getCollection('orders');
      const products = await firestoreService.getCollection('products');
      let users = await firestoreService.getCollection('users');

      // Sync with real Firebase Auth users
      if (!isMockMode && auth) {
        try {
          const ADMIN_EMAILS = ['vinaylad401@gmail.com'];
          const authUsers = listUsersResult.users.map(u => ({
            id: u.uid,
            name: u.displayName || u.email?.split('@')[0] || 'Customer',
            email: u.email,
            phone: u.phoneNumber || '',
            role: ADMIN_EMAILS.includes(u.email?.toLowerCase()) ? 'admin' : 'customer',
            disabled: u.disabled || false,
            createdAt: u.metadata?.creationTime || new Date().toISOString(),
            lastSignIn: u.metadata?.lastSignInTime || ''
          }));

          const userMap = new Map();
          authUsers.forEach(u => userMap.set(u.id, u));
          users.forEach(u => userMap.set(u.id, { ...userMap.get(u.id), ...u }));
          users = Array.from(userMap.values());
        } catch (authErr) {
          console.warn("auth.listUsers warning:", authErr.message);
        }
      }

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalSales = 0;
      let todaySales = 0;
      let monthlySales = 0;

      let pendingOrders = 0;
      let deliveredOrders = 0;
      let cancelledOrders = 0;

      const monthlyRevenueMap = {};

      orders.forEach(order => {
        const orderDate = new Date(order.createdAt || 0);
        const orderDateStr = order.createdAt ? order.createdAt.split('T')[0] : '';
        const orderTotal = Number(order.totalAmount || 0);

        // Count totals for paid or valid orders
        if (order.paymentStatus === 'PAID' || order.orderStatus !== 'CANCELLED') {
          totalSales += orderTotal;

          if (orderDateStr === todayStr) {
            todaySales += orderTotal;
          }

          if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
            monthlySales += orderTotal;
          }

          // Revenue per month chart aggregation
          const monthLabel = orderDate.toLocaleString('default', { month: 'short', year: '2-digit' });
          monthlyRevenueMap[monthLabel] = (monthlyRevenueMap[monthLabel] || 0) + orderTotal;
        }

        // Status counters
        if (['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED'].includes(order.orderStatus)) {
          pendingOrders++;
        } else if (order.orderStatus === 'DELIVERED') {
          deliveredOrders++;
        } else if (order.orderStatus === 'CANCELLED') {
          cancelledOrders++;
        }
      });

      // Low stock threshold (stock < 5)
      const lowStockProducts = products.filter(p => Number(p.stock) < 5);

      // Best selling products (sorted by reviewCount / rating or order frequency)
      const bestSellers = [...products]
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 5);

      // Revenue chart array
      const revenueChart = Object.keys(monthlyRevenueMap).map(month => ({
        month,
        revenue: monthlyRevenueMap[month]
      }));

      return res.json({
        success: true,
        data: {
          metrics: {
            totalSales: Math.round(totalSales),
            todaySales: Math.round(todaySales),
            monthlySales: Math.round(monthlySales),
            totalOrders: orders.length,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            totalCustomers: users.length,
            lowStockCount: lowStockProducts.length,
            totalProducts: products.length
          },
          lowStockProducts,
          bestSellers,
          revenueChart
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/admin/customers
  getCustomersAdmin: async (req, res, next) => {
    try {
      let users = await firestoreService.getCollection('users');

      if (!isMockMode && auth) {
        try {
          const ADMIN_EMAILS = ['vinaylad401@gmail.com'];
          const listUsersResult = await auth.listUsers(1000);
          const authUsers = listUsersResult.users.map(u => ({
            id: u.uid,
            name: u.displayName || u.email?.split('@')[0] || 'Customer',
            email: u.email,
            phone: u.phoneNumber || '',
            role: ADMIN_EMAILS.includes(u.email?.toLowerCase()) ? 'admin' : 'customer',
            disabled: u.disabled || false,
            createdAt: u.metadata?.creationTime || new Date().toISOString(),
            lastSignIn: u.metadata?.lastSignInTime || ''
          }));

          const userMap = new Map();
          authUsers.forEach(u => userMap.set(u.id, u));
          users.forEach(u => userMap.set(u.id, { ...userMap.get(u.id), ...u }));
          users = Array.from(userMap.values());
        } catch (authErr) {
          console.warn("auth.listUsers error in getCustomersAdmin:", authErr.message);
        }
      }

      return res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/admin/customers/:id/toggle-status
  toggleCustomerStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await firestoreService.getDoc('users', id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const updated = await firestoreService.updateDoc('users', id, {
        disabled: !user.disabled
      });

      return res.json({
        success: true,
        message: `Customer account ${updated.disabled ? 'disabled' : 'enabled'} successfully`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // Banners CRUD
  getBanners: async (req, res, next) => {
    try {
      const banners = await firestoreService.getCollection('banners');
      banners.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      return res.json({ success: true, data: banners });
    } catch (error) {
      next(error);
    }
  },

  createBanner: async (req, res, next) => {
    try {
      const { title, subtitle, imageUrl, linkUrl, buttonText, sortOrder, active = true } = req.body;
      const bannerId = `ban_${Date.now()}`;
      const newBanner = {
        id: bannerId,
        title,
        subtitle,
        imageUrl,
        linkUrl: linkUrl || '/shop',
        buttonText: buttonText || 'Shop Collection',
        sortOrder: Number(sortOrder || 0),
        active: Boolean(active),
        createdAt: new Date().toISOString()
      };
      const created = await firestoreService.setDoc('banners', bannerId, newBanner);
      return res.status(201).json({ success: true, message: 'Banner created', data: created });
    } catch (error) {
      next(error);
    }
  },

  deleteBanner: async (req, res, next) => {
    try {
      const { id } = req.params;
      await firestoreService.deleteDoc('banners', id);
      return res.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
