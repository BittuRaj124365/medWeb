import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Search } from 'lucide-react';
import apiClient from '../../api/apiClient';

const LogsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/logs');
      return res.data;
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
           <Activity className="w-5 h-5 text-gray-600"/>
           <h2 className="text-lg font-bold text-gray-900">Admin Activity Feed</h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading logs...</div>
        ) : logs?.length === 0 ? (
          <div className="text-center text-gray-500">No activity logged.</div>
        ) : (
          <ul className="space-y-4">
            {logs.filter(log => 
              log.adminUsername.toLowerCase().includes(searchTerm.toLowerCase()) || 
              log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) || 
              log.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((log) => (
              <li key={log._id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0">
                 <div className="mt-1">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${log.actionType === 'ADD' ? 'bg-green-100 text-green-700' : 
                        log.actionType === 'EDIT' ? 'bg-blue-100 text-blue-700' : 
                        log.actionType === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                    `}>
                     {log.actionType[0]}
                   </div>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">
                     Admin <span className="font-bold text-primary">{log.adminUsername}</span> {log.actionType.toLowerCase().replace('_', ' ')} <span className="font-semibold">{log.medicineName}</span>
                   </p>
                   <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                 </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogsTab;
