import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Plus, Minus, MapPin, Share2 } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productAPI, reviewAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProduct(id);
        if (res.success) {
          setProduct(res.data);
          setRelatedProducts(res.relatedProducts || []);
          if (res.data.variants && res.data.variants.length > 0) {
            setSelectedColor(res.data.variants[0].value);
          }
          // Fetch Reviews
          const revRes = await reviewAPI.getProductReviews(res.data.id);
          if (revRes.success) setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-700 border-t-transparent"></div>
        <p className="text-xs text-gray-500 mt-2">Loading luxury item details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold">Product Not Found</h2>
        <Link to="/shop" className="bg-primary-700 text-white text-xs px-6 py-2.5 rounded uppercase font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = Number(product.stock) <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColor);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity, selectedColor);
      navigate('/checkout');
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }
    setPincodeStatus({
      available: true,
      estimatedDelivery: '3 - 5 Business Days via Express Shipping'
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await reviewAPI.submitReview({
        productId: product.id,
        rating: newRating,
        title: newReviewTitle,
        comment: newReviewComment,
        userName: reviewerName
      });
      if (res.success) {
        toast.success(res.message);
        setShowReviewModal(false);
        setReviews(prev => [res.data, ...prev]);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
  };

  const jsonLdSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEOHead
        title={`${product.title} | Zelvora Luxury Accessories`}
        description={product.description.substring(0, 160)}
        image={product.images?.[0]}
        schemaData={jsonLdSchema}
      />

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Gallery & Zoom Preview */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-primary-700 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx ? 'border-primary-700 shadow-md' : 'border-gray-200 opacity-70'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-primary-600 block mb-1">
              {product.categoryName || 'Fashion Accessories'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratingAvg || 5) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{product.ratingAvg || 4.8}</span>
            <span className="text-xs text-gray-400">({reviews.length || product.reviewCount || 1} Customer Reviews)</span>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-primary-50/40 rounded-xl border border-primary-100 flex items-baseline gap-3">
            <span className="font-bold text-3xl text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-sm text-gray-400 line-through">
                MRP ₹{Number(product.mrp).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              You Save ₹{(Number(product.mrp) - Number(product.price)).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            <span className="text-xs font-semibold text-gray-700">
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units available)`}
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Select Option / Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(variant.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                      selectedColor === variant.value 
                        ? 'border-primary-700 bg-primary-700 text-white' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {variant.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter & Primary Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-gray-600 hover:text-black"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-gray-600 hover:text-black"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted ? 'border-roseGold bg-roseGold-light text-roseGold' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-luxuryDark hover:bg-gray-800 text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary-700 hover:bg-primary-600 text-white shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary-600" /> Check Delivery Availability
            </h4>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white font-semibold text-xs px-4 py-2 rounded-lg"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> {pincodeStatus.estimatedDelivery}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 space-y-6">
        <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
          Product Description & Specifications
        </h3>

        <div className="prose max-w-none text-xs text-gray-600 leading-relaxed">
          <p>{product.description}</p>
        </div>

        {product.specs && product.specs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs">
                <span className="font-semibold text-gray-700">{spec.name}</span>
                <span className="text-gray-500">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Customer Reviews */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">Customer Reviews</h3>
            <p className="text-xs text-gray-500">{reviews.length} verified ratings</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider"
          >
            Write a Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-gray-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Verified Purchase</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                {rev.title && <h4 className="text-xs font-bold text-gray-800">{rev.title}</h4>}
                <p className="text-xs text-gray-600">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
