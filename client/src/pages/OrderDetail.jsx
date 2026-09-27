import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged Item');
  const [returnComment, setReturnComment] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrder(id);
        if (res.success) setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await orderAPI.cancelOrder(id, cancelReason);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        setOrder(res.data);
        setShowCancelModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.');
    }
  };

  const handleRequestReturn = async (e) => {
    e.preventDefault();
    try {
      const res = await orderAPI.requestReturn(id, { reason: returnReason, comment: returnComment });
      if (res.success) {
        toast.success(res.message);
        setOrder(res.data);
        setShowReturnModal(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to request return.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent"></div>
        <p className="text-xs text-gray-500 mt-2">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Order Not Found</h2>
        <Link to="/account" className="bg-primary-700 text-white text-xs px-6 py-2.5 rounded font-semibold uppercase">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isCancellable = ['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED'].includes(order.orderStatus);
  const isReturnable = order.orderStatus === 'DELIVERED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead title={`Order #${order.orderNumber || order.id} | Zarija`} />

      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <Link to="/account?tab=orders" className="text-xs font-semibold text-gray-600 hover:text-primary-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <span className="text-xs font-mono text-gray-400">ID: {order.id}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-xl font-bold text-gray-900">
            Order #{order.orderNumber || order.id}
          </h1>
          <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>

        <div className="flex items-center gap-3">
          {isCancellable && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl"
            >
              Cancel Order
            </button>
          )}

          {isReturnable && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="bg-primary-50 hover:bg-primary-100 text-primary-800 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Request Return / Refund
            </button>
          )}
        </div>
      </div>

      {/* Tracking Number Callout if Shipped */}
      {order.trackingNumber && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-700" />
            <div>
              <p className="font-bold">Shipped via {order.courierName || 'Express Courier'}</p>
              <p>Tracking AWB: <strong className="font-mono">{order.trackingNumber}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Items Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        <h3 className="font-serif text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
          Ordered Items
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-600 space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Coupon Discount</span><span>- ₹{order.discount?.toLocaleString('en-IN')}</span></div>}
          <div className="flex justify-between"><span>GST Tax</span><span>₹{order.taxAmount?.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Shipping Fee</span><span>₹{order.shippingFee || 0}</span></div>
          <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Payable</span><span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-900">Cancel Order #{order.orderNumber || order.id}</h3>
            <p className="text-xs text-gray-500">Are you sure you want to cancel this order?</p>
            <form onSubmit={handleCancelOrder} className="space-y-3">
              <textarea
                placeholder="Reason for cancellation..."
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none"
              ></textarea>
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 border rounded-lg">Keep Order</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg">Confirm Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
