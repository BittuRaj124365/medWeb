import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Flag, X, ChevronDown, AlertTriangle, Loader2, 
  User, Mail, Calendar, Info, CheckCircle2, 
  ShieldAlert, Activity, ArrowRight, Trash2, 
  ChevronRight, Filter, Search, Sparkles, Globe,
  ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const STATUS_STYLES = {
  pending:  { 
    badge: 'bg-amber-50 text-amber-600 border-amber-100',  
    label: 'Pending Review',
    icon: <AlertCircle className="w-3 h-3" />
  },
  reviewed: { 
    badge: 'bg-blue-50 text-blue-600 border-blue-100',        
    label: 'In Progress',
    icon: <Activity className="w-3 h-3" />
  },
  resolved: { 
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',     
    label: 'Resolved',
    icon: <ShieldCheck className="w-3 h-3" />
  }
};

const ReportsTab = () => {
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['adminProductReports'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/product-reports');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => apiClient.put(`/admin/product-reports/${id}`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Status updated to: ${status.toUpperCase()}`, { icon: '🔄' });
      queryClient.invalidateQueries(['adminProductReports']);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
      if (selectedReport) setSelectedReport(prev => ({ ...prev, status }));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/product-reports/${id}`),
    onSuccess: () => {
      toast.success('Report deleted successfully');
      queryClient.invalidateQueries(['adminProductReports']);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
      setSelectedReport(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed')
  });

  const filtered = filterStatus ? reports.filter(r => r.status === filterStatus) : reports;
  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              Discrepancy Logs
           </h2>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5">
             Clinical Accuracy Reports • {pendingCount} Critical Pending
           </p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group w-full lg:w-64">
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="w-full appearance-none pl-6 pr-12 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer transition-all"
                >
                    <option value="">Filter by Status</option>
                    <option value="pending">Pending Review</option>
                    <option value="reviewed">In Progress</option>
                    <option value="resolved">Resolved Cases</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-[20px] shadow-sm text-gray-300 hover:text-primary transition-all">
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* ── REPORTS GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {isLoading ? (
            [...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-white rounded-[40px] border border-gray-100 animate-pulse" />
            ))
        ) : filtered.length === 0 ? (
            <div className="col-span-1 xl:col-span-2 p-24 text-center bg-white rounded-[48px] border border-gray-100 shadow-premium space-y-4">
                <ShieldCheck className="w-16 h-16 text-emerald-100 mx-auto" />
                <div className="text-xl font-black text-gray-900 italic uppercase">All Clear</div>
                <p className="text-gray-400 font-semibold italic text-sm">No medicine-related issues detected currently.</p>
            </div>
        ) : (
            filtered.map((report, idx) => {
                const style = STATUS_STYLES[report.status] || STATUS_STYLES.pending;
                return (
                    <div 
                        key={report._id} 
                        onClick={() => setSelectedReport(report)}
                        className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><Flag className="w-48 h-48" /></div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-50 pb-8 mb-8">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center relative shadow-xl shadow-gray-100 transition-all duration-500 ${report.status === 'pending' ? 'bg-rose-50 text-rose-500' : 'bg-gray-900 text-white'}`}>
                                    <ShieldAlert className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-lg font-black text-gray-900 italic uppercase tracking-tighter">{report.medicine?.name || 'General Report'}</div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 italic">{report.medicine?.category || 'Uncategorized'}</div>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${style.badge}`}>
                                {style.icon} {style.label}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 bg-gray-50/50 rounded-[24px] border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-all duration-500">
                                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Observation Log</div>
                                    <p className="text-sm font-bold text-gray-700 italic line-clamp-2 leading-relaxed">"{report.reason}"</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-black text-gray-900 uppercase truncate italic">{report.reporterName || 'Anonymous Submitter'}</div>
                                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-wider truncate">Reporter Name</div>
                                    </div>
                                </div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <Calendar className="w-3 h-3" /> Logged {formatDate(report.dateReported)}
                                </div>
                            </div>
                        </div>

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-end gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                                className="px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl shadow-gray-200"
                             >
                                View Details <ChevronRight className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={(id, status) => updateMutation.mutate({ id, status })}
          onDelete={(id) => { if (window.confirm('Purge discrepancy archive?')) deleteMutation.mutate(id); }}
          isUpdating={updateMutation.isLoading}
          isDeleting={deleteMutation.isLoading}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

const ReportDetailModal = ({ report, onClose, onUpdate, onDelete, isUpdating, isDeleting, formatDate }) => {
  const style = STATUS_STYLES[report.status] || STATUS_STYLES.pending;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-5">
            <div className={`p-4 bg-white rounded-[24px] shadow-sm ${report.status === 'pending' ? 'text-rose-500' : 'text-primary'} animate-float`}>
                <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Report Audit</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submitted on: {formatDate(report.dateReported)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-3xl shadow-sm transition-all hover:rotate-90"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-12 space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-50 group transition-all duration-500 hover:bg-white hover:border-gray-100 shadow-sm hover:shadow-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Medicine Details</p>
              <p className="text-2xl font-black text-gray-900 italic uppercase leading-none tracking-tighter">{report.medicine?.name || 'General Product'}</p>
              {report.medicine?.category && <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-3 opacity-60 italic">{report.medicine.category}</p>}
            </div>
            <div className={`p-8 rounded-[40px] border flex flex-col justify-center transition-all duration-500 shadow-sm hover:shadow-xl ${style.badge} bg-opacity-30`}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4 italic opacity-50">Review Status</p>
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-white rounded-2xl shadow-sm">{style.icon}</div>
                 <span className="text-xl font-black italic uppercase tracking-tighter leading-none">{style.label}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 p-10 rounded-[44px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-orange-500/5 -z-10 group-hover:rotate-12 transition-transform duration-700"><AlertTriangle className="w-32 h-32" /></div>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-3 italic">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" /> Issue Observation
            </p>
            <p className="text-xl font-black text-gray-900 italic uppercase tracking-tighter leading-relaxed">"{report.reason}"</p>
          </div>

          {report.additionalDetails && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4 italic">Additional Details</p>
              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 text-sm font-bold text-gray-600 italic leading-relaxed">
                {report.additionalDetails}
              </div>
            </div>
          )}

          <div className="pt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4 mb-4 italic">Reporter Profile</p>
            <div className="bg-gray-900 p-8 rounded-[44px] shadow-2xl flex items-center justify-between text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white/5 -z-10 group-hover:scale-110 transition-transform duration-700"><User className="w-24 h-24" /></div>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-primary border border-white/5"><Mail className="w-6 h-6" /></div>
                    <div>
                        <div className="text-sm font-black italic uppercase tracking-widest text-white">{report.reporterName || 'Anonymous Submitter'}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 italic">{report.reporterEmail || 'No email provided'}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button 
            onClick={() => onDelete(report._id)} 
            disabled={isDeleting} 
            className="px-10 py-5 bg-white border border-rose-100 text-[10px] font-black text-rose-500 uppercase tracking-widest rounded-[28px] hover:bg-rose-50 active:scale-95 transition-all shadow-sm flex items-center gap-3"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Delete Report</>}
          </button>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {report.status !== 'reviewed' && (
              <button 
                onClick={() => onUpdate(report._id, 'reviewed')} 
                disabled={isUpdating} 
                className="flex-1 sm:flex-none px-10 py-5 bg-white border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-[28px] hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
              >
                Start Review
              </button>
            )}
            {report.status !== 'resolved' && (
              <button 
                onClick={() => onUpdate(report._id, 'resolved')} 
                disabled={isUpdating} 
                className="flex-1 sm:flex-none px-16 py-5 bg-gray-900 text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-gray-200"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <>Resolve Issue <CheckCircle2 className="w-4 h-4 text-primary" /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
