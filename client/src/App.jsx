import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ShieldCheck, LayoutDashboard, ShoppingBag, Tag, Users, Image as ImageIcon, Star, LogOut, Store } from 'lucide-react';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import OrderDetail from './pages/OrderDetail';

import AboutUs from './pages/policies/AboutUs';
import ContactUs from './pages/policies/ContactUs';
import FAQ from './pages/policies/FAQ';
import ShippingPolicy from './pages/policies/ShippingPolicy';
import ReturnRefundPolicy from './pages/policies/ReturnRefundPolicy';
import CancellationPolicy from './pages/policies/CancellationPolicy';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsConditions from './pages/policies/TermsConditions';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminBanners from './pages/admin/AdminBanners';
import AdminReviews from './pages/admin/AdminReviews';

import { useAuth } from './context/AuthContext';

// Protected Admin Layout Container
const AdminLayout = ({ children }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: Tag },
    { name: 'Categories', path: '/admin/categories', icon: Store },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-luxuryDark text-gray-300 p-6 space-y-8 flex-shrink-0">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-white tracking-widest">ZELVORA</span>
            <span className="bg-roseGold text-white text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold">ADMIN</span>
          </Link>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item, i) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  active ? 'bg-primary-700 text-white shadow-md' : 'hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-gray-800 space-y-3">
          <Link to="/" className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <Store className="w-4 h-4 text-roseGold" /> View Storefront
          </Link>
          <button onClick={logout} className="w-full py-2.5 px-4 bg-rose-950/50 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          {/* Business Policy Pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
          <Route path="/admin/coupons" element={<AdminLayout><AdminCoupons /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />
          <Route path="/admin/banners" element={<AdminLayout><AdminBanners /></AdminLayout>} />
          <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <WhatsAppButton />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
