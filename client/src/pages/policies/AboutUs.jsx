import React from 'react';
import SEOHead from '../../components/common/SEOHead';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEOHead title="About Us | Zarija Luxury Accessories India" />

      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-primary-700 font-bold block">Our Heritage & Story</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Crafting Everyday Luxury For Modern Indian Women</h1>
      </div>

      <div className="prose max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <p>
          Welcome to <strong>Zarija Luxury Accessories</strong> — India's premier destination for handcrafted women's fashion jewellery and artisanal accessories.
        </p>
        <p>
          Founded with a passion for traditional Indian craftsmanship and contemporary elegance, Zarija bridges royal Kundan artistry with sleek modern aesthetics. Every pair of Jhumkas, layered pearl choker, rose gold watch, and micro-velvet potli bag is designed to empower women with confidence and grace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-2">
          <Award className="w-8 h-8 text-primary-700 mx-auto" />
          <h3 className="font-serif font-bold text-sm text-gray-900">22K Gold Plated Finish</h3>
          <p className="text-xs text-gray-500">Premium anti-tarnish polish that retains sparkle season after season.</p>
        </div>
        <div className="p-6 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-2">
          <Heart className="w-8 h-8 text-primary-700 mx-auto" />
          <h3 className="font-serif font-bold text-sm text-gray-900">Artisanal Craftsmanship</h3>
          <p className="text-xs text-gray-500">Hand-set stones & delicate zari hand embroidery by master Indian karigars.</p>
        </div>
        <div className="p-6 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-2">
          <ShieldCheck className="w-8 h-8 text-primary-700 mx-auto" />
          <h3 className="font-serif font-bold text-sm text-gray-900">100% Quality Guaranteed</h3>
          <p className="text-xs text-gray-500">Rigorous quality audits prior to dispatch with insured pan-India shipping.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
