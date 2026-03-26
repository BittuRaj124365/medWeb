import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const SuppliersTab = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['adminSuppliers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/suppliers');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/suppliers/${id}`),
    onSuccess: () => {
      toast.success('Supplier deleted');
      queryClient.invalidateQueries(['adminSuppliers']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error deleting supplier');
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Suppliers Management</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <button
            onClick={() => { setEditingSupplier(null); setIsAdding(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-sm border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading suppliers...</td></tr>
            ) : suppliers?.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No suppliers found.</td></tr>
            ) : (
              suppliers?.filter(sup => 
                sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (sup.email && sup.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
                (sup.contactNumber && sup.contactNumber.includes(searchTerm))
              ).map(sup => (
                <tr key={sup._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{sup.name}</td>
                  <td className="p-4 text-sm text-gray-600">{sup.contactNumber}</td>
                  <td className="p-4 text-sm text-gray-600">{sup.email}</td>
                  <td className="p-4 text-sm text-gray-600">{sup.address}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setEditingSupplier(sup)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.confirm('Are you sure?') && deleteMutation.mutate(sup._id)}
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

      {(isAdding || editingSupplier) && (
        <SupplierFormModal
          supplier={editingSupplier}
          onClose={() => { setIsAdding(false); setEditingSupplier(null); }}
        />
      )}
    </div>
  );
};

const SupplierFormModal = ({ supplier, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactNumber: supplier?.contactNumber || '',
    email: supplier?.email || '',
    address: supplier?.address || ''
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (supplier) return apiClient.put(`/admin/suppliers/${supplier._id}`, data);
      return apiClient.post('/admin/suppliers', data);
    },
    onSuccess: () => {
      toast.success(supplier ? 'Supplier updated' : 'Supplier added');
      queryClient.invalidateQueries(['adminSuppliers']);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error occurred')
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-bold">{supplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={mutation.isLoading} className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium">{mutation.isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuppliersTab;
