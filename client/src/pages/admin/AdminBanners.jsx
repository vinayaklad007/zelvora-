import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [buttonText, setButtonText] = useState('Shop Collection');

  const fetchBanners = async () => {
    try {
      const res = await adminAPI.getBanners();
      if (res.success) setBanners(res.data || []);
    } catch (err) {
      toast.error('Failed to load banners');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.createBanner({ title, subtitle, imageUrl, linkUrl, buttonText });
      if (res.success) {
        toast.success('Banner created!');
        setShowModal(false);
        setTitle('');
        fetchBanners();
      }
    } catch (err) {
      toast.error('Failed to create banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete banner?')) {
      try {
        await adminAPI.deleteBanner(id);
        toast.success('Banner deleted');
        fetchBanners();
      } catch (err) {
        toast.error('Failed to delete banner');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Banners | Zarija Admin" />

      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Promotional Banners</h1>
          <p className="text-xs text-gray-500">Manage homepage hero carousel and promotional announcements</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <img src={b.imageUrl} alt={b.title} className="w-full h-44 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-sm text-gray-900">{b.title}</h3>
                <p className="text-xs text-gray-500">{b.subtitle}</p>
              </div>
              <button onClick={() => handleDelete(b.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-lg font-bold">New Hero Banner</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input type="text" placeholder="Title (e.g. Royal Festive Edit)" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="text" placeholder="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="url" placeholder="High-Res Image URL *" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="text" placeholder="Link Destination (/shop)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="text" placeholder="Button Text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-700 text-white font-bold rounded-xl uppercase">Create Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
