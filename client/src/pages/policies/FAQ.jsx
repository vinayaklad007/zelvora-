import React from 'react';
import SEOHead from '../../components/common/SEOHead';

const FAQ = () => {
  const faqs = [
    { q: "Are all products hypoallergenic and anti-tarnish?", a: "Yes! All our jewellery pieces feature 22K gold dip or rhodium plating with anti-tarnish coating to ensure longevity and skin friendliness." },
    { q: "Do you offer Cash on Delivery (COD)?", a: "Yes, Cash on Delivery is available for all pincodes across India." },
    { q: "How do I apply a discount coupon code?", a: "During checkout or on your Shopping Bag page, enter your coupon code (e.g. WELCOME10) in the promo box and click Apply." },
    { q: "Can I send an order as a gift hamper?", a: "Absolutely! Choose from our Gift Collections or add a personalized gift message during checkout." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEOHead title="Frequently Asked Questions | Zarija Accessories" />
      <h1 className="font-serif text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-sm text-gray-900">Q: {faq.q}</h3>
            <p className="text-xs text-gray-600">A: {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
