import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/common/SEOHead';

const Cart = () => {
  const {
    cartItems,
    subtotal,
    totalMrp,
    totalSavings,
    discountAmount,
    appliedCoupon,
    gstTax,
    shippingFee,
    finalTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      await applyCouponCode(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <SEOHead title="Your Cart | Zelvora Accessories" />
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-700">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our handcrafted Kundan jhumkas, rose gold watches, and velvet potli handbags to elevate your style.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs py-3.5 px-8 rounded-xl uppercase tracking-wider shadow-luxury"
        >
          Explore Accessories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead title="Shopping Bag | Zelvora Accessories" />

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
        Shopping Bag ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedColor}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                {/* Product Image */}
                <Link to={`/products/${item.slug || item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link to={`/products/${item.slug || item.id}`} className="font-serif text-sm font-semibold text-gray-900 hover:text-primary-700 line-clamp-1">
                    {item.title}
                  </Link>
                  {item.selectedColor && (
                    <p className="text-[11px] text-gray-500">Color/Option: <span className="font-medium text-gray-800">{item.selectedColor}</span></p>
                  )}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-bold text-sm text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-gray-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-600 hover:text-black">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-600 hover:text-black">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove */}
                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-rose-600 p-2" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link to="/shop" className="text-primary-700 font-semibold hover:underline">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-rose-600 font-semibold hover:underline">
              Clear Bag
            </button>
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="space-y-6">
          
          {/* Coupon Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-700" /> Apply Coupon Code
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <div>
                  <span className="font-bold">{appliedCoupon.code}</span> applied! (Saved ₹{discountAmount})
                </div>
                <button onClick={removeCoupon} className="font-bold text-rose-600 underline text-[11px]">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 uppercase px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none"
                />
                <button type="submit" className="bg-primary-900 text-white font-bold text-xs px-4 py-2 rounded-lg">
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST Tax (3%)</span>
                <span className="font-semibold text-gray-900">₹{gstTax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">Free Shipping</strong> : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-gray-900">Total Payable</span>
              <span className="font-serif text-2xl font-bold text-primary-900">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary-700 hover:bg-primary-600 text-white shadow-luxury flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
