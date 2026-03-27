import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, Search, Clock, User, ShieldCheck, 
  Plus, Edit2, Trash2, ChevronRight, Filter,
  ArrowRight, ShieldAlert, Sparkles, Globe, 
  History, Database, Loader2, IndianRupee, Pill
} from 'lucide-react';
import apiClient from '../../api/apiClient';

const ACTION_CONFIG = {
  ADD: { 
    icon: <Plus className="w-4 h-4" />, 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-600', 
    border: 'border-emerald-100',
    label: 'Medicine Added'
  },
  EDIT: { 
    icon: <Edit2 className="w-4 h-4" />, 
    bg: 'bg-blue-50', 
    text: 'text-blue-600', 
    border: 'border-blue-100',
    label: 'Medicine Updated'
  },
  DELETE: { 
    icon: <Trash2 className="w-4 h-4" />, 
    bg: 'bg-rose-50', 
    text: 'text-rose-600', 
    border: 'border-rose-100',
    label: 'Medicine Deleted'
  },
  DEFAULT: { 
    icon: <Activity className="w-4 h-4" />, 
    bg: 'bg-gray-50', 
    text: 'text-gray-600', 
    border: 'border-gray-100',
    label: 'Admin Action'
  }
};

const LogsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/logs');
      return res.data;
    }
  });

  const filteredLogs = logs?.filter(log => 
    log.adminUsername.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Neural Activity Log
           </h2>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5">
             Administrative Operations • Veracity Audit Trail
           </p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-96">
            <div className="relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, Admin, or Medicine..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[24px] shadow-sm text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all italic"
                />
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-[20px] shadow-sm text-gray-300 hover:text-primary transition-all">
                <Filter className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* ── ACTIVITY TIMELINE ── */}
      <div className="bg-white rounded-[48px] border border-gray-100 shadow-premium p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-primary opacity-5 -z-10 group-hover:scale-125 transition-transform duration-1000 rotate-12"><History className="w-64 h-64" /></div>
        
        {isLoading ? (
            <div className="p-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Synchronizing activity records...</p>
            </div>
        ) : filteredLogs?.length === 0 ? (
            <div className="p-20 text-center space-y-6">
                <Database className="w-16 h-16 text-gray-100 mx-auto" />
                <div className="text-xl font-black text-gray-900 italic uppercase">No Activity Found</div>
                <p className="text-gray-400 font-semibold italic text-sm">No administrative activities have been recorded for this period.</p>
            </div>
        ) : (
            <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 sm:left-12 top-0 bottom-0 w-px bg-gray-50 z-0" />

                {filteredLogs.map((log, idx) => {
                    const config = ACTION_CONFIG[log.actionType] || ACTION_CONFIG.DEFAULT;
                    return (
                        <div key={log._id} className="group relative flex gap-8 items-start animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 40}ms` }}>
                            
                            {/* Action Node */}
                            <div className={`w-12 h-12 flex items-center justify-center rounded-[18px] border-4 border-white shadow-xl shrink-0 z-10 transition-transform group-hover:scale-110 duration-300 ${config.bg} ${config.text} ${config.border}`}>
                                {config.icon}
                            </div>

                            {/* Log Content Card */}
                            <div className="flex-1 bg-gray-50/50 group-hover:bg-white border border-transparent group-hover:border-gray-100 p-6 lg:p-8 rounded-[32px] transition-all duration-500 hover:shadow-2xl">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                                                {config.label}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-base font-medium text-gray-900">
                                            <span className="text-gray-400 font-black italic uppercase text-xs">Admin</span>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div className="w-5 h-5 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[9px] font-bold italic">{log.adminUsername.charAt(0)}</div>
                                                <span className="font-black italic uppercase text-xs text-primary">{log.adminUsername}</span>
                                            </div>
                                            <span className="text-gray-400 font-black italic uppercase text-xs italic mx-1">updated</span>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div className="w-5 h-5 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><Pill className="w-3 h-3" /></div>
                                                <span className="font-black italic uppercase text-xs text-gray-900">{log.medicineName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm sm:w-auto w-full">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic mb-0.5">Time Stamp</div>
                                        <div className="text-xs font-black text-gray-900 italic tracking-tighter">
                                            {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* ── METRIC FOOTER ── */}
      <div className="pt-10 flex items-center justify-center gap-12 grayscale opacity-10">
          <Globe className="w-10 h-10" />
          <Activity className="w-10 h-10" />
          <ShieldCheck className="w-10 h-10" />
      </div>
    </div>
  );
};

export default LogsTab;
