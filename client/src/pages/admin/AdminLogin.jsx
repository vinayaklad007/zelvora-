import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/common/SEOHead';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ADMIN_EMAILS = ['vinaylad401@gmail.com'];
      const loggedUser = await login(email, password);
      if (loggedUser && ADMIN_EMAILS.includes(loggedUser.email?.toLowerCase())) {
        toast.success('Admin authentication verified');
        navigate('/admin');
      } else {
        toast.error('Access Denied: Administrator permissions required.');
      }
    } catch (err) {
      // Toast already shown in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your admin email address.');
      return;
    }
    const ADMIN_EMAILS = ['vinaylad401@gmail.com'];
    if (!ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
      toast.error('Access Denied: Only authorized administrator email can request password reset.');
      return;
    }
    setIsSendingReset(true);
    try {
      await resetPassword(email.trim());
    } catch (err) {
      // Toast already shown in AuthContext
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <SEOHead title="Admin Security Portal | Zelvora Accessories" />

      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-900 text-roseGold rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Store Admin Portal</h1>
          <p className="text-xs text-gray-500">Sign in with authorized administrator credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Admin Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zelvoraluxury.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-700 font-medium text-gray-800"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-semibold text-gray-700">Password *</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSendingReset}
                className="text-xs text-roseGold font-semibold hover:underline focus:outline-none cursor-pointer"
              >
                {isSendingReset ? 'Sending Reset Email...' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
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
            disabled={isSubmitting}
            className="w-full py-3 bg-primary-900 hover:bg-black text-white font-bold text-xs uppercase rounded-xl tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In To Admin Dashboard'} <ArrowRight className="w-4 h-4 text-roseGold" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
