import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success('Thank you for subscribing to Zelvora VIP Club!');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-luxuryDark text-gray-300 pt-16 pb-12 border-t border-gray-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
            <Truck className="w-8 h-8 text-roseGold mb-2" />
            <h4 className="font-serif text-sm font-semibold text-white">Express All India Shipping</h4>
            <p className="text-xs text-gray-400 mt-1">Free delivery on orders over ₹999</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-8 h-8 text-roseGold mb-2" />
            <h4 className="font-serif text-sm font-semibold text-white">100% Certified Quality</h4>
            <p className="text-xs text-gray-400 mt-1">Premium 22K gold & anti-tarnish polish</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
            <RefreshCw className="w-8 h-8 text-roseGold mb-2" />
            <h4 className="font-serif text-sm font-semibold text-white">Hassle-Free Returns</h4>
            <p className="text-xs text-gray-400 mt-1">Easy 7-day return & exchange policy</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
            <Lock className="w-8 h-8 text-roseGold mb-2" />
            <h4 className="font-serif text-sm font-semibold text-white">Secure Payments</h4>
            <p className="text-xs text-gray-400 mt-1">Razorpay Verified UPI, Cards & COD</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest text-white">ZELVORA</span>
              <span className="block text-[9px] uppercase tracking-[0.3em] font-medium text-roseGold">
                Luxury Accessories India
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Crafting timeless luxury for modern Indian women. From handcrafted Kundan Jhumkas to rose gold timepieces and velvet potli bags, empower your everyday elegance.
            </p>
            <div className="pt-2 flex items-center gap-4 text-gray-400">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-roseGold transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-roseGold transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-roseGold/30 pb-1.5 inline-block">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/shop?category=earrings" className="hover:text-white transition-colors">Statement Earrings</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-white transition-colors">Kundan & Pearl Necklaces</Link></li>
              <li><Link to="/shop?category=handbags" className="hover:text-white transition-colors">Designer Handbags & Potlis</Link></li>
              <li><Link to="/shop?category=watches" className="hover:text-white transition-colors">Rose Gold Watches</Link></li>
              <li><Link to="/shop?category=gift-collections" className="hover:text-white transition-colors">Festive Gift Sets</Link></li>
            </ul>
          </div>

          {/* Business & Customer Policies */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-roseGold/30 pb-1.5 inline-block">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/return-refund-policy" className="hover:text-white transition-colors">Return & Refund Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-roseGold/30 pb-1.5 inline-block">
              Stay Connected
            </h4>
            <p className="text-xs text-gray-400 mb-3">Subscribe to get exclusive festival preview sales and 10% off your first order.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-roseGold"
              />
              <button
                type="submit"
                className="w-full bg-primary-700 hover:bg-primary-600 text-white font-medium text-xs py-2 px-4 rounded-lg tracking-wider uppercase transition-colors"
              >
                Join VIP Club
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Copyright & Payment Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Zelvora Luxury Accessories India. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-gray-400">Accepted Payments:</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300 font-mono">UPI</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300 font-mono">Cards</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300 font-mono">NetBanking</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-[10px] text-gray-300 font-mono">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
