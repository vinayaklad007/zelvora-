import React from 'react';
import SEOHead from '../../components/common/SEOHead';

const ReturnRefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <SEOHead title="Return & Refund Policy | Zarija Accessories" />
      <h1 className="font-serif text-3xl font-bold text-gray-900">Return & Refund Policy</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm prose text-xs text-gray-600 leading-relaxed space-y-4">
        <h3 className="font-serif font-bold text-sm text-gray-900">7-Day Hassle-Free Returns</h3>
        <p>At Zarija Accessories, we strive to ensure 100% satisfaction with every luxury item. If you receive a damaged, defective, or incorrect product, you may request a return or replacement within <strong>7 days of delivery</strong> directly from your account page.</p>

        <h3 className="font-serif font-bold text-sm text-gray-900">Conditions For Return</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Item must be unused, unwashed, and in original brand packaging with all tags intact.</li>
          <li>For transit damages or missing items, an unboxing video recorded at the time of opening the package is strongly recommended.</li>
        </ul>

        <h3 className="font-serif font-bold text-sm text-gray-900">Refund Timelines</h3>
        <p>Once the returned parcel is inspected at our warehouse, approved refunds are initiated within <strong>24-48 hours</strong> back to the original payment method (Razorpay / Bank Transfer for COD orders).</p>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;
