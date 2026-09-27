import React, { useState, useEffect } from 'react';
import { Search, Filter, Truck, Package, Check, X, Eye } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Order Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrdersAdmin({ status: statusFilter, search });
      if (res.success) setOrders(res.data || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await orderAPI.updateOrderStatusAdmin(selectedOrder.id, {
        orderStatus: newStatus || selectedOrder.orderStatus,
        courierName: courierName || selectedOrder.courierName,
        trackingNumber: trackingNumber || selectedOrder.trackingNumber
      });
      if (res.success) {
        toast.success(res.message);
        setSelectedOrder(res.data);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Orders | Zarija Admin" />

      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-xs text-gray-500">Monitor customer orders, update delivery status, and enter tracking numbers</p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-gray-700">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800"
          >
            <option value="all">All Orders</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">{ord.orderNumber || ord.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{ord.customerInfo?.name}</div>
                    <div className="text-[10px] text-gray-400">{ord.customerInfo?.email}</div>
                  </td>
                  <td className="p-4 font-bold text-gray-900">₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-semibold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${ord.paymentMethod === 'RAZORPAY' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ord.paymentMethod} ({ord.paymentStatus})
                    </span>
                  </td>
                  <td className="p-4 font-bold text-primary-700">{ord.orderStatus}</td>
                  <td className="p-4 text-gray-500">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setNewStatus(ord.orderStatus);
                        setCourierName(ord.courierName || 'BlueDart Express');
                        setTrackingNumber(ord.trackingNumber || '');
                      }}
                      className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect & Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">Update Order #{selectedOrder.orderNumber || selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none font-bold text-primary-800"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Courier Partner Name</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. BlueDart / Delhivery"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. AWB9876543210"
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 border rounded-xl">Close</button>
                <button type="submit" className="px-6 py-2 bg-primary-700 text-white font-bold rounded-xl uppercase">Update Order Status</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
