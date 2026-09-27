const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', verifyToken, verifyAdmin, adminController.getDashboardStats);
router.get('/customers', verifyToken, verifyAdmin, adminController.getCustomersAdmin);
router.put('/customers/:id/toggle-status', verifyToken, verifyAdmin, adminController.toggleCustomerStatus);

// Banners
router.get('/banners', adminController.getBanners);
router.post('/banners', verifyToken, verifyAdmin, adminController.createBanner);
router.delete('/banners/:id', verifyToken, verifyAdmin, adminController.deleteBanner);

module.exports = router;
