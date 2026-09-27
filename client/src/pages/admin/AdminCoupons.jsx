import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, X } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { couponAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('999');
  const [maxDiscount, setMaxDiscount] = useState('500');

  const fetchCoupons = async () => {
    try {
      const res = await couponAPI.getCouponsAdmin();
      if (res.success) setCoupons(res.data || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await couponAPI.createCouponAdmin({
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        maxDiscount: Number(maxDiscount)
      });
      if (res.success) {
        toast.success('Coupon created!');
        setShowModal(false);
        setCode('');
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.message || 'Coupon creation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete coupon?')) {
      try {
        await couponAPI.deleteCouponAdmin(id);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch (err) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Coupons | Zarija Admin" />

      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Discount Coupons</h1>
          <p className="text-xs text-gray-500">Create & manage store promo codes and spend thresholds</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-700 hover:bg-primary-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((cup) => (
          <div key={cup.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg">
                {cup.code}
              </span>
              <button onClick={() => handleDelete(cup.id)} className="text-gray-400 hover:text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-semibold text-gray-800">
              {cup.discountType === 'PERCENTAGE' ? `${cup.discountValue}% OFF` : `Flat ₹${cup.discountValue} OFF`}
            </p>
            <p className="text-[11px] text-gray-500">Min Spend: ₹{cup.minOrderValue} | Max Cap: ₹{cup.maxDiscount || 'No Limit'}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-lg font-bold">New Coupon</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input type="text" placeholder="Coupon Code (e.g. FESTIVE15)" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full p-2.5 border rounded-xl font-mono uppercase" />
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-2.5 border rounded-xl">
                <option value="PERCENTAGE">Percentage Discount (%)</option>
                <option value="FIXED">Fixed Amount Discount (₹)</option>
              </select>
              <input type="number" placeholder="Discount Value (e.g. 15 or 200)" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="number" placeholder="Min Order Value (₹)" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <input type="number" placeholder="Max Discount Cap (₹)" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-primary-700 text-white font-bold rounded-xl uppercase">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
