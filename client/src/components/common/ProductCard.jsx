import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = Number(product.stock) <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between">
      {/* Top Media Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <Link to={`/products/${product.slug || product.id}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={`${product.title} view 2`}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}
        </Link>

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-primary-700 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Bestseller / New Arrival Badge */}
        {product.isBestseller && (
          <span className="absolute top-3 right-12 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            BESTSELLER
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-roseGold hover:bg-white shadow-sm transition-colors"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-roseGold text-roseGold' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all ${
              isOutOfStock 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-luxuryDark hover:bg-primary-700 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold text-primary-500 uppercase tracking-wider block mb-1">
            {product.categoryName || product.categorySlug || 'Jewellery'}
          </span>
          <Link to={`/products/${product.slug || product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-1 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-gray-400 line-through">
                ₹{Number(product.mrp).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.ratingAvg && (
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.ratingAvg}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewCount || 1})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
