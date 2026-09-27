import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, Heart, ShoppingBag, Gift, Truck } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { ProductGridSkeleton } from '../components/common/SkeletonLoaders';
import { productAPI, categoryAPI, adminAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, banRes] = await Promise.all([
          productAPI.getProducts({ limit: 20 }),
          categoryAPI.getCategories(),
          adminAPI.getBanners()
        ]);

        if (prodRes.success) {
          const prods = prodRes.data || [];
          setFeaturedProducts(prods.filter(p => p.isFeatured).slice(0, 4));
          setNewArrivals(prods.filter(p => p.isNewArrival).slice(0, 4));
          setBestSellers(prods.filter(p => p.isBestseller).slice(0, 4));
        }

        if (catRes.success) {
          setCategories(catRes.data || []);
        }

        if (banRes.success) {
          setBanners(banRes.data || []);
        }
      } catch (err) {
        console.error("Home page data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroBanner = banners.find(b => b.active) || {
    title: 'Royal Festive Collection',
    subtitle: 'Handcrafted Kundan Jhumkas, Pearl Chokers & Velvet Potli Bags',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/shop',
    buttonText: 'Explore Collection'
  };

  return (
    <div className="space-y-16 pb-16">
      <SEOHead 
        title="Zelvora Luxury Accessories | Women's Fashion Jewellery India" 
        description="Discover handcrafted Kundan earrings, rose gold watches, velvet potli handbags, & festive gift hampers in India."
      />

      {/* Hero Banner Section */}
      <section className="relative h-[480px] sm:h-[580px] lg:h-[640px] bg-luxuryDark text-white overflow-hidden">
        <img
          src={heroBanner.imageUrl}
          alt={heroBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryDark via-luxuryDark/70 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center max-w-2xl">
          <span className="text-roseGold font-semibold text-xs uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> New Season Arrival
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
            {heroBanner.title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base font-light mb-8 leading-relaxed">
            {heroBanner.subtitle}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to={heroBanner.linkUrl || '/shop'}
              className="bg-primary-700 hover:bg-primary-600 text-white font-medium text-xs sm:text-sm py-3 px-8 rounded-lg uppercase tracking-wider shadow-luxury transition-all flex items-center gap-2 group"
            >
              {heroBanner.buttonText || 'Shop Collection'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-semibold text-primary-700 tracking-widest block mb-1">
            Curated For You
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Shop By Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-center p-3"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-xs font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-semibold text-primary-700 tracking-widest block mb-1">
              Fresh Off The Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              New Arrivals
            </h2>
          </div>
          <Link to="/shop?sort=newest" className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 group">
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Festival Promotional Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-luxuryDark text-white p-8 sm:p-12 overflow-hidden shadow-luxury">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-roseGold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Festive Edit 2026
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold">
              Grand Wedding & Festive Hampers
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm font-light">
              Receive a complimentary velvet jewelry trunk box with orders above ₹2,999. Use code <strong className="text-white">FESTIVE200</strong> at checkout.
            </p>
            <Link
              to="/shop?category=gift-collections"
              className="inline-block bg-white text-primary-900 font-bold text-xs uppercase px-6 py-3 rounded-lg shadow-md hover:bg-roseGold hover:text-white transition-colors"
            >
              Explore Gift Hampers
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-semibold text-primary-700 tracking-widest block mb-1">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Best Sellers
            </h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 group">
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-primary-50/50 py-16 border-y border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex justify-center text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Loved By Thousands of Women
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center text-amber-500 gap-1 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" /> 5.0 Verified Buyer
              </div>
              <p className="text-xs text-gray-600 italic">
                "The Kundan Jhumkas are absolutely breathtaking! The weight is so comfortable and the finish looks just like real gold. Ordered for my sister's wedding!"
              </p>
              <div className="pt-2 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-roseGold-light text-roseGold font-bold text-xs flex items-center justify-center">
                  AP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Ananya P.</h4>
                  <p className="text-[10px] text-gray-400">Mumbai, Maharashtra</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center text-amber-500 gap-1 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" /> 5.0 Verified Buyer
              </div>
              <p className="text-xs text-gray-600 italic">
                "The rose gold watch quality exceeded my expectations. Fast 2-day delivery to Bengaluru and the packaging was super regal!"
              </p>
              <div className="pt-2 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-roseGold-light text-roseGold font-bold text-xs flex items-center justify-center">
                  SR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Sneha R.</h4>
                  <p className="text-[10px] text-gray-400">Bengaluru, Karnataka</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center text-amber-500 gap-1 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" /> 5.0 Verified Buyer
              </div>
              <p className="text-xs text-gray-600 italic">
                "The velvet potli bag matched my lehenga perfectly. High quality zari work and very spacious!"
              </p>
              <div className="pt-2 border-t border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-roseGold-light text-roseGold font-bold text-xs flex items-center justify-center">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Meera K.</h4>
                  <p className="text-[10px] text-gray-400">Delhi NCR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
