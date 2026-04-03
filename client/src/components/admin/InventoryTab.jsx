import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit2, Trash2, Search, Filter, MoreVertical, 
  Package, Tag, Truck, Calendar, Info, ChevronRight, 
  ChevronLeft, ArrowUpDown, Download, CheckCircle2, 
  AlertCircle, XCircle, Share2, Eye, RefreshCw, Loader2, X,
  Image as ImageIcon, History, Layers, IndianRupee, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const InventoryTab = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { data: medicinesData, isLoading } = useQuery({
    queryKey: ['adminMedicines'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/medicines');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/medicines/${id}`),
    onSuccess: () => {
      toast.success('Asset redacted from clinical database');
      queryClient.invalidateQueries(['adminMedicines']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Decommissioning failed')
  });

  const filteredMedicines = medicinesData?.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || med.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Inventory Vault
           </h2>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5 italic">Centralized Pharmaceutical Registry</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group w-full lg:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan ID, Name or Batch..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all italic"
                />
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-10 py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[24px] flex items-center gap-3 shadow-2xl shadow-gray-900/20 hover:bg-black transition-all active:scale-95 whitespace-nowrap"
            >
                <Plus className="w-5 h-5 text-teal-400" /> New Entry
            </button>
        </div>
      </div>

      {/* ── TABLE CONTAINER ── */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-premium overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 text-teal-500/5 -z-0 pointer-events-none rotate-12"><Layers className="w-64 h-64" /></div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Clinical Asset</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Category / Logistics</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Unit Valuation</th>
                <th className="py-8 px-10 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Stock Metrics</th>
                <th className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-50/50">
                    <td colSpan="5" className="py-8 px-10"><div className="h-12 bg-gray-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredMedicines?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                      <div className="space-y-4">
                        <Search className="w-12 h-12 text-gray-100 mx-auto" />
                        <div className="text-xl font-black text-gray-900 italic uppercase">No Assets Matched</div>
                        <p className="text-gray-400 text-xs font-semibold italic">Refine your search parameters to locate clinical data.</p>
                      </div>
                  </td>
                </tr>
              ) : (
                filteredMedicines?.map((med, idx) => (
                  <tr key={med._id} className="group hover:bg-gray-50/50 border-b border-gray-50/50 transition-all duration-300">
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-900 rounded-[22px] flex items-center justify-center relative shadow-xl group-hover:scale-110 transition-all duration-500 overflow-hidden">
                            {med.imageUrl ? (
                                <img src={med.imageUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <Package className="w-7 h-7 text-teal-400" />
                            )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-base font-black text-gray-900 italic uppercase truncate tracking-tighter leading-none">{med.name}</div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 truncate flex items-center gap-2">
                             <Tag className="w-3 h-3" /> {med.genericName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                       <span className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[9px] font-black text-gray-600 uppercase tracking-widest shadow-sm">
                          {med.category}
                       </span>
                       <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-2 pl-1 italic">
                          ID: {med._id.substring(med._id.length - 8).toUpperCase()} • {med.manufacturer || 'System'}
                       </div>
                    </td>
                        <div className="flex flex-col gap-1">
                            <div className="text-sm font-black text-gray-900 tabular-nums">₹{med.price?.toFixed(2) || '0.00'}</div>
                            <div className="text-[9px] font-black text-gray-300 uppercase italic">Wholesale: ₹{(med.purchasePrice || 0).toFixed(2)}</div>
                        </div>
                    <td className="py-6 px-10">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-black italic mb-1">
                              <span className={med.stockQuantity <= med.minStockThreshold ? 'text-rose-500' : 'text-teal-600'}>
                                 {med.stockQuantity} Units
                              </span>
                              <span className="text-gray-300 text-[8px] uppercase tracking-widest">Min: {med.minStockThreshold}</span>
                           </div>
                           <div className="h-1.5 w-32 bg-gray-50 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${med.stockQuantity <= med.minStockThreshold ? 'bg-rose-500' : 'bg-teal-500'}`} 
                                style={{ width: `${Math.min((med.stockQuantity / (med.minStockThreshold * 3)) * 100, 100)}%` }}
                              />
                           </div>
                        </div>
                    </td>
                    <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                            <button onClick={() => setEditingMedicine(med)} className="p-3 text-teal-600 bg-teal-50 hover:bg-teal-600 hover:text-white rounded-[18px] shadow-sm transition-all duration-300" title="Edit Medicine Data">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => window.confirm('Permanently remove this clinical asset?') && deleteMutation.mutate(med._id)} className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-[18px] shadow-sm transition-all duration-300" title="Delete Medicine">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <MoreVertical className="w-5 h-5 text-gray-200 group-hover:hidden ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-10 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
           <div>Showing {filteredMedicines?.length || 0} medicines</div>
           <div className="flex items-center gap-6">
              <button className="p-3 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:text-teal-600 transition-all active:scale-90"><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex items-center gap-1.5">
                  <span className="text-teal-600 font-black italic">01</span>
                  <div className="w-8 h-0.5 bg-teal-500 rounded-full" />
                  <span className="text-gray-300 font-black">05</span>
              </div>
              <button className="p-3 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:text-teal-600 transition-all active:scale-90"><ChevronRight className="w-5 h-5" /></button>
           </div>
        </div>
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
    restockQuantity: 0,
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
      toast.success(medicine ? 'Medicine record updated' : 'Medicine added to database', { icon: medicine ? '🔄' : '➕' });
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminReports']);
      queryClient.invalidateQueries(['adminLogs']);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Synchronization Error')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price), purchasePrice: Number(formData.purchasePrice), minStockThreshold: Number(formData.minStockThreshold) };
    if(!medicine) payload.stockQuantity = Number(formData.stockQuantity);
    if(formData.supplier === '') delete payload.supplier;
    mutation.mutate(payload);
  };

  const inputCls = `w-full pl-6 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all`;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-6xl max-h-[92vh] flex flex-col relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0 rounded-t-[60px]">
          <div className="flex items-center gap-6">
            <div className={`p-5 bg-white rounded-[28px] shadow-2xl ${medicine ? 'text-teal-600' : 'text-teal-500'} animate-float`}>
                {medicine ? <Edit2 className="w-8 h-8" /> : <Package className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">{medicine ? 'Update Asset' : 'Register Product'}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">{medicine ? 'Modification Tier: Clinical Core' : 'Protocol: Initialize New Pharmaceutical Record'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-5 bg-white text-gray-400 hover:text-rose-500 rounded-full shadow-sm transition-all hover:rotate-90 hover:scale-110 active:scale-95"><X className="w-8 h-8" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Column 1: Basic Protocol */}
            <div className="space-y-10">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <Tag className="w-5 h-5 text-teal-500" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Medicine Details</h3>
               </div>
               <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Medicine Name *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="e.g. Paracetamol" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Generic Name</label>
                       <input type="text" value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} className={inputCls} placeholder="Active salt name" />
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Category *</label>
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>
                          {['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Image URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className={inputCls} placeholder="https://..." />
                        </div>
                   </div>
               </div>
            </div>

            {/* Column 2: Logistics & Value */}
            <div className="space-y-10">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <Truck className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Logistics & Value</h3>
               </div>
               <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">MRP (₹) *</label>
                            <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={inputCls} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Wholesale Price (₹)</label>
                            <input type="number" step="0.01" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} className={inputCls} placeholder="0.00" />
                        </div>
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Manufacturer</label>
                        <input type="text" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className={inputCls} placeholder="Company Name" />
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Supplier</label>
                        <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className={inputCls}>
                          <option value="">Select Supplier</option>
                          {suppliers?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                   </div>
               </div>
            </div>

            {/* Column 3: Inventory Control */}
            <div className="space-y-10">
               <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <History className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Inventory Control</h3>
               </div>
               <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                        {!medicine ? (
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Stock Quantity *</label>
                               <input required type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className={inputCls} placeholder="Units" />
                           </div>
                        ) : (
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Add Stock</label>
                               <input type="number" min="0" value={formData.restockQuantity} onChange={e => setFormData({...formData, restockQuantity: e.target.value})} className={`${inputCls} bg-amber-50 focus:bg-white`} placeholder="Units" />
                           </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Low Stock Warning</label>
                            <input type="number" value={formData.minStockThreshold} onChange={e => setFormData({...formData, minStockThreshold: e.target.value})} className={inputCls} placeholder="Threshold" />
                        </div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Batch Number</label>
                       <input type="text" value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} className={inputCls} placeholder="e.g. B-123" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Expiry Date</label>
                       <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                            <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className={inputCls} />
                       </div>
                   </div>
               </div>
            </div>

            {/* Row 2: Narratives */}
            <div className="col-span-1 lg:col-span-3 space-y-8 mt-4 pt-10 border-t border-gray-50">
               <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Descriptions</h3>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Full Description</label>
                    <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputCls} resize-none`} placeholder="Detailed medicine info..."></textarea>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Usage Instructions</label>
                    <textarea rows="4" value={formData.usageInstructions} onChange={e => setFormData({...formData, usageInstructions: e.target.value})} className={`${inputCls} resize-none`} placeholder="Directions for use..."></textarea>
                 </div>
               </div>
            </div>
          </div>
        </form>

        <div className="p-12 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-8 bg-gray-50/70 rounded-b-[60px]">
            <button type="button" onClick={onClose} className="px-12 py-5 bg-white border border-gray-100 rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-sm">
                Cancel
            </button>
            <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={mutation.isLoading} 
                className={`px-20 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.1)] ${
                    medicine 
                        ? 'bg-teal-600 text-white shadow-teal-500/20' 
                        : 'bg-gray-900 text-white shadow-gray-900/20'
                }`}
            >
                {mutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin text-teal-400" /> : <>{medicine ? 'Validate Changes' : 'Initialize Record'} <CheckCircle2 className="w-5 h-5 text-teal-400" /></>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;
