const firestoreService = require('../services/firestoreService');
const { razorpayInstance, verifyRazorpaySignature } = require('../config/razorpay');
const notificationService = require('../services/notificationService');

/**
 * Server-side helper to calculate authoritative order totals from database prices
 */
const calculateOrderTotals = async (items, couponCode = null) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order items list cannot be empty');
  }

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await firestoreService.getDoc('products', item.productId || item.id);
    if (!product) {
      throw new Error(`Product "${item.title || item.productId}" is no longer available.`);
    }

    if (!product.isActive) {
      throw new Error(`Product "${product.title}" is currently unavailable for purchase.`);
    }

    const requestedQty = Number(item.quantity) || 1;
    if (product.stock < requestedQty) {
      throw new Error(`Insufficient stock for "${product.title}". Requested: ${requestedQty}, Available: ${product.stock}`);
    }

    const itemPrice = Number(product.price);
    const itemTotal = itemPrice * requestedQty;
    subtotal += itemTotal;

    verifiedItems.push({
      productId: product.id,
      title: product.title,
      price: itemPrice,
      mrp: Number(product.mrp || itemPrice),
      quantity: requestedQty,
      image: product.images?.[0] || '',
      sku: product.sku || '',
      selectedColor: item.selectedColor || null,
      selectedSize: item.selectedSize || null,
      total: itemTotal
    });
  }

  // Handle Coupon Discount
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupons = await firestoreService.getCollection('coupons');
    const coupon = coupons.find(c => c.code?.toUpperCase() === couponCode.trim().toUpperCase() && c.active !== false);

    if (coupon) {
      const now = new Date();
      const expiry = coupon.expiryDate ? new Date(coupon.expiryDate) : null;
      const isExpired = expiry && expiry < now;

      if (!isExpired && subtotal >= (coupon.minOrderValue || 0)) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else if (coupon.discountType === 'FIXED') {
          discountAmount = coupon.discountValue;
        }

        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }

        appliedCoupon = {
          code: coupon.code,
          discountAmount: Math.round(discountAmount)
        };
      }
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  // GST Tax rate (standard 3% on jewelry/fashion accessories or 5% apparel)
  const gstRate = 0.03; // 3%
  const taxAmount = Math.round(taxableSubtotal * gstRate);

  // Shipping Fee: Free shipping over ₹999, else ₹99
  const freeShippingThreshold = 999;
  const shippingFee = taxableSubtotal >= freeShippingThreshold ? 0 : 99;

  const totalAmount = Math.round(taxableSubtotal + taxAmount + shippingFee);

  return {
    verifiedItems,
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    appliedCoupon,
    gstRate,
    taxAmount,
    shippingFee,
    totalAmount
  };
};

const paymentController = {
  // POST /api/payments/create-razorpay-order
  createRazorpayOrder: async (req, res, next) => {
    try {
      const { items, couponCode } = req.body;

      // Calculate server totals
      const totals = await calculateOrderTotals(items, couponCode);

      // Amount in paise (1 INR = 100 paise)
      const amountInPaise = Math.round(totals.totalAmount * 100);

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
          store: 'Zarija Luxury Accessories'
        }
      };

      let razorpayOrder;
      try {
        razorpayOrder = await razorpayInstance.orders.create(options);
      } catch (err) {
        console.warn('⚠️ Razorpay live API call failed, generating mock Razorpay order for test sandbox:', err.message);
        razorpayOrder = {
          id: `order_${Math.random().toString(36).substring(2, 15)}`,
          entity: 'order',
          amount: amountInPaise,
          currency: 'INR',
          receipt: options.receipt,
          status: 'created'
        };
      }

      return res.json({
        success: true,
        data: {
          razorpayOrderId: razorpayOrder.id,
          amount: totals.totalAmount,
          currency: 'INR',
          totals
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/payments/verify-razorpay-payment
  verifyAndCreateOrder: async (req, res, next) => {
    try {
      const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        customerInfo,
        shippingAddress,
        items,
        couponCode,
        notes
      } = req.body;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Missing payment signature verification parameters' });
      }

      // Step 1: Verify HMAC Signature on Server
      const isValidSignature = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValidSignature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed! Invalid signature.' });
      }

      // Step 2: Re-verify Pricing and Stock Authoritatively
      const totals = await calculateOrderTotals(items, couponCode);

      // Step 3: Deduct Inventory Atomically
      await firestoreService.reduceStock(totals.verifiedItems.map(i => ({ id: i.productId, quantity: i.quantity })));

      // Step 4: Create Order Document
      const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const orderData = {
        id: orderId,
        orderNumber: orderId,
        userId: req.user ? req.user.uid : 'guest',
        customerInfo,
        shippingAddress,
        items: totals.verifiedItems,
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        appliedCoupon: totals.appliedCoupon,
        taxAmount: totals.taxAmount,
        shippingFee: totals.shippingFee,
        totalAmount: totals.totalAmount,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PAID',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderStatus: 'CONFIRMED',
        statusHistory: [
          { status: 'PLACED', title: 'Order Placed', timestamp: new Date().toISOString() },
          { status: 'CONFIRMED', title: 'Payment Confirmed', timestamp: new Date().toISOString() }
        ],
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      const createdOrder = await firestoreService.setDoc('orders', orderId, orderData);

      // Step 5: Trigger Notification Hooks
      notificationService.sendOrderConfirmation(createdOrder);
      notificationService.sendPaymentConfirmation(createdOrder);

      return res.status(201).json({
        success: true,
        message: 'Payment verified and order created successfully!',
        data: createdOrder
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/payments/process-cod-order
  processCODOrder: async (req, res, next) => {
    try {
      const {
        customerInfo,
        shippingAddress,
        items,
        couponCode,
        notes
      } = req.body;

      if (!customerInfo || !shippingAddress || !items) {
        return res.status(400).json({ success: false, message: 'Customer, address, and items are required for checkout.' });
      }

      // Step 1: Re-verify Pricing and Stock Authoritatively
      const totals = await calculateOrderTotals(items, couponCode);

      // Step 2: Deduct Inventory Atomically
      await firestoreService.reduceStock(totals.verifiedItems.map(i => ({ id: i.productId, quantity: i.quantity })));

      // Step 3: Create COD Order Document
      const orderId = `ORD-COD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const orderData = {
        id: orderId,
        orderNumber: orderId,
        userId: req.user ? req.user.uid : 'guest',
        customerInfo,
        shippingAddress,
        items: totals.verifiedItems,
        subtotal: totals.subtotal,
        discount: totals.discountAmount,
        appliedCoupon: totals.appliedCoupon,
        taxAmount: totals.taxAmount,
        shippingFee: totals.shippingFee,
        totalAmount: totals.totalAmount,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PLACED',
        statusHistory: [
          { status: 'PLACED', title: 'Cash on Delivery Order Placed', timestamp: new Date().toISOString() }
        ],
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      const createdOrder = await firestoreService.setDoc('orders', orderId, orderData);

      // Trigger Notification Hook
      notificationService.sendOrderConfirmation(createdOrder);

      return res.status(201).json({
        success: true,
        message: 'Cash on Delivery order placed successfully!',
        data: createdOrder
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
