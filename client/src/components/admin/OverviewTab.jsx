import { useQuery } from '@tanstack/react-query';
import { 
  Package, AlertTriangle, AlertCircle, Eye, Search, 
  CalendarClock, TrendingUp, MessageSquare, Flag, Users, 
  ArrowUpRight, ArrowDownRight, Activity, Zap, ShieldCheck,
  ChevronRight, RefreshCw, Layers, Globe, Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
  ComposedChart
} from 'recharts';
import apiClient from '../../api/apiClient';
import { GraphSkeleton } from '../LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0D9488', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

const OverviewTab = () => {
  const navigate = useNavigate();
  const { data: reports, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminReports'],
    queryFn: async () => (await apiClient.get('/admin/reports')).data
  });

  const { data: graphData, isLoading: isLoadingGraphs } = useQuery({
    queryKey: ['adminDashboardGraphs'],
    queryFn: async () => (await apiClient.get('/admin/dashboard/graphs')).data
  });

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-1000">
      
      {/* ── HIGH IMPACT METRICS ── */}
      <section>
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Clinical Metrics
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-5">Key Performance Log • Live Sync</p>
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-all active:scale-95">
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard 
            icon={<Package className="w-7 h-7" />} 
            label="Stored Medicines" 
            subLabel="Total Verified Stock"
            value={reports?.stockReport?.totalMedicines} 
            color="from-teal-500 to-emerald-500" 
            isLoading={isLoadingStats}
            trend="+12% vs last month"
            onClick={() => navigate('/admin/dashboard/medicines')}
          />
          <StatCard 
            icon={<AlertTriangle className="w-7 h-7" />} 
            label="Low Stock Alert" 
            subLabel="Below Safety Limit"
            value={reports?.stockReport?.lowStockCount} 
            color="from-orange-500 to-amber-500" 
            isLoading={isLoadingStats}
            isWarning={true}
            onClick={() => navigate('/admin/dashboard/medicines')}
          />
          <StatCard 
            icon={<AlertCircle className="w-7 h-7" />} 
            label="Out of Stock" 
            subLabel="Zero Units Available"
            value={reports?.stockReport?.outOfStockCount} 
            color="from-rose-500 to-pink-500" 
            isLoading={isLoadingStats}
            isCritical={true}
            onClick={() => navigate('/admin/dashboard/medicines')}
          />
          <StatCard 
            icon={<MessageSquare className="w-7 h-7" />} 
            label="Patient Reviews" 
            subLabel="User Feedback Sync"
            value={reports?.totalFeedbacks} 
            color="from-indigo-500 to-blue-500" 
            isLoading={isLoadingStats}
            onClick={() => navigate('/admin/dashboard/feedbacks')}
          />
          <StatCard 
            icon={<Flag className="w-7 h-7" />} 
            label="System Reports" 
            subLabel="Pending Discrepancies"
            value={reports?.totalReports} 
            color="from-purple-500 to-violet-500" 
            isLoading={isLoadingStats}
            onClick={() => navigate('/admin/dashboard/reports')}
          />
          <StatCard 
            icon={<Users className="w-7 h-7" />} 
            label="Medicine Suppliers" 
            subLabel="Verified Logistics Links"
            value={reports?.totalSuppliers} 
            color="from-gray-700 to-gray-900" 
            isLoading={isLoadingStats}
            onClick={() => navigate('/admin/dashboard/suppliers')}
          />
        </div>
      </section>

      {/* ── ANALYTICAL VISUALIZATIONS ── */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Analytical Intelligence</h2>
            <div className="h-px bg-gray-100 flex-1" />
        </div>
        
        {isLoadingGraphs ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[...Array(4)].map((_, i) => <GraphSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* 1. Area Chart: Trend */}
            <ChartContainer title="Acquisition Velocity" subTitle="New inventory additions (6 months)" icon={<Activity className="w-5 h-5 text-primary"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={graphData?.monthlyActivity}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1', textTransform: 'uppercase'}} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 2. Bar Chart: Category Distribution */}
            <ChartContainer title="Therapeutic Allocation" subTitle="Stock counts by clinical category" icon={<Layers className="w-5 h-5 text-blue-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData?.stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#cbd5e1', textTransform: 'uppercase'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: 'rgba(13, 148, 136, 0.05)'}} content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#0D9488" radius={[12, 12, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 3. Interest Analytics */}
            <ChartContainer title="Market Interest Logs" subTitle="Comparison of views vs searches" icon={<Zap className="w-5 h-5 text-amber-500"/>}>
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={graphData?.mostViewed?.slice(0, 6)} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8', width: 100}} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="viewCount" fill="#0EA5E9" radius={[0, 10, 10, 0]} barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 4. Veracity Distribution */}
            <ChartContainer title="Veracity Confidence" subTitle="Feedback rating distribution logs" icon={<ShieldCheck className="w-5 h-5 text-emerald-500"/>}>
              <div className="flex flex-col md:flex-row items-center justify-center">
                  <ResponsiveContainer width="100%" height={360}>
                    <PieChart>
                      <Pie data={graphData?.ratingsData} dataKey="count" nameKey="star" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} stroke="none">
                        {graphData?.ratingsData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                    </PieChart>
                  </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>
        )}
      </section>

      {/* ── EXPIRY AND LOGS ── */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Expiry Critical Watch */}
        <div className="xl:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <h2 className="text-xl lg:text-3xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-4">
                    <CalendarClock className="w-6 h-6 lg:w-8 lg:h-8 text-rose-500" /> Near Expiry Alerts
                </h2>
                <button 
                  onClick={() => navigate('/admin/dashboard/medicines')}
                  className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  Manage All Medicines
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                {!isLoadingStats && reports?.expiredOrNearExpiry?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Medicine Details</th>
                          <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Current Status</th>
                          <th className="py-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Expiry Date</th>
                          <th className="py-6 px-10 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">View</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {reports?.expiredOrNearExpiry?.map((med, idx) => {
                          const isExpired = new Date(med.expiryDate) < new Date();
                          return (
                            <tr key={med._id} className="group hover:bg-gray-50/80 transition-all duration-300">
                              <td className="py-6 px-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${isExpired ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} />
                                    <div>
                                        <div className="text-sm font-black text-gray-900 italic uppercase">{med.name}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{med.category}</div>
                                    </div>
                                </div>
                              </td>
                              <td className="py-6 px-10">
                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isExpired ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                    {isExpired ? 'Terminated' : 'Near Expiry'}
                                </span>
                              </td>
                              <td className="py-6 px-10 text-sm font-bold text-gray-500 italic">
                                {new Date(med.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="py-6 px-10 text-right">
                                <button className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all active:scale-90">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                    <div className="p-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/10">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Inventory Secure</h3>
                            <p className="text-gray-400 font-semibold max-w-sm mx-auto">All active pharmaceutical assets are currently within safe shelf-life parameters.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Top Assets Snippet */}
        <div className="space-y-8">
            <h2 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-500" /> High Activity
            </h2>
            
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium space-y-6 group">
                   <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Most Viewed Asset</h3>
                        <Eye className="w-4 h-4 text-indigo-400 animate-pulse" />
                   </div>
                   {reports?.mostViewed?.length > 0 ? (
                       <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-black text-gray-900 italic uppercase">{reports.mostViewed[0].name}</div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Global Interaction Log</div>
                            </div>
                            <div className="text-4xl font-black text-indigo-600 tracking-tighter italic tabular-nums">{reports.mostViewed[0].viewCount}</div>
                       </div>
                   ) : <p className="text-xs text-gray-300">No telemetry log found.</p>}
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium space-y-6 group">
                   <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Query Term</h3>
                        <Search className="w-4 h-4 text-primary animate-pulse" />
                   </div>
                   {reports?.mostSearched?.length > 0 ? (
                       <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xl font-black text-gray-900 italic uppercase">{reports.mostSearched[0].name}</div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Search Terminal Frequency</div>
                            </div>
                            <div className="text-4xl font-black text-primary tracking-tighter italic tabular-nums">{reports.mostSearched[0].searchCount}</div>
                       </div>
                   ) : <p className="text-xs text-gray-300">No search log synced.</p>}
                </div>

                <div className="bg-gray-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:rotate-12 transition-transform duration-700"><Globe className="w-32 h-32" /></div>
                    <div className="relative z-10 space-y-6">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary"><ShieldCheck className="w-6 h-6" /></div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none uppercase">Global <br /> Synchronization</h3>
                        <p className="text-gray-400 text-xs font-semibold leading-relaxed">System logs are synchronized with central clinical headquarters every 300 seconds.</p>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                            Full Terminal Log <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, subLabel, value, color, isLoading, isWarning, isCritical, trend, onClick }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-premium flex flex-col gap-6 animate-pulse">
        <div className="w-16 h-16 bg-gray-50 rounded-[24px]"></div>
        <div className="space-y-3">
          <div className="h-2 bg-gray-50 rounded w-1/2"></div>
          <div className="h-10 bg-gray-50 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-10 rounded-[48px] border border-gray-100 shadow-premium flex flex-col gap-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${isCritical ? 'hover:shadow-rose-100' : isWarning ? 'hover:shadow-amber-100' : 'hover:shadow-primary/10'}`}
    >
      <div className={`absolute top-0 right-0 p-10 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl rounded-full`} />
      
      <div className="flex justify-between items-start">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-[24px] flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
            {icon}
        </div>
        {trend && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" /> {trend}
            </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 italic">{label}</div>
        <div className="flex items-baseline gap-4">
            <h3 className={`text-5xl font-black italic tracking-tighter tabular-nums ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>
                {value || 0}
            </h3>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{subLabel}</span>
        </div>
      </div>
      
      {onClick && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-50 group/btn mt-auto">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/btn:text-primary transition-colors italic">Manage Database</span>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-50 overflow-hidden">
         <div className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 w-0 group-hover:w-full delay-300`} />
      </div>
    </div>
  );
};

const ChartContainer = ({ title, subTitle, icon, children }) => (
  <div className="bg-white p-10 rounded-[54px] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 group-hover:scale-125 transition-transform duration-1000">{icon}</div>
    <div className="flex flex-col gap-2 mb-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/5 transition-colors">{icon}</div>
        <h3 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">{title}</h3>
      </div>
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-[60px]">{subTitle}</p>
    </div>
    <div className="relative z-10">
        {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 p-4 rounded-2xl shadow-2xl border border-white/10 glass animate-in zoom-in duration-300">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic border-b border-white/5 pb-2">{label}</p>
                <div className="flex flex-col gap-1">
                    {payload.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-6">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.name || 'Value'}:</span>
                            <span className="text-xl font-black text-primary italic tracking-tighter tabular-nums">{p.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default OverviewTab;
