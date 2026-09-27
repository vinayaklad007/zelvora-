import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getReviewsAdmin();
      if (res.success) setReviews(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete review?')) {
      try {
        await reviewAPI.deleteReviewAdmin(id);
        toast.success('Review deleted');
        fetchReviews();
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Moderate Reviews | Zarija Admin" />

      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-xs text-gray-500">Monitor customer feedback and remove inappropriate product reviews</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Text</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td className="p-4 font-bold text-gray-900">{r.userName}</td>
                  <td className="p-4">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    {r.title && <div className="font-bold text-gray-800">{r.title}</div>}
                    <div className="text-gray-600 line-clamp-2">{r.comment}</div>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(r.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
