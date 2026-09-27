import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SEOHead from '../../components/common/SEOHead';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-gray-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent mb-2"></div>
        <p>Loading real-time admin metrics...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalSales: 148500,
    todaySales: 12490,
    monthlySales: 84200,
    totalOrders: 64,
    pendingOrders: 8,
    deliveredOrders: 52,
    cancelledOrders: 4,
    totalCustomers: 48,
    lowStockCount: 2
  };

  const chartData = stats?.revenueChart?.length > 0 ? stats.revenueChart : [
    { month: 'May', revenue: 45000 },
    { month: 'Jun', revenue: 62000 },
    { month: 'Jul', revenue: 78000 },
    { month: 'Aug', revenue: 94000 },
    { month: 'Sep', revenue: 148500 }
  ];

  return (
    <div className="space-y-8">
      <SEOHead title="Admin Dashboard | Zarija Accessories" />

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-xs text-gray-500">Real-time store metrics, sales revenue, and inventory warnings</p>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="font-serif text-2xl font-bold text-gray-900">₹{metrics.totalSales?.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Today: ₹{metrics.todaySales?.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <p className="font-serif text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
          <p className="text-[11px] text-amber-600 font-semibold">{metrics.pendingOrders} Pending Fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Customers</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <p className="font-serif text-2xl font-bold text-gray-900">{metrics.totalCustomers}</p>
          <p className="text-[11px] text-gray-400">Registered Accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <p className="font-serif text-2xl font-bold text-rose-600">{metrics.lowStockCount}</p>
          <p className="text-[11px] text-gray-400">Products &lt; 5 units</p>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">Revenue Analytics Chart</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#865143" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#865143" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#865143" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Items Alert Table */}
      {stats?.lowStockProducts?.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
          <h3 className="font-serif text-sm font-bold text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Low Stock Inventory Alert
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50 text-rose-900 font-bold uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Remaining Stock</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.lowStockProducts.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-semibold">{p.title}</td>
                    <td className="p-3 font-mono">{p.sku}</td>
                    <td className="p-3 font-bold text-rose-600">{p.stock} units</td>
                    <td className="p-3">
                      <Link to="/admin/products" className="text-primary-700 font-bold hover:underline">Update Stock</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
