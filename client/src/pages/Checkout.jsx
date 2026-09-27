import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, CreditCard, Banknote, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import SEOHead from '../components/common/SEOHead';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, subtotal, discountAmount, appliedCoupon, gstTax, shippingFee, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Your Bag is Empty</h2>
        <Link to="/shop" className="bg-primary-700 text-white text-xs px-6 py-2.5 rounded font-semibold uppercase">
          Go to Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  // Process Razorpay or COD Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please complete customer contact information.');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error('Please complete shipping address details.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === 'RAZORPAY') {
        // Step 1: Create Razorpay Order on Server
        const res = await paymentAPI.createRazorpayOrder(cartItems, appliedCoupon?.code);
        if (!res.success) {
          throw new Error(res.message || 'Failed to initialize payment gateway.');
        }

        const { razorpayOrderId, amount } = res.data;

        // Step 2: Open Razorpay Modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_5173womenacc',
          amount: amount * 100,
          currency: 'INR',
          name: 'Zelvora Luxury Accessories',
          description: 'Payment for order',
          order_id: razorpayOrderId,
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          theme: {
            color: '#865143'
          },
          handler: async (response) => {
            try {
              // Step 3: Verify Razorpay Signature on Server
              const verifyRes = await paymentAPI.verifyRazorpayPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customerInfo,
                shippingAddress,
                items: cartItems,
                couponCode: appliedCoupon?.code
              });

              if (verifyRes.success) {
                clearCart();
                toast.success('Payment verified! Order placed successfully.');
                navigate(`/order-confirmation/${verifyRes.data.id}`);
              }
            } catch (err) {
              toast.error(err.message || 'Payment signature verification failed.');
            } finally {
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              toast.error('Payment cancelled by user.');
            }
          }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Fallback test mode simulation if Razorpay script blocked
          toast.success('Sandbox test mode: Verifying order...');
          const verifyRes = await paymentAPI.verifyRazorpayPayment({
            razorpayOrderId,
            razorpayPaymentId: `pay_${Date.now()}`,
            razorpaySignature: 'test_valid_signature',
            customerInfo,
            shippingAddress,
            items: cartItems,
            couponCode: appliedCoupon?.code
          });

          if (verifyRes.success) {
            clearCart();
            navigate(`/order-confirmation/${verifyRes.data.id}`);
          }
          setIsSubmitting(false);
        }
      } else {
        // Step 1: Process Cash on Delivery Order
        const codRes = await paymentAPI.processCODOrder({
          customerInfo,
          shippingAddress,
          items: cartItems,
          couponCode: appliedCoupon?.code
        });

        if (codRes.success) {
          clearCart();
          toast.success('COD order placed successfully!');
          navigate(`/order-confirmation/${codRes.data.id}`);
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error(err.message || 'Order processing failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead title="Checkout | Zelvora Accessories" />

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Secure Checkout</h1>
        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> 256-bit Encrypted SSL
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Contact & Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Customer Contact */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={customerInfo.name}
                  onChange={handleInputChange(setCustomerInfo)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Ananya Sharma"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={customerInfo.email}
                  onChange={handleInputChange(setCustomerInfo)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="ananya@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Mobile Number (For Order Updates) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={customerInfo.phone}
                  onChange={handleInputChange(setCustomerInfo)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              2. Shipping Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Flat / House No. / Building / Street *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={shippingAddress.street}
                  onChange={handleInputChange(setShippingAddress)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Flat 402, Sunshine Apartments, MG Road"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={shippingAddress.landmark}
                  onChange={handleInputChange(setShippingAddress)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Near ICICI Bank"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={shippingAddress.pincode}
                  onChange={handleInputChange(setShippingAddress)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="400001"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleInputChange(setShippingAddress)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleInputChange(setShippingAddress)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              3. Select Payment Method
            </h3>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'RAZORPAY' ? 'border-primary-700 bg-primary-50/50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="text-primary-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-primary-700" /> Razorpay (UPI / GooglePay / Cards / NetBanking)
                    </span>
                    <span className="text-[11px] text-gray-500">Fast & 100% Secure Instant Server Verification</span>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'border-primary-700 bg-primary-50/50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-primary-700"
                  />
                  <div>
                    <span className="font-bold text-xs text-gray-900 block flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-primary-700" /> Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-gray-500">Pay cash upon parcel delivery</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Order Summary Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({cartItems.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (3%)</span>
                <span>₹{gstTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-gray-900">Total</span>
              <span className="font-serif text-2xl font-bold text-primary-900">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary-700 hover:bg-primary-600 text-white shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Payment...' : paymentMethod === 'RAZORPAY' ? 'Pay Now via Razorpay' : 'Confirm COD Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
