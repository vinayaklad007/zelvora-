import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, MessageCircle, ArrowRight } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { orderAPI } from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrder(orderId);
        if (res.success) setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent"></div>
        <p className="text-xs text-gray-500 mt-2">Loading order receipt...</p>
      </div>
    );
  }

  const orderNum = order?.orderNumber || orderId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-center">
      <SEOHead title={`Order Confirmed #${orderNum} | Zelvora`} />

      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Thank You For Your Order!</h1>
        <p className="text-xs text-gray-600">
          Your order <strong className="text-gray-900">#{orderNum}</strong> has been successfully placed. We have sent a confirmation email & SMS notification to <strong className="text-gray-900">{order?.customerInfo?.email || 'your email'}</strong>.
        </p>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-left">
        <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
          Order Progress Tracker
        </h3>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col items-center gap-1 text-primary-700 font-bold">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">1</div>
            <span>Placed</span>
          </div>
          <div className="h-0.5 flex-1 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">2</div>
            <span>Packed</span>
          </div>
          <div className="h-0.5 flex-1 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">3</div>
            <span>Shipped</span>
          </div>
          <div className="h-0.5 flex-1 bg-gray-200 mx-2"></div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">4</div>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      {/* Order Summary & WhatsApp Button */}
      <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100 text-left space-y-3">
        <h4 className="font-serif text-sm font-bold text-gray-900">Have a question about this order?</h4>
        <p className="text-xs text-gray-600">
          Reach out directly to our customer concierge team on WhatsApp with order #{orderNum}.
        </p>
        <a
          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Zelvora Accessories, I have a question regarding my Order #${orderNum}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow-sm"
        >
          <MessageCircle className="w-4 h-4" /> Contact Us on WhatsApp
        </a>
      </div>

      <div className="flex items-center justify-center gap-4 pt-4">
        <Link
          to={`/orders/${orderId}`}
          className="bg-primary-700 text-white font-bold text-xs py-3 px-6 rounded-xl uppercase tracking-wider shadow-luxury"
        >
          View Full Order Details
        </Link>
        <Link
          to="/shop"
          className="bg-gray-100 text-gray-800 font-bold text-xs py-3 px-6 rounded-xl uppercase tracking-wider hover:bg-gray-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
