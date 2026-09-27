import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { couponAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('applied_coupon');
    }
  }, [appliedCoupon]);

  // Add Item to Cart
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCartItems(prevItems => {
      const existingIdx = prevItems.findIndex(
        item => item.id === product.id && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize
      );

      const maxStock = Number(product.stock) || 100;

      if (existingIdx > -1) {
        const currentQty = prevItems[existingIdx].quantity;
        const newQty = currentQty + quantity;
        
        if (newQty > maxStock) {
          toast.error(`Cannot add more than available stock (${maxStock} items).`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIdx].quantity = newQty;
        toast.success(`Updated "${product.title}" quantity in cart!`);
        return updated;
      } else {
        if (quantity > maxStock) {
          toast.error(`Only ${maxStock} units in stock.`);
          return prevItems;
        }
        toast.success(`Added "${product.title}" to cart!`);
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: Number(product.price),
            mrp: Number(product.mrp || product.price),
            image: product.images?.[0] || '',
            stock: maxStock,
            quantity,
            selectedColor,
            selectedSize
          }
        ];
      }
    });
  };

  // Update Quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        if (newQuantity > item.stock) {
          toast.error(`Maximum stock reached (${item.stock})`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Remove Item
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Apply Coupon
  const applyCouponCode = async (code) => {
    if (!code) return;
    try {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const res = await couponAPI.applyCoupon(code, subtotal);
      if (res.success) {
        setAppliedCoupon(res.data);
        toast.success(`Coupon "${res.data.code}" applied! You saved ₹${res.data.discountAmount}`);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to apply coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // Cart Computations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalMrp = cartItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const totalSavings = totalMrp - subtotal;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'FIXED') {
      discountAmount = appliedCoupon.discountAmount || appliedCoupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(taxableSubtotal * 0.03); // 3% GST
  const shippingFee = taxableSubtotal >= 999 || cartItems.length === 0 ? 0 : 99;
  const finalTotal = Math.round(taxableSubtotal + gstTax + shippingFee);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      subtotal,
      totalMrp,
      totalSavings,
      discountAmount: Math.round(discountAmount),
      appliedCoupon,
      gstTax,
      shippingFee,
      finalTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCouponCode,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
