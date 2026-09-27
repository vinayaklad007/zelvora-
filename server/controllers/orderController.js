const firestoreService = require('../services/firestoreService');
const notificationService = require('../services/notificationService');

const orderController = {
  // GET /api/orders/my-orders (Customer)
  getMyOrders: async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const allOrders = await firestoreService.getCollection('orders');
      const userOrders = allOrders
        .filter(o => o.userId === req.user.uid || o.customerInfo?.email === req.user.email)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        data: userOrders
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/orders/:id
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await firestoreService.getDoc('orders', id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check ownership or admin
      const isOwner = req.user && (req.user.uid === order.userId || req.user.email === order.customerInfo?.email);
      const isAdmin = req.user && (req.user.role === 'admin' || req.user.email?.includes('admin'));

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied to this order' });
      }

      return res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/orders/track/:orderNumber (Public Tracking)
  trackOrder: async (req, res, next) => {
    try {
      const { orderNumber } = req.params;
      const allOrders = await firestoreService.getCollection('orders');
      const order = allOrders.find(o => 
        o.orderNumber?.toUpperCase() === orderNumber.toUpperCase() || 
        o.id?.toUpperCase() === orderNumber.toUpperCase()
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order number not found' });
      }

      return res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber || order.id,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          trackingNumber: order.trackingNumber || null,
          courierName: order.courierName || null,
          statusHistory: order.statusHistory || [],
          createdAt: order.createdAt,
          itemsCount: order.items?.length || 0,
          totalAmount: order.totalAmount,
          shippingAddress: {
            city: order.shippingAddress?.city,
            state: order.shippingAddress?.state,
            pincode: order.shippingAddress?.pincode
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/orders/:id/cancel (Customer / Admin)
  cancelOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await firestoreService.getDoc('orders', id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check permission
      const isOwner = req.user && (req.user.uid === order.userId || req.user.email === order.customerInfo?.email);
      const isAdmin = req.user && req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
      }

      // Allowed statuses for cancellation
      const cancellableStatuses = ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED'];
      if (!cancellableStatuses.includes(order.orderStatus) && !isAdmin) {
        return res.status(400).json({ 
          success: false, 
          message: `Order cannot be cancelled as it is currently in "${order.orderStatus}" status.` 
        });
      }

      const updatedHistory = [
        ...(order.statusHistory || []),
        { status: 'CANCELLED', title: 'Order Cancelled', note: reason || 'Cancelled by customer', timestamp: new Date().toISOString() }
      ];

      const updated = await firestoreService.updateDoc('orders', id, {
        orderStatus: 'CANCELLED',
        cancellationReason: reason || 'User requested cancellation',
        statusHistory: updatedHistory
      });

      notificationService.sendOrderCancelled(updated, reason);

      return res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/orders/:id/return (Customer)
  requestReturn: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason, comment } = req.body;

      const order = await firestoreService.getDoc('orders', id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.orderStatus !== 'DELIVERED') {
        return res.status(400).json({ success: false, message: 'Returns can only be requested for delivered orders.' });
      }

      const updatedHistory = [
        ...(order.statusHistory || []),
        { status: 'RETURN_REQUESTED', title: 'Return Requested', note: `${reason}: ${comment || ''}`, timestamp: new Date().toISOString() }
      ];

      const updated = await firestoreService.updateDoc('orders', id, {
        orderStatus: 'RETURN_REQUESTED',
        returnDetails: { reason, comment, requestedAt: new Date().toISOString() },
        statusHistory: updatedHistory
      });

      return res.json({
        success: true,
        message: 'Return request submitted successfully. Our support team will process it shortly.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/orders (Admin)
  getAllOrdersAdmin: async (req, res, next) => {
    try {
      let orders = await firestoreService.getCollection('orders');
      
      const { status, paymentStatus, search, limit = 50 } = req.query;

      if (status && status !== 'all') {
        orders = orders.filter(o => o.orderStatus === status);
      }

      if (paymentStatus && paymentStatus !== 'all') {
        orders = orders.filter(o => o.paymentStatus === paymentStatus);
      }

      if (search) {
        const query = search.toLowerCase();
        orders = orders.filter(o => 
          o.orderNumber?.toLowerCase().includes(query) ||
          o.customerInfo?.name?.toLowerCase().includes(query) ||
          o.customerInfo?.email?.toLowerCase().includes(query) ||
          o.customerInfo?.phone?.includes(query)
        );
      }

      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        data: orders.slice(0, Number(limit))
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/orders/:id/status (Admin)
  updateOrderStatusAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { orderStatus, trackingNumber, courierName, paymentStatus, note } = req.body;

      const order = await firestoreService.getDoc('orders', id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const updates = {};
      if (orderStatus) updates.orderStatus = orderStatus;
      if (trackingNumber) updates.trackingNumber = trackingNumber;
      if (courierName) updates.courierName = courierName;
      if (paymentStatus) updates.paymentStatus = paymentStatus;

      const statusTitleMap = {
        PLACED: 'Order Placed',
        CONFIRMED: 'Payment Confirmed',
        PROCESSING: 'Processing Order',
        PACKED: 'Order Packed',
        SHIPPED: 'Order Shipped',
        DELIVERED: 'Order Delivered',
        CANCELLED: 'Order Cancelled',
        RETURNED: 'Item Returned',
        REFUNDED: 'Refund Processed'
      };

      if (orderStatus && orderStatus !== order.orderStatus) {
        const updatedHistory = [
          ...(order.statusHistory || []),
          { 
            status: orderStatus, 
            title: statusTitleMap[orderStatus] || orderStatus, 
            note: note || '', 
            timestamp: new Date().toISOString() 
          }
        ];
        updates.statusHistory = updatedHistory;
      }

      const updated = await firestoreService.updateDoc('orders', id, updates);

      // Trigger relevant notifications
      if (orderStatus === 'SHIPPED') {
        notificationService.sendOrderShipped(updated);
      } else if (orderStatus === 'DELIVERED') {
        notificationService.sendOrderDelivered(updated);
      } else if (paymentStatus === 'REFUNDED') {
        notificationService.sendRefundProcessed(updated);
      }

      return res.json({
        success: true,
        message: `Order status updated to ${orderStatus || 'updated'}`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
