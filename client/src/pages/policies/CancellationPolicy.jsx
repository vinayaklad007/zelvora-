import React from 'react';
import SEOHead from '../../components/common/SEOHead';

const CancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <SEOHead title="Cancellation Policy | Zarija Accessories" />
      <h1 className="font-serif text-3xl font-bold text-gray-900">Cancellation Policy</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm prose text-xs text-gray-600 leading-relaxed space-y-4">
        <h3 className="font-serif font-bold text-sm text-gray-900">Order Cancellation Window</h3>
        <p>You can cancel your order free of charge at any time before the status updates to <strong>"Shipped"</strong>.</p>
        <p>To cancel an order, navigate to <strong className="text-gray-900">My Account → Order History</strong>, click on the order, and select <strong>Cancel Order</strong>.</p>
        <h3 className="font-serif font-bold text-sm text-gray-900">Prepaid Orders Cancellation</h3>
        <p>For prepaid Razorpay orders, the full amount will be credited back to your bank account / UPI within 3 to 5 business days.</p>
      </div>
    </div>
  );
};

export default CancellationPolicy;
