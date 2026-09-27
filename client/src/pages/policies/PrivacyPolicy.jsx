import React from 'react';
import SEOHead from '../../components/common/SEOHead';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <SEOHead title="Privacy Policy | Zarija Accessories" />
      <h1 className="font-serif text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm prose text-xs text-gray-600 leading-relaxed space-y-4">
        <p>Zarija Accessories respects your privacy and is committed to protecting your personal data in compliance with Indian IT regulations and international privacy standards.</p>
        <h3 className="font-serif font-bold text-sm text-gray-900">Data Collection & Usage</h3>
        <p>We collect essential information (name, email, delivery address, mobile number) solely to process orders, issue invoices, and communicate dispatch status. Payment details are handled securely via Razorpay PCI-DSS certified gateways and are never stored on our servers.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
