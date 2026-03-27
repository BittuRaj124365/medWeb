import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, Edit2, Trash2, Search, Phone, Mail, 
  MapPin, Globe, ShieldCheck, Truck, MoreVertical, 
  ChevronRight, ExternalLink, User, CheckCircle2, 
  Activity, Sparkles, Loader2, X, Send
} from 'lucide-react';
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
      toast.success('Supplier link removed', { icon: '🗑️' });
      queryClient.invalidateQueries(['adminSuppliers']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Removal operation failed');
    }
  });

  const filteredSuppliers = suppliers?.filter(sup => 
    sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (sup.email && sup.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (sup.contactNumber && sup.contactNumber.includes(searchTerm))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* ── TOOLBAR ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Logistics Chain
           </h2>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5">Verified Pharmaceutical Suppliers</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-72">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, Name, or Contact..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-[20px] shadow-sm text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                />
            </div>
            <button
                onClick={() => { setEditingSupplier(null); setIsAdding(true); }}
                className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-[20px] hover:bg-black transition-all text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap"
            >
                <Plus className="w-5 h-5 text-primary" /> Add Supplier
            </button>
        </div>
      </div>

      {/* ── SUPPLIER DIRECTORY ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {isLoading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-[40px] border border-gray-100 animate-pulse" />
             ))
        ) : filteredSuppliers?.length === 0 ? (
            <div className="col-span-1 xl:col-span-2 p-24 text-center bg-white rounded-[48px] border border-gray-100 shadow-premium space-y-4">
                <Truck className="w-16 h-16 text-gray-100 mx-auto" />
                <div className="text-xl font-black text-gray-900 italic uppercase">No Suppliers Found</div>
                <p className="text-gray-400 font-semibold italic text-sm">Add a new partner supplier to begin medicine procurement.</p>
            </div>
        ) : (
            filteredSuppliers.map((sup, idx) => (
                <div key={sup._id} className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Truck className="w-48 h-48" /></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-50 pb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gray-900 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-gray-200 relative group-hover:rotate-6 transition-transform">
                                <span className="text-2xl font-black italic">{sup.name.charAt(0)}</span>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tighter">{sup.name}</h3>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Partner Supplier</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => setEditingSupplier(sup)} className="p-3 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-2xl transition-all">
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => window.confirm('Remove supplier from database?') && deleteMutation.mutate(sup._id)} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-2xl transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-primary/10 transition-colors"><Phone className="w-4 h-4 text-gray-400 group-hover/item:text-primary" /></div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Phone Number</div>
                                    <div className="text-xs font-bold text-gray-700">{sup.contactNumber || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-primary/10 transition-colors"><Mail className="w-4 h-4 text-gray-400 group-hover/item:text-primary" /></div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Email Address</div>
                                    <div className="text-xs font-bold text-gray-700 hover:text-primary cursor-pointer transition-colors">{sup.email || 'Not provided'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-primary/10 transition-colors"><MapPin className="w-4 h-4 text-gray-400 group-hover/item:text-primary" /></div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Business Address</div>
                                    <div className="text-xs font-bold text-gray-700 leading-relaxed max-w-[180px]">{sup.address || 'Global Headquarter'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">SLA Compliant</span>
                        </div>
                        <button className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest flex items-center gap-2 group/btn italic">
                            Transaction History <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* ── METRIC FOOTER ── */}
      <div className="pt-10 border-t border-gray-100 flex items-center justify-center gap-10 grayscale opacity-10">
          <Activity className="w-10 h-10" />
          <Globe className="w-10 h-10" />
          <Sparkles className="w-10 h-10" />
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
      toast.success(supplier ? 'Supplier record updated' : 'New partner registered', { icon: '🤝' });
      queryClient.invalidateQueries(['adminSuppliers']);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Supplier registration failed')
  });

  const inputCls = `w-full pl-6 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-gray-100 focus:ring-4 focus:ring-primary/5 transition-all`;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-xl flex flex-col relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0 rounded-t-[60px]">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white rounded-[24px] shadow-sm text-primary animate-float">
                <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">{supplier ? 'Edit Partner' : 'Register Partner'}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Supplier Collaboration Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-3xl shadow-sm transition-all hover:rotate-90"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); mutation.mutate(formData); }} className="p-12 space-y-8">
          <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Company Name *</label>
                <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="e.g. Acme Pharma Logistics" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Contact Number</label>
                    <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className={inputCls} placeholder="+91 XXXXX XXXXX" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Corporate Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputCls} placeholder="partner@company.com" />
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Business Address</label>
                <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputCls} placeholder="Full Registered Address" />
                </div>
              </div>
          </div>

          <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-end gap-6">
            <button type="button" onClick={onClose} className="px-10 py-5 bg-white border border-gray-100 rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={mutation.isLoading} 
                className="px-16 py-5 bg-gray-900 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-gray-200"
            >
                {mutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{supplier ? 'Save Changes' : 'Add Partner'} <Send className="w-4 h-4 text-primary" /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuppliersTab;
