import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title: '',
    description: '',
    price: '',
    mrp: '',
    stock: '',
    sku: '',
    categoryId: 'cat_earrings',
    categoryName: 'Earrings',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        productAPI.getProducts({ adminView: 'true', limit: 100 }),
        categoryAPI.getCategories()
      ]);
      if (pRes.success) setProducts(pRes.data || []);
      if (cRes.success) setCategories(cRes.data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setImageUrlInput('');
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingId(prod.id);
    setFormData({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price || '',
      mrp: prod.mrp || '',
      stock: prod.stock || '',
      sku: prod.sku || '',
      categoryId: prod.categoryId || 'cat_earrings',
      categoryName: prod.categoryName || 'Earrings',
      images: prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
      isFeatured: prod.isFeatured || false,
      isBestseller: prod.isBestseller || false,
      isNewArrival: prod.isNewArrival || false,
      isActive: prod.isActive !== false
    });
    setImageUrlInput('');
    setShowModal(true);
  };

  // Handle image file selection directly from PC
  const handleFileSelectFromPC = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not an image`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64Image]
        }));
        toast.success(`Image "${file.name}" uploaded from PC!`);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Image via URL input
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
      toast.success('Image URL added');
    }
  };

  // Remove image from form
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please add or upload at least 1 product image.');
      return;
    }

    try {
      if (editingId) {
        const res = await productAPI.updateProduct(editingId, formData);
        if (res.success) {
          toast.success('Product updated successfully!');
          setShowModal(false);
          fetchProducts();
        }
      } else {
        const res = await productAPI.createProduct(formData);
        if (res.success) {
          toast.success('Product created successfully!');
          setShowModal(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await productAPI.deleteProduct(id);
        if (res.success) {
          toast.success(res.message || 'Product deleted successfully');
          setProducts(prev => prev.filter(p => p.id !== id));
          fetchProducts();
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Products | Zarija Admin" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-xs text-gray-500">Add, edit, or remove store products and manage inventory</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl uppercase tracking-wider shadow-luxury flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search products by title or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / MRP</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images?.[0]} alt={prod.title} className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{prod.title}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-700">{prod.categoryName || 'Jewellery'}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900">₹{prod.price}</span>
                    {prod.mrp > prod.price && <span className="text-[10px] text-gray-400 line-through block">₹{prod.mrp}</span>}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${prod.stock < 5 ? 'text-rose-600' : 'text-gray-900'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 text-[9px] font-bold">
                      {prod.isFeatured && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Featured</span>}
                      {prod.isBestseller && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Bestseller</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEditModal(prod)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prod.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  placeholder="e.g. Kundan Pearl Jhumka Earrings"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                    placeholder="1899"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                    placeholder="3499"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                    placeholder="25"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    const selectedCat = categories.find(c => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                      categoryName: selectedCat ? selectedCat.name : 'Jewellery'
                    });
                  }}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none font-medium"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Product Images Section: Select from PC or Paste URL */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-semibold text-gray-700">Product Images (Select from PC or Paste URL)</label>
                
                {/* Image Selection Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Option 1: File upload from PC */}
                  <label className="flex-1 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-primary-700" />
                    <span className="font-bold text-primary-900 text-xs">Select Image from PC / Laptop</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelectFromPC}
                      className="hidden"
                    />
                  </label>

                  {/* Option 2: Image URL input */}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 p-2.5 border border-gray-200 rounded-xl focus:outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-gray-900 text-white font-bold text-xs px-3 rounded-xl"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Selected Images Thumbnails Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                    {formData.images.map((imgSrc, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                        <img src={imgSrc} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full shadow-md hover:bg-rose-700 transition-colors"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:outline-none"
                  placeholder="Detailed handcrafted description..."
                ></textarea>
              </div>

              <div className="flex gap-4 font-semibold text-gray-700 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="text-primary-700"
                  /> Featured
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="text-primary-700"
                  /> Bestseller
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-700 text-white font-bold rounded-xl uppercase">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
