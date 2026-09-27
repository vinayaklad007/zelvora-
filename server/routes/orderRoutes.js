const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin, optionalToken } = require('../middleware/authMiddleware');

// Public tracking route
router.get('/track/:orderNumber', orderController.trackOrder);

// Customer routes
router.get('/my-orders', verifyToken, orderController.getMyOrders);
router.get('/:id', optionalToken, orderController.getOrderById);
router.post('/:id/cancel', optionalToken, orderController.cancelOrder);
router.post('/:id/return', verifyToken, orderController.requestReturn);

// Protected Admin routes
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrdersAdmin);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatusAdmin);

module.exports = router;
