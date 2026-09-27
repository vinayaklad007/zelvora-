import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getCategories();
      if (res.success) setCategories(res.data || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await categoryAPI.createCategory({ name, image, description });
      if (res.success) {
        toast.success('Category created!');
        setShowModal(false);
        setName('');
        setImage('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Creation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await categoryAPI.deleteCategory(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Categories | Zarija Admin" />

      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-xs text-gray-500">Create & manage store product categories dynamically</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-sm text-gray-900 truncate">{cat.name}</h3>
              <p className="text-[10px] text-gray-400 font-mono">slug: {cat.slug}</p>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-lg font-bold">New Category</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input type="text" placeholder="Category Name (e.g. Anklets)" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-xl"></textarea>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-700 text-white font-bold rounded-xl uppercase">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
