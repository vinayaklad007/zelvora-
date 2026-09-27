import React from 'react';
import SEOHead from '../../components/common/SEOHead';

const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <SEOHead title="Shipping Policy | Zarija Accessories" />
      <h1 className="font-serif text-3xl font-bold text-gray-900">Shipping & Delivery Policy</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm prose text-xs text-gray-600 leading-relaxed space-y-4">
        <h3 className="font-serif font-bold text-sm text-gray-900">1. Order Processing Time</h3>
        <p>All orders are processed within 24 to 48 business hours. Orders placed on Sundays or public national holidays will be processed on the next business day.</p>

        <h3 className="font-serif font-bold text-sm text-gray-900">2. Shipping Charges & Free Shipping Threshold</h3>
        <p>We offer <strong>FREE Shipping across India</strong> on all orders equal to or exceeding <strong>₹999</strong>. For orders below ₹999, a nominal flat shipping fee of ₹99 applies.</p>

        <h3 className="font-serif font-bold text-sm text-gray-900">3. Delivery Timelines</h3>
        <ul className="list-disc pl-5">
          <li><strong>Metro Cities (Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad):</strong> 2 to 4 Business Days</li>
          <li><strong>Rest of India:</strong> 4 to 7 Business Days</li>
          <li><strong>Special / Remote Pincodes:</strong> Up to 7 to 9 Business Days</li>
        </ul>

        <h3 className="font-serif font-bold text-sm text-gray-900">4. Order Tracking</h3>
        <p>Once your parcel is dispatched from our central warehouse, an SMS and Email containing your courier partner details and AWB tracking link will be sent to your registered contact numbers.</p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
