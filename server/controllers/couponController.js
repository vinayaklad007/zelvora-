const firestoreService = require('../services/firestoreService');

const couponController = {
  // POST /api/coupons/apply (Customer validation)
  applyCoupon: async (req, res, next) => {
    try {
      const { code, subtotal } = req.body;

      if (!code || !subtotal) {
        return res.status(400).json({ success: false, message: 'Coupon code and cart subtotal are required' });
      }

      const coupons = await firestoreService.getCollection('coupons');
      const coupon = coupons.find(c => c.code?.toUpperCase() === code.trim().toUpperCase());

      if (!coupon || coupon.active === false) {
        return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      }

      // Expiry check
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ success: false, message: 'This coupon code has expired' });
      }

      // Minimum order value check
      const cartAmount = Number(subtotal);
      if (coupon.minOrderValue && cartAmount < coupon.minOrderValue) {
        return res.status(400).json({ 
          success: false, 
          message: `Minimum cart value of ₹${coupon.minOrderValue} required for coupon ${coupon.code}` 
        });
      }

      // Usage limit check
      if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'This coupon code has reached its maximum usage limit' });
      }

      let discountAmount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = (cartAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.discountType === 'FIXED') {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(discountAmount, cartAmount);

      return res.json({
        success: true,
        message: 'Coupon applied successfully!',
        data: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: Math.round(discountAmount),
          finalSubtotal: Math.round(cartAmount - discountAmount)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/coupons (Admin)
  getCouponsAdmin: async (req, res, next) => {
    try {
      const coupons = await firestoreService.getCollection('coupons');
      return res.json({ success: true, data: coupons });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/coupons (Admin)
  createCouponAdmin: async (req, res, next) => {
    try {
      const {
        code,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscount,
        expiryDate,
        usageLimit,
        isFirstOrderOnly,
        active = true
      } = req.body;

      if (!code || !discountType || discountValue === undefined) {
        return res.status(400).json({ success: false, message: 'Code, discount type, and discount value are required' });
      }

      const couponId = `cup_${code.toUpperCase().trim()}`;
      const newCoupon = {
        id: couponId,
        code: code.toUpperCase().trim(),
        discountType: discountType.toUpperCase(),
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate: expiryDate || null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usedCount: 0,
        isFirstOrderOnly: Boolean(isFirstOrderOnly),
        active: Boolean(active),
        createdAt: new Date().toISOString()
      };

      const created = await firestoreService.setDoc('coupons', couponId, newCoupon);

      return res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/coupons/:id (Admin)
  updateCouponAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await firestoreService.updateDoc('coupons', id, updates);

      return res.json({
        success: true,
        message: 'Coupon updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/coupons/:id (Admin)
  deleteCouponAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      await firestoreService.deleteDoc('coupons', id);
      return res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = couponController;
