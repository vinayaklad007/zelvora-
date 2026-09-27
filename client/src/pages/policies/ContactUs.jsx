import React, { useState } from 'react';
import SEOHead from '../../components/common/SEOHead';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! Your inquiry has been sent to our customer concierge team.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead title="Contact Us | Zarija Accessories" />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl font-bold text-gray-900">We Would Love To Hear From You</h1>
        <p className="text-xs text-gray-500">Have a question regarding custom styling, order tracking, or wholesale hampers?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <Phone className="w-6 h-6 text-primary-700 mx-auto" />
          <h4 className="font-serif font-bold text-sm text-gray-900">Customer Helpline</h4>
          <p className="text-xs text-gray-600">+91 98765 43210</p>
          <p className="text-[10px] text-gray-400">Mon - Sat (10:00 AM - 7:00 PM IST)</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <Mail className="w-6 h-6 text-primary-700 mx-auto" />
          <h4 className="font-serif font-bold text-sm text-gray-900">Email Support</h4>
          <p className="text-xs text-gray-600">support@aurazarija.com</p>
          <p className="text-[10px] text-gray-400">24/7 Response Time Within 4 Hours</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
          <MessageCircle className="w-6 h-6 text-emerald-600 mx-auto" />
          <h4 className="font-serif font-bold text-sm text-gray-900">WhatsApp Concierge</h4>
          <p className="text-xs text-gray-600">+91 98765 43210</p>
          <p className="text-[10px] text-gray-400">Instant Order Updates & Styling Advice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">Send Us A Direct Message</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <input
            type="text"
            placeholder="Your Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 border border-gray-200 rounded-xl focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email *"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="p-3 border border-gray-200 rounded-xl focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="p-3 border border-gray-200 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="p-3 border border-gray-200 rounded-xl focus:outline-none"
          />
          <textarea
            placeholder="Your Message..."
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="sm:col-span-2 p-3 border border-gray-200 rounded-xl focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-primary-700 text-white font-bold text-xs uppercase px-8 py-3 rounded-xl shadow-luxury flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
