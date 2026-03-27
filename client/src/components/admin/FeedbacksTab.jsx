import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, XCircle, Trash2, MessageSquare, Search, 
  Star, User, Calendar, Trash, Check, X, 
  ArrowRight, Filter, MoreVertical, ShieldCheck, 
  UserCircle, Loader2, Sparkles, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const FeedbacksTab = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['adminFeedbacks'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/feedbacks');
      return res.data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, approved }) => apiClient.put(`/admin/feedbacks/${id}`, { approved }),
    onSuccess: (_, variables) => {
      toast.success(variables.approved ? 'Feedback successfully approved' : 'Feedback successfully hidden', { icon: variables.approved ? '✅' : '🚫' });
      queryClient.invalidateQueries(['adminFeedbacks']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/feedbacks/${id}`),
    onSuccess: () => {
      toast.success('Feedback record deleted');
      queryClient.invalidateQueries(['adminFeedbacks']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete operation failed')
  });

  const filteredFeedbacks = feedbacks?.filter(fb => 
    fb.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (fb.userEmail && fb.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (fb.medicine?.name && fb.medicine.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (fb.message && fb.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER & SEARCH ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Patient Feedback
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5">User Testimonials • Quality Control</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-96">
            <div className="relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, User, or Content..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                />
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-[20px] shadow-sm text-gray-300 hover:text-primary transition-all">
                <Filter className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* ── FEEDBACK LOGS ── */}
      <div className="space-y-6">
        {isLoading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-white rounded-[40px] border border-gray-100 animate-pulse" />
            ))
        ) : filteredFeedbacks?.length === 0 ? (
            <div className="p-24 text-center bg-white rounded-[48px] border border-gray-100 shadow-premium space-y-4">
                <MessageSquare className="w-16 h-16 text-gray-100 mx-auto" />
                <div className="text-xl font-black text-gray-900 italic uppercase">No Feedback Found</div>
                <p className="text-gray-400 font-semibold italic text-sm">No patient feedback records match your current search parameters.</p>
            </div>
        ) : (
            filteredFeedbacks.map((fb, idx) => (
                <div key={fb._id} className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><MessageSquare className="w-48 h-48" /></div>
                    
                    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-10">
                        
                        {/* User Metadata */}
                        <div className="flex items-center gap-6 shrink-0 w-full xl:w-72">
                            <div className="w-16 h-16 bg-gray-900 rounded-[24px] flex items-center justify-center text-white relative shadow-xl shadow-gray-200 group-hover:rotate-6 transition-transform">
                                <UserCircle className="w-8 h-8" />
                                {fb.approved && <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white stroke-[4]" /></div>}
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg font-black text-gray-900 italic uppercase truncate leading-none">{fb.userName}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 truncate">{fb.userEmail}</div>
                                <div className="text-[9px] font-black text-primary uppercase tracking-tighter mt-1 italic flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(fb.dateSubmitted).toLocaleDateString()}</div>
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div className="flex-1 space-y-4 min-w-0 pr-10 border-l border-gray-50 pl-10 hidden xl:block">
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">Medicine Name</div>
                                <div className="text-sm font-black text-gray-900 italic uppercase">{fb.medicine?.name || 'General Feedback'}</div>
                            </div>
                            <p className="text-gray-600 font-semibold italic text-sm leading-relaxed line-clamp-2" title={fb.message || 'No narrative log.'}>
                                "{fb.message || 'No narrative log recorded for this transaction.'}"
                            </p>
                        </div>

                        {/* Mobile and Tablet Narrative (Hidden on XL) */}
                        <div className="xl:hidden space-y-4 w-full">
                            <div className="flex items-center gap-3">
                                < ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black text-gray-900 italic uppercase">{fb.medicine?.name || 'General Feedback'}</span>
                            </div>
                            <p className="text-gray-600 font-semibold italic text-sm leading-relaxed">
                                "{fb.message || 'No review message recorded.'}"
                            </p>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-6 xl:w-48 shrink-0 w-full xl:border-l xl:border-gray-50 xl:pl-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-yellow-600 tracking-tighter italic">{fb.rating}</span>
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {!fb.approved ? (
                                    <button
                                        onClick={() => statusMutation.mutate({ id: fb._id, approved: true })}
                                        className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200 hover:shadow-emerald-500/20 active:scale-90"
                                        title="Grant Approval"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => statusMutation.mutate({ id: fb._id, approved: false })}
                                        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-amber-500 rounded-2xl hover:bg-amber-50 transition-all shadow-sm active:scale-90"
                                        title="Hide Review"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => window.confirm('Delete this feedback forever?') && deleteMutation.mutate(fb._id)}
                                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-rose-500 rounded-2xl hover:bg-rose-50 transition-all shadow-sm active:scale-90"
                                    title="Delete Review"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Progress (Decorative) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50 overflow-hidden">
                        <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700 delay-100" />
                    </div>
                </div>
            ))
        )}
      </div>

      {/* ── METRIC FOOTER ── */}
      <div className="pt-20 flex items-center justify-center gap-12 grayscale opacity-10">
          <Activity className="w-10 h-10" />
          <Sparkles className="w-10 h-10" />
          <ShieldCheck className="w-10 h-10" />
      </div>
    </div>
  );
};

export default FeedbacksTab;
