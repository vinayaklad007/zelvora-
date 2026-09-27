/**
 * Pluggable Transactional Notification Service Adapter (Email / SMS)
 * Easily extensible for Resend, SendGrid, Nodemailer, Twilio, Fast2SMS, MSG91, etc.
 */

const notificationService = {
  /**
   * Send Order Confirmation Notification
   */
  sendOrderConfirmation: async (order) => {
    console.log(`📧 [NOTIFICATION ADAPTER] Order Confirmation sent to customer ${order.customerInfo.email} (${order.customerInfo.phone}) for Order #${order.orderNumber || order.id}`);
    // Provider integration hook (e.g. resend.emails.send(...) or twilio.messages.create(...))
    return true;
  },

  /**
   * Send Payment Received Notification
   */
  sendPaymentConfirmation: async (order) => {
    console.log(`💳 [NOTIFICATION ADAPTER] Payment Confirmation sent for Order #${order.orderNumber || order.id} - Amount: ₹${order.totalAmount}`);
    return true;
  },

  /**
   * Send Order Shipped Notification with Tracking Info
   */
  sendOrderShipped: async (order) => {
    console.log(`🚚 [NOTIFICATION ADAPTER] Dispatch Alert sent to ${order.customerInfo.email} | Courier: ${order.courierName} | Tracking: ${order.trackingNumber}`);
    return true;
  },

  /**
   * Send Order Delivered Notification
   */
  sendOrderDelivered: async (order) => {
    console.log(`🎉 [NOTIFICATION ADAPTER] Delivery Notification sent to ${order.customerInfo.email} for Order #${order.orderNumber || order.id}`);
    return true;
  },

  /**
   * Send Cancellation Alert
   */
  sendOrderCancelled: async (order, reason) => {
    console.log(`❌ [NOTIFICATION ADAPTER] Order Cancellation alert sent for Order #${order.orderNumber || order.id}. Reason: ${reason || 'User/Admin initiated'}`);
    return true;
  },

  /**
   * Send Refund Processed Alert
   */
  sendRefundProcessed: async (order, refundAmount) => {
    console.log(`💸 [NOTIFICATION ADAPTER] Refund Notification sent for Order #${order.orderNumber || order.id}. Refunded Amount: ₹${refundAmount || order.totalAmount}`);
    return true;
  }
};

module.exports = notificationService;
