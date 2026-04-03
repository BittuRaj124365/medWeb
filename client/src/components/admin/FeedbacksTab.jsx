import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, XCircle, Trash2, MessageSquare, Search, 
  Star, User, Calendar, Trash, Check, X, 
  ArrowRight, Filter, MoreVertical, ShieldCheck, 
  UserCircle, Loader2, Sparkles, Activity, Mail
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
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
        <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Patient Feedback
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5 italic">Quality Assurance & Clinical Reviews</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-[480px]">
            <div className="relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, User, or Content..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all"
                />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm text-gray-300 hover:text-teal-600 transition-all active:scale-95">
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
                <div className="text-xl font-black text-gray-900 italic uppercase">No Reviews Found</div>
                <p className="text-gray-400 font-semibold italic text-sm">No customer reviews match your current search.</p>
            </div>
        ) : (
            filteredFeedbacks.map((fb, idx) => (
                <div key={fb._id} className="bg-white rounded-[44px] border border-gray-100 shadow-premium p-10 lg:p-12 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 70}ms` }}>
                    <div className="absolute top-0 right-0 p-12 text-teal-500/5 -z-10 group-hover:scale-150 transition-transform duration-1000 rotate-12"><MessageSquare className="w-64 h-64" /></div>
                    
                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-12">
                        
                        {/* User Metadata */}
                        <div className="flex items-center gap-6 shrink-0 w-full xl:w-80 border-b xl:border-b-0 xl:border-r border-gray-50 pb-8 xl:pb-0 xl:pr-10">
                            <div className="w-20 h-20 bg-gray-900 rounded-[32px] flex items-center justify-center text-white relative shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                <UserCircle className="w-10 h-10" />
                                {fb.approved && <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg"><Check className="w-3.5 h-3.5 text-white stroke-[4]" /></div>}
                                {!fb.approved && <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg animate-pulse"><X className="w-3.5 h-3.5 text-white stroke-[4]" /></div>}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xl font-black text-gray-900 italic uppercase truncate leading-none tracking-tighter">{fb.userName}</div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 truncate flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> {fb.userEmail}
                                </div>
                                <div className="text-[9px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full w-fit uppercase tracking-tighter mt-3 italic flex items-center gap-1.5 border border-teal-100">
                                    <Calendar className="w-3.5 h-3.5" /> Logged {new Date(fb.dateSubmitted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div className="flex-1 space-y-6 min-w-0 pr-10">
                            <div className="flex items-center gap-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                                    <Activity className="w-3 h-3 text-teal-400" /> Clinical Asset
                                </div>
                                <div className="text-lg font-black text-gray-900 italic uppercase tracking-tighter">{fb.medicine?.name || 'General Platform Feedback'}</div>
                            </div>
                            <div className="relative p-6 bg-gray-50/50 rounded-[32px] border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-all duration-500">
                                <Sparkles className="absolute top-4 right-4 w-4 h-4 text-teal-500/20" />
                                <p className="text-gray-600 font-semibold italic text-base leading-relaxed line-clamp-3" title={fb.message || 'No review message recorded.'}>
                                    "{fb.message || 'The user participated in the clinical feedback protocol but did not leave a qualitative message.'}"
                                </p>
                            </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center gap-8 xl:w-56 shrink-0 w-full xl:border-l xl:border-gray-50 xl:pl-12">
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <span className="text-5xl font-black tracking-tighter italic tabular-nums leading-none">{fb.rating}</span>
                                    <Star className="w-6 h-6 fill-amber-500 group-hover:scale-125 transition-transform" />
                                </div>
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic pr-1">Patient Rating</div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {!fb.approved ? (
                                    <button
                                        onClick={() => statusMutation.mutate({ id: fb._id, approved: true })}
                                        className="w-14 h-14 flex items-center justify-center bg-teal-600 text-white rounded-[22px] hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:scale-110 active:scale-95"
                                        title="Verify & Approve"
                                    >
                                        <Check className="w-6 h-6 stroke-[3]" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => statusMutation.mutate({ id: fb._id, approved: false })}
                                        className="w-14 h-14 flex items-center justify-center bg-white border border-amber-100 text-amber-500 rounded-[22px] hover:bg-amber-50 transition-all shadow-sm active:scale-95"
                                        title="Unpublish Review"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                )}
                                <button
                                    onClick={() => window.confirm('Permanently redact this record?') && deleteMutation.mutate(fb._id)}
                                    className="w-14 h-14 flex items-center justify-center bg-white border border-rose-100 text-rose-500 rounded-[22px] hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                    title="Delete Record"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Progress (Decorative) */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-50 overflow-hidden">
                        <div className="h-full bg-teal-500 w-0 group-hover:w-full transition-all duration-1000 delay-100" />
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
