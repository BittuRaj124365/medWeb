import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit2, Trash2, Search, Filter, MoreVertical, 
  Package, Tag, Truck, Calendar, Info, ChevronRight, 
  ChevronLeft, ArrowUpDown, Download, CheckCircle2, 
  AlertCircle, XCircle, Share2, Eye, RefreshCw, Loader2,
  Image as ImageIcon, History, Layers, IndianRupee
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
      const res = await apiClient.get('/medicines?limit=1000');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/medicines/${id}`),
    onSuccess: () => {
      toast.success('Clinical Archive Purged', { icon: '🗑️' });
      queryClient.invalidateQueries(['adminMedicines']);
      queryClient.invalidateQueries(['adminReports']);
      queryClient.invalidateQueries(['adminLogs']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Purge Operation Failed')
  });

  const categories = ['All', 'Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'];

  const filteredMedicines = medicinesData?.medicines?.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         med.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (med.manufacturer && med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || med.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ── TOOLBAR ── */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, Name, or Generic..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-gray-100 focus:ring-4 focus:ring-primary/5 transition-all"
                />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-[24px] border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
                {categories.slice(0, 5).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            filterCategory === cat 
                                ? 'bg-white text-primary shadow-sm' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm text-gray-400 hover:text-primary transition-all">
                <Download className="w-5 h-5 mx-auto" />
             </button>
             <button
                onClick={() => { setEditingMedicine(null); setIsAdding(true); }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-[24px] hover:bg-black transition-all text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-5 h-5 text-primary" /> Add Medicine
              </button>
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Medicine Details</th>
                <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Category</th>
                <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Pricing (INR)</th>
                <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Expiry Date</th>
                <th className="py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Stock Level</th>
                <th className="py-8 px-10 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan="6" className="p-20 text-center"><Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" /><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">Retrieving Central Logs...</p></td></tr>
              ) : filteredMedicines?.length === 0 ? (
                <tr><td colSpan="6" className="p-20 text-center space-y-4"><Package className="w-16 h-16 text-gray-200 mx-auto" /><div className="text-xl font-black text-gray-900 italic uppercase">No Medicines Found</div><p className="text-gray-400 font-semibold italic text-sm">No medicine records match your current search parameters.</p></td></tr>
              ) : (
                filteredMedicines.map((med, idx) => (
                  <tr key={med._id} className="group hover:bg-gray-50/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="py-6 px-10">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-50 rounded-[20px] p-3 flex items-center justify-center border border-gray-50 group-hover:bg-white transition-colors relative overflow-hidden group/img">
                            <img 
                                src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'} 
                                className="w-full h-full object-contain group-hover/img:scale-125 transition-transform duration-700"
                                alt={med.name}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'; }}
                            />
                        </div>
                        <div>
                          <div className="text-sm font-black text-gray-900 italic uppercase">{med.name}</div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{med.manufacturer || 'Unknown Lab'}</div>
                          {med.batchNumber && <div className="text-[9px] font-black text-primary uppercase tracking-tighter mt-1 italic">Log: {med.batchNumber}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500">
                            {med.category}
                        </span>
                    </td>
                    <td className="py-6 px-10">
                        <div className="text-sm font-black text-gray-900 italic">₹{med.price.toFixed(2)}</div>
                        {med.purchasePrice && <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1 line-through opacity-50">₹{med.purchasePrice.toFixed(2)}</div>}
                    </td>
                    <td className="py-6 px-10">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-500 italic">{med.expiryDate ? new Date(med.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                            {med.expiryDate && new Date(med.expiryDate) < new Date() && (
                                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mt-1">Life Expired</span>
                            )}
                        </div>
                    </td>
                    <td className="py-6 px-10">
                      <div className="space-y-2">
                        <div className={`text-[10px] font-black uppercase tracking-widest ${
                          med.stockQuantity <= 0 ? 'text-rose-500' :
                          med.stockQuantity < (med.minStockThreshold || 5) ? 'text-amber-500' :
                          'text-emerald-500'
                        }`}>
                          {med.stockQuantity} In Stock
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full transition-all duration-1000 ${
                                med.stockQuantity <= 0 ? 'bg-rose-500 w-0' :
                                med.stockQuantity < (med.minStockThreshold || 5) ? 'bg-amber-500 w-1/3 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                'bg-emerald-500 w-full shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                             }`} 
                           />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingMedicine(med)} className="p-3 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all" title="Modify Protocol">
                            <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => window.confirm('Purge clinical node from live archive?') && deleteMutation.mutate(med._id)} className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all" title="Purge Asset">
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
           <div>Showing {filteredMedicines?.length || 0} medicine records</div>
           <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-lg border border-gray-100 opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-gray-900 border-b-2 border-primary pb-0.5">Page 01</span>
              <button className="p-2 bg-white rounded-lg border border-gray-100 opacity-30"><ChevronRight className="w-4 h-4" /></button>
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

  const inputCls = `w-full pl-6 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-gray-100 focus:ring-4 focus:ring-primary/5 transition-all`;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-6xl max-h-[92vh] flex flex-col relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-5">
            <div className={`p-4 bg-white rounded-[24px] shadow-sm ${medicine ? 'text-blue-500' : 'text-primary'} animate-float`}>
                {medicine ? <Edit2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">{medicine ? 'Update Medicine' : 'Add New Medicine'}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{medicine ? 'Modify existing medicine data' : 'Register a new pharmaceutical product'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-3xl shadow-sm transition-all hover:rotate-90"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Column 1: Basic Protocol */}
            <div className="space-y-10">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <Tag className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Asset Metrics</h3>
               </div>
               <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Nomenclature *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="Clinical Name" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Generic Structure</label>
                       <input type="text" value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} className={inputCls} placeholder="Active Compound" />
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Clinical Form *</label>
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>
                          {['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Visual ID (URL)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className={inputCls} placeholder="Cloud imagery link" />
                        </div>
                   </div>
               </div>
            </div>

            {/* Column 2: Logistics & Value */}
            <div className="space-y-10">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <Truck className="w-5 h-5 text-blue-500" />
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Manufacturer Lab</label>
                        <input type="text" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} className={inputCls} placeholder="Pharmacological Producer" />
                   </div>
                   <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Supply Node</label>
                        <select value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className={inputCls}>
                          <option value="">Decentralized Sourcing</option>
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
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Initial Units *</label>
                               <input required type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className={inputCls} placeholder="Units" />
                           </div>
                        ) : (
                           <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Restock Burst</label>
                               <input type="number" min="0" value={formData.restockQuantity} onChange={e => setFormData({...formData, restockQuantity: e.target.value})} className={`${inputCls} bg-amber-50 focus:bg-white`} placeholder="+ Delta" />
                           </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Critical Level</label>
                            <input type="number" value={formData.minStockThreshold} onChange={e => setFormData({...formData, minStockThreshold: e.target.value})} className={inputCls} placeholder="Threshold" />
                        </div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Master Batch ID</label>
                       <input type="text" value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} className={inputCls} placeholder="Batch Serial" />
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Log Expiry</label>
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
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Clinical Narratives</h3>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Asset Description</label>
                    <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputCls} resize-none`} placeholder="Describe pharmacological efficacy..."></textarea>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Physician Protocols</label>
                    <textarea rows="4" value={formData.usageInstructions} onChange={e => setFormData({...formData, usageInstructions: e.target.value})} className={`${inputCls} resize-none`} placeholder="Usage and contraindications..."></textarea>
                 </div>
               </div>
            </div>
          </div>
        </form>

        <div className="p-10 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-6 bg-gray-50/50">
            <button type="button" onClick={onClose} className="px-10 py-5 bg-white border border-gray-100 rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                Abort Protocol
            </button>
            <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={mutation.isLoading} 
                className={`px-16 py-5 rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl ${
                    medicine 
                        ? 'bg-blue-600 text-white shadow-blue-500/20' 
                        : 'bg-primary text-white shadow-primary/20'
                }`}
            >
                {mutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{medicine ? 'Update Log' : 'Initialize Asset'} <CheckCircle2 className="w-4 h-4" /></>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;
