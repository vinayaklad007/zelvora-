import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { ProductGridSkeleton } from '../components/common/SkeletonLoaders';
import { productAPI, categoryAPI } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States initialized from URL search params
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.success) setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {
          category: categoryParam,
          search: searchParam,
          sort: sortParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          inStockOnly: inStockParam,
          page: pageParam,
          limit: 12
        };

        const res = await productAPI.getProducts(queryParams);
        if (res.success) {
          setProducts(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead 
        title={`${categoryParam !== 'all' ? categoryParam.toUpperCase() : 'Shop Accessories'} | Zelvora`}
        description="Explore luxury women's fashion accessories, earrings, necklaces, watches & handbags."
      />

      {/* Breadcrumbs & Header */}
      <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
            {categoryParam !== 'all' ? categoryParam.replace('-', ' ') : searchParam ? `Search: "${searchParam}"` : 'All Accessories'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {products.length} of {pagination.total} luxury accessories
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-xs font-medium text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-primary-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif text-sm font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            {(categoryParam !== 'all' || searchParam || minPriceParam || maxPriceParam || inStockParam) && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-roseGold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Category</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <button
                onClick={() => updateFilters('category', 'all')}
                className={`block w-full text-left py-1 hover:text-primary-700 ${categoryParam === 'all' ? 'font-bold text-primary-700' : ''}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilters('category', cat.slug)}
                  className={`block w-full text-left py-1 hover:text-primary-700 capitalize ${categoryParam === cat.slug ? 'font-bold text-primary-700' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Price Range (₹)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceParam}
                onChange={(e) => updateFilters('minPrice', e.target.value)}
                className="w-1/2 p-2 border border-gray-200 rounded text-xs focus:outline-none"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceParam}
                onChange={(e) => updateFilters('maxPrice', e.target.value)}
                className="w-1/2 p-2 border border-gray-200 rounded text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
              <input
                type="checkbox"
                checked={inStockParam}
                onChange={(e) => updateFilters('inStock', e.target.checked ? 'true' : '')}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              In-Stock Products Only
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3 space-y-8">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 space-y-4">
              <p className="text-sm font-semibold text-gray-700">No luxury accessories matched your filter criteria.</p>
              <button
                onClick={clearAllFilters}
                className="bg-primary-700 text-white font-medium text-xs py-2.5 px-6 rounded-lg uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={pagination.page <= 1}
                onClick={() => updateFilters('page', pagination.page - 1)}
                className="px-3 py-1.5 border border-gray-200 rounded text-xs font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-700 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateFilters('page', pagination.page + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded text-xs font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
