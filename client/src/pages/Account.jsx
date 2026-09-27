import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { orderAPI } from '../services/api';

const Account = () => {
  const { user, isAdmin, logout, loginWithGoogle, loginAdminDemo } = useAuth();
  const { wishlistItems } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const res = await orderAPI.getMyOrders();
          if (res.success) setOrders(res.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <SEOHead title="Account Sign In | Zelvora Accessories" />
        <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
        <p className="text-xs text-gray-500">Access your order history, track shipments, and manage saved wishlist items.</p>
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3 text-left">
          <p className="text-xs text-gray-600 font-medium">Click below to sign in or use demo accounts:</p>
          <button
            onClick={loginWithGoogle}
            className="w-full py-3 bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs uppercase rounded-xl tracking-wider shadow-luxury flex items-center justify-center gap-2"
          >
            Sign In with Google / Email
          </button>
          <button
            onClick={loginAdminDemo}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-roseGold font-bold text-xs uppercase rounded-xl tracking-wider flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-roseGold" /> Demo Admin Login
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead title="My Account | Zelvora Accessories" />

      {/* Account Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-700 text-white font-bold text-xl flex items-center justify-center border-2 border-roseGold">
            {user.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
              Hello, {user.displayName}
              {isAdmin && <span className="bg-primary-900 text-roseGold text-[10px] px-2 py-0.5 rounded font-mono uppercase">Admin</span>}
            </h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="bg-primary-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-roseGold" /> Admin Portal
            </Link>
          )}
          <button onClick={logout} className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Account Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setSearchParams({ tab: 'orders' })}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Heart className="w-4 h-4" /> My Wishlist ({wishlistItems.length})
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-gray-500">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4">
              <p className="text-sm font-semibold text-gray-700">You haven't placed any orders yet.</p>
              <Link to="/shop" className="inline-block bg-primary-700 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-sm text-gray-900">Order #{ord.orderNumber || ord.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs font-semibold text-gray-800">Total: ₹{ord.totalAmount?.toLocaleString('en-IN')} ({ord.items?.length || 1} items)</p>
                  </div>

                  <Link
                    to={`/orders/${ord.id}`}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-200 flex items-center gap-1"
                  >
                    View Details & Track <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist Grid */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Your wishlist is empty.</p>
              <Link to="/shop" className="inline-block bg-primary-700 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase">
                Explore Accessories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistItems.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
