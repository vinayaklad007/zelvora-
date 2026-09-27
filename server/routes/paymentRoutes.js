const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalToken } = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');

// Payment endpoints
router.post('/create-razorpay-order', paymentLimiter, optionalToken, paymentController.createRazorpayOrder);
router.post('/verify-razorpay-payment', paymentLimiter, optionalToken, paymentController.verifyAndCreateOrder);
router.post('/process-cod-order', paymentLimiter, optionalToken, paymentController.processCODOrder);

module.exports = router;
