import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Plus, Edit2, Trash2, Package, AlertTriangle, AlertCircle, Settings, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/dashboard');
      return res.data;
    }
  });

  const { data: medicinesData, isLoading } = useQuery({
    queryKey: ['adminMedicines'],
    queryFn: async () => {
      const res = await apiClient.get('/medicines?limit=1000');
      return res.data;
    }
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/medicines/${id}`),
    onSuccess: () => {
      toast.success('Medicine deleted');
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminStats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error deleting medicine');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your medicine inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-primary/10 rounded-xl text-primary">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Medicines</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.totalMedicines || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-yellow-50 rounded-xl text-yellow-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.lowStock || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-red-50 rounded-xl text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.outOfStock || 0}</h3>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Inventory Management</h2>
            <button
              onClick={() => { setEditingMedicine(null); setIsAdding(true); }}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Medicine
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Expiry</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading inventory...</td></tr>
                ) : medicinesData?.medicines?.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No medicines found. Add some!</td></tr>
                ) : (
                  medicinesData?.medicines?.map(med => (
                    <tr key={med._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{med.name}</div>
                        <div className="text-xs text-gray-500">{med.manufacturer}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{med.category}</td>
                      <td className="p-4 font-medium text-gray-900">
                        ₹{med.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          med.stockQuantity === 0 ? 'bg-red-100 text-red-700' :
                          med.stockQuantity < 10 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {med.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => setEditingMedicine(med)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal for Add / Edit */}
      {(isAdding || editingMedicine) && (
        <MedicineFormModal
          medicine={editingMedicine}
          onClose={() => { setIsAdding(false); setEditingMedicine(null); }}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <CredentialsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

// ─── Settings / Credentials Modal ─────────────────────────────────────────────
const CredentialsModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const credentialsMutation = useMutation({
    mutationFn: (data) => apiClient.put('/admin/credentials', data),
    onSuccess: (res) => {
      toast.success(res.data.message || 'Credentials updated!');
      // Update stored user & token
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.username) user.username = res.data.username;
      localStorage.setItem('adminUser', JSON.stringify(user));
      if (res.data.token) localStorage.setItem('adminToken', res.data.token);
      
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update credentials');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (!formData.newUsername && !formData.newPassword) {
      toast.error('Please provide at least a new username or new password');
      return;
    }
    credentialsMutation.mutate({
      currentPassword: formData.currentPassword,
      newUsername: formData.newUsername || undefined,
      newPassword: formData.newPassword || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> Update Credentials
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
            <input
              required
              type="password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">New Credentials (leave blank to keep current)</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Username</label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={formData.newUsername}
                  onChange={e => setFormData({ ...formData, newUsername: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={formData.confirmNewPassword}
                  onChange={e => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={credentialsMutation.isLoading}
              className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-50"
            >
              {credentialsMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Medicine Form Modal ───────────────────────────────────────────────────────
const MedicineFormModal = ({ medicine, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: medicine?.name || '',
    genericName: medicine?.genericName || '',
    manufacturer: medicine?.manufacturer || '',
    category: medicine?.category || 'Tablet',
    price: medicine?.price || '',
    currency: 'INR',
    stockQuantity: medicine?.stockQuantity || '',
    expiryDate: medicine?.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
    description: medicine?.description || '',
    usageInstructions: medicine?.usageInstructions || '',
    imageUrl: medicine?.imageUrl || ''
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (medicine) {
        return apiClient.put(`/admin/medicines/${medicine._id}`, data);
      }
      return apiClient.post('/admin/medicines', data);
    },
    onSuccess: () => {
      toast.success(medicine ? 'Medicine updated' : 'Medicine created');
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminStats']);
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
            <input type="text" value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <input type="text" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
              {['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty *</label>
              <input required type="number" min="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" placeholder="https://" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"></textarea>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Instructions</label>
            <textarea rows="2" value={formData.usageInstructions} onChange={e => setFormData({...formData, usageInstructions: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"></textarea>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isLoading} className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-teal-700 font-medium w-32 flex justify-center transition-colors disabled:opacity-50">
              {mutation.isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline X icon for modals
const X = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default AdminDashboard;
