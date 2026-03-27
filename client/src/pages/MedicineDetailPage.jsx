import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Tag, Calendar, Package, Info, CheckCircle2, XCircle, 
  AlertCircle, ShoppingCart, Star, MessageSquare, Flag, X, 
  ChevronDown, Share2, ShieldCheck, Truck, RotateCcw, 
  History, Stethoscope, ChevronRight, Send, User, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useCart } from '../context/CartContext';

const REPORT_REASONS = [
  'Incorrect Information',
  'Medicine Not Available',
  'Wrong Price',
  'Expired Medicine Listed',
  'Other'
];

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, message: '', userName: '', userEmail: '' });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', additionalDetails: '', reporterName: '', reporterEmail: '' });
  const [reportErrors, setReportErrors] = useState({});
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'details', 'usage', 'reviews'

  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ['medicine', id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}`);
      return res.data;
    },
    onError: () => {
      toast.error('Connection to clinical database failed. Retrying...');
    }
  });

  const { data: feedbacks, isLoading: loadingFeedbacks } = useQuery({
    queryKey: ['feedbacks', id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}/feedbacks`);
      return res.data;
    },
    enabled: !!id
  });

  const feedbackMutation = useMutation({
    mutationFn: (data) => apiClient.post(`/medicines/${id}/feedbacks`, data),
    onSuccess: () => {
      toast.success('Clinical review submitted for verification!', { icon: '📝' });
      setFeedbackForm({ rating: 5, message: '', userName: '', userEmail: '' });
      queryClient.invalidateQueries(['feedbacks', id]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Verification system error')
  });

  const reportMutation = useMutation({
    mutationFn: (data) => apiClient.post(`/medicines/${id}/report`, data),
    onSuccess: () => {
      toast.success('Discrepancy report logged for review.');
      setShowReportModal(false);
      setReportForm({ reason: '', additionalDetails: '', reporterName: '', reporterEmail: '' });
      setReportErrors({});
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Report logging failed')
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.userName || !feedbackForm.rating) return toast.error('Identity and Rating required');
    feedbackMutation.mutate(feedbackForm);
  };

  const validateReport = () => {
    const errors = {};
    if (!reportForm.reason) errors.reason = 'Clinical necessity: select a reason';
    if (reportForm.reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reportForm.reporterEmail)) {
      errors.reporterEmail = 'Invalid communication channel';
    }
    setReportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!validateReport()) return;
    reportMutation.mutate(reportForm);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 h-[600px] bg-gray-100 rounded-[60px]"></div>
          <div className="w-full lg:w-1/2 space-y-10 py-6">
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            <div className="h-16 bg-gray-100 rounded w-3/4"></div>
            <div className="h-8 bg-gray-100 rounded w-full"></div>
            <div className="h-32 bg-gray-100 rounded w-full"></div>
            <div className="h-20 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8 animate-in zoom-in duration-500">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl" />
            <div className="relative p-12 bg-red-50 rounded-[40px] border border-red-100">
                <AlertCircle className="w-20 h-20 text-red-500" />
            </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Clinical Log Not Found</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">The requested pharmaceutical ID is either invalid or has been archived from our live inventory.</p>
        </div>
        <button onClick={() => navigate('/medicines')} className="btn-premium px-10 py-4 inline-flex items-center gap-3">
          <ArrowLeft className="w-4 h-4" /> Return to Directory
        </button>
      </div>
    );
  }

  const isOutOfStock = medicine.stockQuantity === 0;
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < (medicine.minStockThreshold || 10);
  const formatDate = (d) => !d ? 'N/A' : new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatPrice = (p) => `₹${Number(p).toFixed(2)}`;

  return (
    <div className="bg-white min-h-screen">
      {/* ── BREADCRUMBS & TOP NAV ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 flex items-center justify-between">
         <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/medicines" className="hover:text-primary transition-colors">Pharmacy</Link>
            <ChevronRight className="w-3 h-3 text-gray-200" />
            <span className="text-gray-900 border-b border-gray-900 pb-0.5">{medicine.name}</span>
         </nav>
         
         <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all" title="Share Experience">
                <Share2 className="w-4 h-4 text-gray-400" />
            </button>
            <button 
                onClick={() => setShowReportModal(true)}
                className="p-3 bg-gray-50 hover:bg-red-50 group rounded-2xl transition-all" title="Log Discrepancy"
            >
                <Flag className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
         </div>
      </div>

      {/* ── MAIN PRODUCT STUCTURE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* ── LEFT: IMAGE AREA ── */}
            <div className="w-full lg:w-1/2 relative animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="sticky top-32">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[60px] blur-[80px] -z-10 animate-pulse" />
                        <div className="relative bg-gray-50 border border-gray-50 rounded-[64px] overflow-hidden aspect-[4/5] flex items-center justify-center p-12 lg:p-20 shadow-premium transition-transform duration-700 group-hover:scale-[1.01]">
                            <img
                              src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop'}
                              alt={medicine.name}
                              className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-1000"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop'; }}
                            />
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-10 left-10 flex flex-col gap-3">
                                <div className="glass px-5 py-2 rounded-full text-[10px] font-black uppercase text-primary tracking-widest border-white/20 whitespace-nowrap">
                                    Official Inventory
                                </div>
                                {isOutOfStock ? (
                                    <div className="bg-red-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 whitespace-nowrap">
                                        Temporarily Unavailable
                                    </div>
                                ) : isLowStock && (
                                    <div className="bg-amber-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 whitespace-nowrap">
                                        Limited: {medicine.stockQuantity} Remaining
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Health Trust Cards */}
                    <div className="grid grid-cols-3 gap-6 mt-12 px-2">
                        {[
                            { icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, label: 'Verified Sourcing' },
                            { icon: <Truck className="w-5 h-5 text-blue-500" />, label: 'Logistics Ready' },
                            { icon: <RotateCcw className="w-5 h-5 text-purple-500" />, label: '7-Day Return' }
                        ].map((box, i) => (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-2xl">{box.icon}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{box.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: INFO AREA ── */}
            <div className="w-full lg:w-1/2 space-y-12 py-4 animate-in fade-in slide-in-from-right-12 duration-1000">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                            {medicine.category}
                        </div>
                        <div className="flex items-center text-amber-500 gap-1 pl-2">
                            <Star className="w-4 h-4 fill-amber-500" />
                            <span className="text-xs font-black text-gray-900 pt-0.5 tracking-tighter">4.9/5</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pt-0.5 ml-1">Choice</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                            {medicine.name}
                        </h1>
                        <p className="text-2xl text-gray-400 font-black tracking-tight">{medicine.genericName}</p>
                    </div>

                    <div className="flex items-center gap-8 pt-4">
                        <div className="shrink-0">
                            <div className="text-6xl font-black text-gray-900 tracking-tighter italic">
                                {formatPrice(medicine.price)}
                            </div>
                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-1 pl-1">
                                Market Verified Rate
                            </div>
                        </div>
                        
                        <div className="h-16 w-px bg-gray-100 hidden sm:block" />

                        <div className="hidden sm:block">
                            <div className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <Package className="w-4 h-4" /> 
                                {isOutOfStock ? 'Sold Out' : `In Stock: ${medicine.stockQuantity}`}
                            </div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                Available in Warehouse
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Controls */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={isOutOfStock}
                      className={`flex-1 group relative overflow-hidden h-20 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${
                        isOutOfStock 
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                            : 'bg-gray-900 text-white hover:bg-primary shadow-2xl shadow-gray-400/20 active:scale-95'
                      }`}
                    >
                      <ShoppingCart className={`w-5 h-5 ${isOutOfStock ? 'opacity-20' : 'animate-bounce-slow'}`} />
                      {isOutOfStock ? 'Inventory Exhausted' : 'Confirm & Add to Bag'}
                    </button>
                    
                    <button className="h-20 px-10 border-2 border-gray-100 rounded-[32px] text-gray-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>

                <div className="pt-8 grid grid-cols-2 gap-8 border-t border-gray-50">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><History className="w-5 h-5" /></div>
                        <div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Batch Sourcing</div>
                            <div className="text-xs font-black text-gray-900">{medicine.manufacturer || 'Verified Producer'}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400"><Calendar className="w-5 h-5" /></div>
                        <div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Log Expiry</div>
                            <div className="text-xs font-black text-gray-900">{formatDate(medicine.expiryDate)}</div>
                        </div>
                    </div>
                </div>

                {/* ── TABS SECTION ── */}
                <div className="pt-10">
                    <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', label: 'Clinical Overview' },
                            { id: 'details', label: 'Safety Details' },
                            { id: 'usage', label: 'Usage Logs' },
                            { id: 'reviews', label: `Veracity Logs (${feedbacks?.length || 0})` }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
                                    activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in slide-in-from-bottom-2" />}
                            </button>
                        ))}
                    </div>

                    <div className="animate-in fade-in duration-500">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    Mechanism of Action
                                </h3>
                                <p className="text-gray-500 font-semibold leading-relaxed text-lg">
                                    {medicine.description || 'Comprehensive clinical logging for this pharmaceutical compound is currently being verified by our laboratory experts.'}
                                </p>
                                <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:rotate-12 transition-transform">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Certification</div>
                                            <div className="text-sm font-black text-gray-900">Laboratory Verified Integrity</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Package className="w-3.5 h-3.5" /> Logical Specs
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-3 border-b border-gray-50 items-center">
                                                <span className="text-sm font-bold text-gray-500">Master Category</span>
                                                <span className="text-sm font-black text-gray-900">{medicine.category}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50 items-center">
                                                <span className="text-sm font-bold text-gray-500">Stock Availability</span>
                                                <span className="text-sm font-black text-gray-900">{medicine.stockQuantity} Units</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-50 items-center">
                                                <span className="text-sm font-bold text-gray-500">Verified Exp.</span>
                                                <span className="text-sm font-black text-gray-900">{formatDate(medicine.expiryDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <History className="w-3.5 h-3.5" /> Batch Sourcing
                                        </div>
                                        <div className="space-y-2">
                                            {medicine.batches?.length > 0 ? (
                                                medicine.batches.map((batch, idx) => (
                                                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                                                    <span className="font-black text-gray-400 italic">LOG: {batch.batchNumber}</span>
                                                    <span className="font-black text-gray-900">Units: {batch.quantity}</span>
                                                  </div>
                                                ))
                                            ) : (
                                                <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Batch Logs Syncing</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'usage' && (
                            <div className="space-y-8 bg-gray-50 p-10 rounded-[40px] border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-primary opacity-5">
                                    <Stethoscope className="w-32 h-32" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><Info className="w-6 h-6" /></div>
                                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">Physician Protocol</h3>
                                </div>
                                <p className="text-gray-500 font-semibold leading-relaxed text-lg italic">
                                   "{medicine.usageInstructions || 'Standardized clinical protocols apply. Consult with a board-certified physician before commencing therapy with this pharmaceutical agent.'}"
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-12">
                                {/* Writing Review Toggle */}
                                <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 space-y-8">
                                    <div className="text-center space-y-3">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic">Log Your Experience</h3>
                                        <p className="text-gray-400 font-medium text-sm">Contribute to the collective clinical intelligence of our community.</p>
                                    </div>

                                    <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                                        <div className="flex flex-col items-center gap-6 pb-6 border-b border-gray-50">
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button type="button" key={star} onClick={() => setFeedbackForm({...feedbackForm, rating: star})} className="p-2 transition-all hover:scale-125 focus:outline-none">
                                                    <Star className={`w-10 h-10 ${star <= feedbackForm.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-100'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Therapeutic Experience Rating</div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Your Identity</label>
                                                <div className="relative group">
                                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                                    <input required type="text" value={feedbackForm.userName} onChange={e => setFeedbackForm({...feedbackForm, userName: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" placeholder="Anonymous Patient" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Contact Logic (Optional)</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                                    <input type="email" value={feedbackForm.userEmail} onChange={e => setFeedbackForm({...feedbackForm, userEmail: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" placeholder="patient@clinical-sync.net" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Clinical Observations</label>
                                            <textarea value={feedbackForm.message} onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})} className="w-full p-8 bg-gray-50 border border-gray-100 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm resize-none" rows="4" placeholder="Describe the therapeutic efficacy or any logistical notes..."></textarea>
                                        </div>

                                        <button type="submit" disabled={feedbackMutation.isLoading} className="w-full h-20 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50">
                                            {feedbackMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log Verification <Send className="w-4 h-4" /></>}
                                        </button>
                                    </form>
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-10">
                                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-widest">Veracity Feed ({feedbacks?.length || 0})</h4>
                                    
                                    {loadingFeedbacks ? (
                                        <div className="space-y-6">
                                            {[1,2].map(i => <div key={i} className="h-40 bg-gray-50 rounded-[32px] animate-pulse" />)}
                                        </div>
                                    ) : feedbacks?.length === 0 ? (
                                        <div className="text-center p-20 bg-gray-50 rounded-[60px] border border-dashed border-gray-200">
                                            <div className="p-8 bg-white inline-block rounded-[40px] shadow-sm mb-6 text-gray-200"><MessageSquare className="w-16 h-16" /></div>
                                            <h5 className="text-2xl font-black text-gray-900 tracking-tight">Log History Clear</h5>
                                            <p className="text-gray-500 font-medium">Be the first to provide clinical feedback for this medication.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-8">
                                            {feedbacks?.map((fb, idx) => (
                                                <div key={fb._id} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-premium group animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                                                        <div className="flex items-center gap-5">
                                                            <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center font-black text-primary text-2xl border border-primary/10">
                                                                {fb.userName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h5 className="text-xl font-black text-gray-900 italic tracking-tight">{fb.userName}</h5>
                                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                                    <Calendar className="w-3.5 h-3.5" /> {formatDate(fb.dateSubmitted)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 p-3 px-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {fb.message && (
                                                        <p className="text-gray-600 font-semibold leading-relaxed text-lg italic border-l-4 border-primary/20 pl-8 bg-gray-50/50 p-8 rounded-r-[32px]">
                                                            "{fb.message}"
                                                        </p>
                                                    )}
                                                    <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-300">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Community Verified Purchase
                                                        </div>
                                                        <div className="group-hover:text-primary transition-colors cursor-pointer">Helpful (0)</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ── REPORT MODAL ── */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={() => setShowReportModal(false)}>
          <div className="relative bg-white rounded-[50px] shadow-[0_0_100px_rgba(0,0,0,0.2)] w-full max-w-xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-red-50 rounded-[24px] shadow-xl shadow-red-500/10">
                  <Flag className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Log Discrepancy</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{medicine.name}</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Critical Logic</label>
                <div className="relative group">
                  <select
                    value={reportForm.reason}
                    onChange={e => { setReportForm({...reportForm, reason: e.target.value}); setReportErrors({...reportErrors, reason: ''}); }}
                    className={`w-full appearance-none pl-6 pr-12 py-5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all font-bold text-sm ${reportErrors.reason ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-primary/5 focus:border-primary/20'}`}
                  >
                    <option value="">Select a discrepancy reason...</option>
                    {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                </div>
                {reportErrors.reason && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{reportErrors.reason}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Detailed Variance</label>
                <textarea
                  value={reportForm.additionalDetails}
                  onChange={e => setReportForm({...reportForm, additionalDetails: e.target.value})}
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[32px] outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm resize-none"
                  rows="4"
                  placeholder="Describe the discrepancy in clinical detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Your Name</label>
                    <input type="text" value={reportForm.reporterName} onChange={e => setReportForm({...reportForm, reporterName: e.target.value})} className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white transition-all font-bold text-sm" placeholder="Patient Observer" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Contact Sync</label>
                    <input type="email" value={reportForm.reporterEmail} onChange={e => { setReportForm({...reportForm, reporterEmail: e.target.value}); setReportErrors({...reportErrors, reporterEmail: ''}); }} className={`w-full px-6 py-5 bg-gray-50 border rounded-2xl outline-none focus:bg-white transition-all font-bold text-sm ${reportErrors.reporterEmail ? 'border-red-300' : 'border-gray-100'}`} placeholder="sync@emergency.net" />
                    {reportErrors.reporterEmail && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 px-2">{reportErrors.reporterEmail}</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-5 border-2 border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                  Discard Report
                </button>
                <button type="submit" disabled={reportMutation.isLoading} className="flex-1 py-5 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-600 shadow-xl shadow-red-500/20 disabled:opacity-50 transition-all active:scale-95">
                  {reportMutation.isLoading ? 'Processing...' : 'Submit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Heart icon toggle placeholder
const Heart = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
)

const Loader2 = ({ className }) => (
    <RefreshCw className={className + " animate-spin"} />
)

export default MedicineDetailPage;
