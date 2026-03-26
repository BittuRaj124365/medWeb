import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const InventoryTab = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: medicinesData, isLoading } = useQuery({
    queryKey: ['adminMedicines'],
    queryFn: async () => {
      const res = await apiClient.get('/medicines?limit=1000');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/medicines/${id}`),
    onSuccess: () => {
      toast.success('Medicine deleted');
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminReports']);
      queryClient.invalidateQueries(['adminLogs']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error deleting medicine')
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Inventory Management</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search medicines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <button
            onClick={() => { setEditingMedicine(null); setIsAdding(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-sm border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Selling Price</th>
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
              medicinesData?.medicines?.filter(med => 
                 med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 med.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 (med.manufacturer && med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map(med => (
                <tr key={med._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{med.name}</div>
                    <div className="text-xs text-gray-500">{med.manufacturer}</div>
                    {med.batchNumber && <div className="text-xs text-gray-400 mt-1">Batch: {med.batchNumber}</div>}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{med.category}</td>
                  <td className="p-4 font-medium text-gray-900">₹{med.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {med.expiryDate ? new Date(med.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block ${
                      med.stockQuantity <= 0 ? 'bg-red-100 text-red-700' :
                      med.stockQuantity < (med.minStockThreshold || 5) ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {med.stockQuantity} in stock
                    </div>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setEditingMedicine(med)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => window.confirm('Are you sure you want to delete this medicine?') && deleteMutation.mutate(med._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(isAdding || editingMedicine) && (
        <MedicineFormModal
          medicine={editingMedicine}
          onClose={() => { setIsAdding(false); setEditingMedicine(null); }}
        />
      )}
    </div>
  );
};

// --- Form logic for medicines ---
const MedicineFormModal = ({ medicine, onClose }) => {
  const queryClient = useQueryClient();
  const { data: suppliers } = useQuery({ queryKey: ['adminSuppliers'], queryFn: async () => (await apiClient.get('/admin/suppliers')).data });

  const [formData, setFormData] = useState({
    name: medicine?.name || '',
    genericName: medicine?.genericName || '',
    manufacturer: medicine?.manufacturer || '',
    supplier: medicine?.supplier || '',
    category: medicine?.category || 'Tablet',
    price: medicine?.price || '',
    purchasePrice: medicine?.purchasePrice || '',
    stockQuantity: medicine?.stockQuantity || '',
    minStockThreshold: medicine?.minStockThreshold || 5,
    restockQuantity: 0, // Virtual field just for adding stock
    batchNumber: medicine?.batchNumber || '',
    expiryDate: medicine?.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : '',
    description: medicine?.description || '',
    usageInstructions: medicine?.usageInstructions || '',
    imageUrl: medicine?.imageUrl || ''
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (medicine) return apiClient.put(`/admin/medicines/${medicine._id}`, data);
      return apiClient.post('/admin/medicines', data);
    },
    onSuccess: () => {
      toast.success(medicine ? 'Medicine updated' : 'Medicine created');
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminReports']);
      queryClient.invalidateQueries(['adminLogs']);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price), purchasePrice: Number(formData.purchasePrice), minStockThreshold: Number(formData.minStockThreshold) };
    if(!medicine) payload.stockQuantity = Number(formData.stockQuantity); // Only send base stock if new (editing sends restockQuantity instead to increment)
    if(formData.supplier === '') delete payload.supplier;
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1 */}
          <div className="space-y-4">
             <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Info</h3>
             <div><label className="block text-sm font-medium mb-1">Name *</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             <div><label className="block text-sm font-medium mb-1">Generic Name</label><input type="text" value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             <div>
               <label className="block text-sm font-medium mb-1">Category *</label>
               <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none">
                 {['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div><label className="block text-sm font-medium mb-1">Image URL</label><input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
          </div>
          {/* Column 2 */}
          <div className="space-y-4">
             <h3 className="font-semibold text-gray-800 border-b pb-2">Pricing & Supplier</h3>
             <div className="grid grid-cols-2 gap-2">
                 <div><label className="block text-sm font-medium mb-1">Selling Price (₹) *</label><input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
                 <div><label className="block text-sm font-medium mb-1">Purchase Price</label><input type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             </div>
             <div><label className="block text-sm font-medium mb-1">Manufacturer</label><input type="text" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             <div>
               <label className="block text-sm font-medium mb-1">Supplier</label>
               <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none">
                 <option value="">Select Supplier</option>
                 {suppliers?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
               </select>
             </div>
          </div>
          {/* Column 3 */}
          <div className="space-y-4">
             <h3 className="font-semibold text-gray-800 border-b pb-2">Inventory</h3>
             <div className="grid grid-cols-2 gap-2">
                {!medicine ? (
                   <div><label className="block text-sm font-medium mb-1">Initial Stock *</label><input required type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
                ) : (
                   <div><label className="block text-sm font-medium mb-1">Add Stock</label><input type="number" min="0" value={formData.restockQuantity} onChange={e => setFormData({...formData, restockQuantity: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" placeholder="+ Qty" /></div>
                )}
                <div><label className="block text-sm font-medium mb-1">Min Threshold</label><input type="number" value={formData.minStockThreshold} onChange={e => setFormData({...formData, minStockThreshold: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             </div>
             <div><label className="block text-sm font-medium mb-1">Current Batch Number</label><input type="text" value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
             <div><label className="block text-sm font-medium mb-1">Expiry Date</label><input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" /></div>
          </div>
          <div className="col-span-1 md:col-span-3 space-y-4 mt-2">
             <h3 className="font-semibold text-gray-800 border-b pb-2">Descriptions</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none"></textarea></div>
               <div><label className="block text-sm font-medium mb-1">Usage Instructions</label><textarea rows="2" value={formData.usageInstructions} onChange={e => setFormData({...formData, usageInstructions: e.target.value})} className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none"></textarea></div>
             </div>
          </div>
          <div className="col-span-1 md:col-span-3 flex justify-end gap-3 pt-4 border-t mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 border rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={mutation.isLoading} className="px-5 py-2 bg-primary text-white rounded-lg font-medium">{mutation.isLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryTab;
