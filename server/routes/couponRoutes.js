const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/apply', couponController.applyCoupon);

// Admin Coupon endpoints
router.get('/', verifyToken, verifyAdmin, couponController.getCouponsAdmin);
router.post('/', verifyToken, verifyAdmin, couponController.createCouponAdmin);
router.put('/:id', verifyToken, verifyAdmin, couponController.updateCouponAdmin);
router.delete('/:id', verifyToken, verifyAdmin, couponController.deleteCouponAdmin);

module.exports = router;
