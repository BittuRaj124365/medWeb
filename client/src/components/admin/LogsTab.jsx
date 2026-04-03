import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, Search, Clock, User, ShieldCheck, 
  Plus, Edit2, Trash2, ChevronRight, Filter,
  ArrowRight, ShieldAlert, Sparkles, Globe, 
  History, Database, Loader2, IndianRupee, Pill, Calendar
} from 'lucide-react';
import apiClient from '../../api/apiClient';

const ACTION_CONFIG = {
  ADD: { 
    icon: <Plus className="w-5 h-5" />, 
    bg: 'bg-emerald-500', 
    text: 'text-white', 
    border: 'border-emerald-100',
    label: 'Entry Added',
    accent: 'text-emerald-600'
  },
  EDIT: { 
    icon: <Edit2 className="w-5 h-5" />, 
    bg: 'bg-teal-500', 
    text: 'text-white', 
    border: 'border-teal-100',
    label: 'Modification',
    accent: 'text-teal-600'
  },
  DELETE: { 
    icon: <Trash2 className="w-5 h-5" />, 
    bg: 'bg-rose-500', 
    text: 'text-white', 
    border: 'border-rose-100',
    label: 'Deletion',
    accent: 'text-rose-600'
  },
  DEFAULT: { 
    icon: <Activity className="w-5 h-5" />, 
    bg: 'bg-gray-900', 
    text: 'text-white', 
    border: 'border-gray-800',
    label: 'Admin Action',
    accent: 'text-gray-600'
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
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              Audit Terminal
           </h2>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5 italic">
             Administrative Operations • Real-time Traceability
           </p>
        </div>

        <div className="flex items-center gap-6 w-full lg:w-96">
            <div className="relative group w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID, Admin, or Medicine..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all italic"
                />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-[28px] shadow-sm text-gray-300 hover:text-teal-600 transition-all active:scale-95">
                <Filter className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* ── ACTIVITY TIMELINE ── */}
      <div className="bg-white rounded-[56px] border border-gray-100 shadow-premium p-10 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-16 text-teal-500/5 -z-10 transition-transform duration-1000 rotate-12"><History className="w-80 h-80" /></div>
        
        {isLoading ? (
            <div className="p-24 text-center space-y-6">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Authenticating Audit Data...</p>
            </div>
        ) : filteredLogs?.length === 0 ? (
            <div className="p-24 text-center space-y-8">
                <Database className="w-20 h-20 text-gray-100 mx-auto" />
                <div className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Zero Discrepancies Found</div>
                <p className="text-gray-400 font-semibold italic text-sm max-w-sm mx-auto">No administrative activities have been logged for this specific period in the audit vault.</p>
            </div>
        ) : (
            <div className="space-y-12 relative">
                {/* Vertical Line */}
                <div className="absolute left-7 sm:left-14 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/20 via-gray-100 to-transparent z-0" />

                {filteredLogs.map((log, idx) => {
                    const config = ACTION_CONFIG[log.actionType] || ACTION_CONFIG.DEFAULT;
                    return (
                        <div key={log._id} className="group relative flex gap-10 items-start animate-in fade-in slide-in-from-left-8" style={{ animationDelay: `${idx * 50}ms` }}>
                            
                            {/* Action Node */}
                            <div className={`w-14 h-14 flex items-center justify-center rounded-[22px] border-4 border-white shadow-2xl shrink-0 z-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${config.bg} ${config.text} shadow-xl hover:shadow-2xl`}>
                                {config.icon}
                            </div>

                            {/* Log Content Card */}
                            <div className="flex-1 bg-gray-50/50 group-hover:bg-white border border-transparent group-hover:border-gray-100 p-8 lg:p-10 rounded-[44px] transition-all duration-700 hover:shadow-premium relative">
                                <div className="absolute top-4 right-4 text-teal-500/10"><Sparkles className="w-5 h-5" /></div>
                                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border bg-white ${config.accent} ${config.border} shadow-sm italic`}>
                                                Tier: {config.label}
                                            </span>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100 italic">
                                                <Clock className="w-4 h-4 text-teal-400" /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-900">
                                            <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-900 border border-gray-800 rounded-[20px] shadow-2xl">
                                                <div className="w-7 h-7 bg-white text-gray-900 rounded-lg flex items-center justify-center text-[10px] font-black italic">A</div>
                                                <span className="font-black italic uppercase text-sm text-white tracking-tighter">{log.adminUsername}</span>
                                                <span className="text-gray-500 font-black italic uppercase text-[10px] tracking-widest ml-2">Logged Access</span>
                                            </div>
                                            
                                            <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-teal-500 group-hover:translate-x-2 transition-all duration-500" />
                                            
                                            <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-[20px] shadow-sm group-hover:border-teal-100 transition-colors">
                                                <div className="w-7 h-7 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center"><Pill className="w-4 h-4" /></div>
                                                <span className="font-black italic uppercase text-sm text-gray-900 tracking-tighter">{log.medicineName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0 bg-white px-8 py-4 rounded-[28px] border border-gray-100 shadow-sm xl:w-auto w-full group-hover:border-teal-100 group-hover:bg-teal-50/10 transition-all">
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic mb-1.5 flex items-center justify-end gap-2">
                                            <Calendar className="w-3.5 h-3.5" /> Date Log
                                        </div>
                                        <div className="text-xl font-black text-gray-900 italic tracking-tighter leading-none">
                                            {formatDate(log.timestamp)}
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
      <div className="pt-10 flex items-center justify-center gap-16 grayscale opacity-10">
          <Globe className="w-12 h-12" />
          <Activity className="w-12 h-12" />
          <ShieldCheck className="w-12 h-12" />
      </div>
    </div>
  );
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default LogsTab;
