import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle, AlertCircle, Eye, Search, CalendarClock } from 'lucide-react';
import apiClient from '../../api/apiClient';

const OverviewTab = () => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['adminReports'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/reports');
      return res.data;
    }
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-primary/10 rounded-xl text-primary">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Medicines</p>
            <h3 className="text-3xl font-bold text-gray-900">{reports?.stockReport?.totalMedicines || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-yellow-50 rounded-xl text-yellow-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Low Stock</p>
            <h3 className="text-3xl font-bold text-gray-900">{reports?.stockReport?.lowStockCount || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-red-50 rounded-xl text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Out of Stock</p>
            <h3 className="text-3xl font-bold text-gray-900">{reports?.stockReport?.outOfStockCount || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600">
             {/* Using Star from lucide-react if imported, else fallback to something else, or import MessageSquare */}
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Feedbacks</p>
            <h3 className="text-3xl font-bold text-gray-900">{reports?.totalFeedbacks || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Most Viewed */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500"/> Most Viewed Medicines</h3>
            <ul className="divide-y divide-gray-100">
              {reports?.mostViewed?.map(med => (
                <li key={med._id} className="py-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{med.name}</span>
                  <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full">{med.viewCount} views</span>
                </li>
              ))}
              {reports?.mostViewed?.length === 0 && <li className="py-3 text-gray-500">No data</li>}
            </ul>
         </div>

         {/* Most Searched */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-purple-500"/> Most Searched Medicines</h3>
            <ul className="divide-y divide-gray-100">
              {reports?.mostSearched?.map(med => (
                <li key={med._id} className="py-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{med.name}</span>
                  <span className="bg-purple-50 text-purple-700 py-1 px-3 rounded-full">{med.searchCount} searches</span>
                </li>
              ))}
              {reports?.mostSearched?.length === 0 && <li className="py-3 text-gray-500">No data</li>}
            </ul>
         </div>

         {/* Expiring Soon */}
         <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-orange-500"/> Expiring / Expired</h3>
            <ul className="divide-y divide-gray-100">
              {reports?.expiredOrNearExpiry?.map(med => {
                const isExpired = new Date(med.expiryDate) < new Date();
                return (
                 <li key={med._id} className="py-3 flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{med.name}</span>
                  <span className={`py-1 px-3 rounded-full ${isExpired ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                    {isExpired ? 'Expired' : 'Expiring'}: {new Date(med.expiryDate).toLocaleDateString()}
                  </span>
                </li>
                );
              })}
              {reports?.expiredOrNearExpiry?.length === 0 && <li className="py-3 text-gray-500">No medicines near expiry.</li>}
            </ul>
         </div>
      </div>
    </div>
  );
};

export default OverviewTab;
