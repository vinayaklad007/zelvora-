import React, { useState, useEffect } from 'react';
import { UserCheck, UserX } from 'lucide-react';
import SEOHead from '../../components/common/SEOHead';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await adminAPI.getCustomers();
      if (res.success) setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await adminAPI.toggleCustomerStatus(id);
      if (res.success) {
        toast.success(res.message);
        fetchCustomers();
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <SEOHead title="Manage Customers | Zarija Admin" />

      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-xs text-gray-500">View registered customer accounts & manage account status</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase border-b border-gray-100">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    Loading registered customer accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id || c.uid}>
                    <td className="p-4 font-bold text-gray-900">{c.name || c.displayName || 'Customer'}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 text-gray-600">{c.phone || 'N/A'}</td>
                    <td className="p-4 font-mono font-bold uppercase">{c.role || 'customer'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.disabled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {c.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(c.id || c.uid)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${c.disabled ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                      >
                        {c.disabled ? <><UserCheck className="w-3.5 h-3.5" /> Enable</> : <><UserX className="w-3.5 h-3.5" /> Disable</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
