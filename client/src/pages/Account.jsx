import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ShieldCheck, ChevronRight, Mail, Lock, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { orderAPI } from '../services/api';

const Account = () => {
  const { user, isAdmin, logout, login, register, loginWithGoogle, googleLoading } = useAuth();
  const { wishlistItems } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'orders';

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Auth Form State
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      // Error handled in AuthContext toast
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
        <SEOHead title="Account Sign In | Zelvora Accessories" />
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
          <p className="text-xs text-gray-500">Access your order history, track shipments, and manage saved wishlist items.</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
          {/* Quick Google Sign In */}
          <button
            onClick={loginWithGoogle}
            disabled={googleLoading}
            className="w-full py-3 bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white font-bold text-xs uppercase rounded-xl tracking-wider shadow-luxury flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Sign In with Google
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">or with email</span>
          </div>

          {/* Form Switch Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-700 font-medium text-gray-800"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-700 font-medium text-gray-800"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-700 font-medium text-gray-800"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-bold text-xs uppercase rounded-xl tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : authMode === 'login' ? (
                'Sign In with Email'
              ) : (
                'Create Account'
              )}
            </button>
          </form>
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
          <button onClick={logout} className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer">
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
