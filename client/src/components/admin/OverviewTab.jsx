import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle, AlertCircle, Eye, Search, CalendarClock, TrendingUp, MessageSquare, Flag, Users } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import apiClient from '../../api/apiClient';
import { GraphSkeleton } from '../LoadingSkeleton';

const COLORS = ['#0D9488', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

const OverviewTab = () => {
  const { data: reports, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminReports'],
    queryFn: async () => (await apiClient.get('/admin/reports')).data
  });

  const { data: graphData, isLoading: isLoadingGraphs } = useQuery({
    queryKey: ['adminDashboardGraphs'],
    queryFn: async () => (await apiClient.get('/admin/dashboard/graphs')).data
  });

  return (
    <div className="space-y-10 pb-12">
      {/* ── Summary Statistics Cards ── */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" /> Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={<Package className="w-8 h-8" />} 
            label="Total Medicines" 
            value={reports?.stockReport?.totalMedicines} 
            color="bg-blue-50 text-blue-600" 
            isLoading={isLoadingStats}
          />
          <StatCard 
            icon={<AlertTriangle className="w-8 h-8" />} 
            label="Low Stock" 
            value={reports?.stockReport?.lowStockCount} 
            color="bg-amber-50 text-amber-600" 
            isLoading={isLoadingStats}
          />
          <StatCard 
            icon={<AlertCircle className="w-8 h-8" />} 
            label="Out of Stock" 
            value={reports?.stockReport?.outOfStockCount} 
            color="bg-red-50 text-red-600" 
            isLoading={isLoadingStats}
          />
          <StatCard 
            icon={<MessageSquare className="w-8 h-8" />} 
            label="Total Feedbacks" 
            value={reports?.totalFeedbacks} 
            color="bg-indigo-50 text-indigo-600" 
            isLoading={isLoadingStats}
          />
          <StatCard 
            icon={<Flag className="w-8 h-8" />} 
            label="Total Reports" 
            value={reports?.totalReports} 
            color="bg-rose-50 text-rose-600" 
            isLoading={isLoadingStats}
          />
          <StatCard 
            icon={<Users className="w-8 h-8" />} 
            label="Total Suppliers" 
            value={reports?.totalSuppliers} 
            color="bg-teal-50 text-teal-600" 
            isLoading={isLoadingStats}
          />
        </div>
      </section>

      {/* ── Graphical Insights ── */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary p-1 bg-primary/10 rounded-lg" /> Graphical Visualizations
        </h2>
        
        {isLoadingGraphs ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => <GraphSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Medicine Stock Overview */}
            <ChartContainer title="Medicine Stock by Category" icon={<TrendingUp className="w-5 h-5 text-primary"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData?.stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill="#0D9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 2. Monthly Activity */}
            <ChartContainer title="Medicines Added (Last 6 Months)" icon={<CalendarClock className="w-5 h-5 text-blue-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData?.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="count" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 6, fill: '#0EA5E9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 3. Most Viewed */}
            <ChartContainer title="Most Viewed Chart" icon={<Eye className="w-5 h-5 text-indigo-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData?.mostViewed} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} width={100} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="viewCount" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 4. Most Searched */}
            <ChartContainer title="Most Searched Chart" icon={<Search className="w-5 h-5 text-purple-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData?.mostSearched} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} width={100} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="searchCount" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 5. Feedback Distribution */}
            <ChartContainer title="Feedback Ratings Distribution" icon={<MessageSquare className="w-5 h-5 text-teal-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={graphData?.ratingsData} dataKey="count" nameKey="star" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                    {graphData?.ratingsData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* 6. Reports Overview */}
            <ChartContainer title="Reports Overview Chart" icon={<Flag className="w-5 h-5 text-red-500"/>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData?.reportsStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', textTransform: 'capitalize'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Bar dataKey="count" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </section>

      {/* ── Detailed Tabular Data ── */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Package className="w-6 h-6 text-primary p-1 bg-primary/10 rounded-lg" /> Detailed Statistics
        </h2>

        {!isLoadingStats && reports && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Viewed List */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" /> Top Viewed Medicines
              </h3>
              <div className="space-y-2">
                {reports?.mostViewed?.slice(0, 5).map((med, idx) => (
                  <div key={med._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span> {med.name}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{med.viewCount} views</span>
                  </div>
                ))}
                {reports?.mostViewed?.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No view data available.</p>}
              </div>
            </div>

            {/* Top Searched List */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-500" /> Top Searched Medicines
              </h3>
              <div className="space-y-2">
                {reports?.mostSearched?.slice(0, 5).map((med, idx) => (
                  <div key={med._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span> {med.name}
                    </span>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">{med.searchCount} searches</span>
                  </div>
                ))}
                {reports?.mostSearched?.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No search data available.</p>}
              </div>
            </div>

            {/* Expiring Soon Table */}
            {reports?.expiredOrNearExpiry?.length > 0 && (
              <div className="md:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-orange-500"/> Expiring / Expired Items
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b">
                        <th className="pb-4 px-2">Medicine Name</th>
                        <th className="pb-4 px-2">Status</th>
                        <th className="pb-4 px-2">Expiry Date</th>
                        <th className="pb-4 px-2 text-right">View Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reports?.expiredOrNearExpiry?.map(med => {
                        const isExpired = new Date(med.expiryDate) < new Date();
                        return (
                          <tr key={med._id} className="text-sm group hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-2 font-bold text-gray-700">{med.name}</td>
                            <td className="py-4 px-2">
                               <span className={`py-1 px-3 rounded-full text-xs font-bold ${isExpired ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                                {isExpired ? 'Expired' : 'Expiring Soon'}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-gray-500">{new Date(med.expiryDate).toLocaleDateString()}</td>
                            <td className="py-4 px-2 text-right">
                               <button className="text-primary hover:underline font-bold text-xs uppercase tracking-wider">
                                  Manage
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 animate-pulse">
        <div className="p-4 bg-gray-50 rounded-xl w-16 h-16"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4 bg-gray-50 rounded w-1/2"></div>
          <div className="h-8 bg-gray-50 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
      <div className={`p-4 rounded-xl transition-colors duration-300 ${color} group-hover:bg-opacity-80`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{label}</p>
        <h3 className="text-3xl font-black text-gray-900 tabular-nums">{value || 0}</h3>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        {icon} {title}
      </h3>
    </div>
    {children}
  </div>
);

export default OverviewTab;
