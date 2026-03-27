import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, X, ChevronDown, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const REASONS = [
  'Incorrect Information',
  'Medicine Not Available',
  'Wrong Price',
  'Expired Medicine Listed',
  'Other'
];

const STATUS_STYLES = {
  pending:  { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',  label: 'Pending' },
  reviewed: { badge: 'bg-blue-100 text-blue-800 border-blue-200',        label: 'Reviewed' },
  resolved: { badge: 'bg-green-100 text-green-800 border-green-200',     label: 'Resolved' }
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
      toast.success(`Report marked as ${status}`);
      queryClient.invalidateQueries(['adminProductReports']);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
      if (selectedReport) setSelectedReport(prev => ({ ...prev, status }));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update report')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/product-reports/${id}`),
    onSuccess: () => {
      toast.success('Report deleted successfully');
      queryClient.invalidateQueries(['adminProductReports']);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
      setSelectedReport(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete report')
  });

  const filtered = filterStatus ? reports.filter(r => r.status === filterStatus) : reports;
  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Product Reports</h2>
              <p className="text-sm text-gray-500">User-submitted reports about medicines</p>
            </div>
            {pendingCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
                {pendingCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm border-b">
                <th className="p-4 font-semibold">Medicine</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Reporter</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading reports...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">
                  <Flag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No reports found.
                </td></tr>
              ) : (
                filtered.map(report => {
                  const style = STATUS_STYLES[report.status] || STATUS_STYLES.pending;
                  return (
                    <tr
                      key={report._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{report.medicine?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{report.medicine?.category}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-700 max-w-[180px]">
                        <span className="inline-flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          {report.reason}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-700">{report.reporterName || <span className="italic text-gray-400">Anonymous</span>}</div>
                        {report.reporterEmail && <div className="text-xs text-gray-400">{report.reporterEmail}</div>}
                      </td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(report.dateReported)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1.5">
                          {report.status !== 'reviewed' && (
                            <button
                              onClick={() => updateMutation.mutate({ id: report._id, status: 'reviewed' })}
                              className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Mark Reviewed"
                            >
                              Reviewed
                            </button>
                          )}
                          {report.status !== 'resolved' && (
                            <button
                              onClick={() => updateMutation.mutate({ id: report._id, status: 'resolved' })}
                              className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                              title="Mark Resolved"
                            >
                              Resolved
                            </button>
                          )}
                          <button
                            onClick={() => window.confirm('Delete this report?') && deleteMutation.mutate(report._id)}
                            className="px-2.5 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={(id, status) => updateMutation.mutate({ id, status })}
          onDelete={(id) => { if (window.confirm('Delete this report?')) deleteMutation.mutate(id); }}
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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Report Details</h2>
              <p className="text-xs text-gray-500">Submitted {formatDate(report.dateReported)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Medicine</p>
              <p className="font-semibold text-gray-900">{report.medicine?.name || 'Unknown'}</p>
              {report.medicine?.category && <p className="text-xs text-gray-500 mt-0.5">{report.medicine.category}</p>}
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                {style.label}
              </span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <p className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Reason for Report
            </p>
            <p className="font-semibold text-gray-900">{report.reason}</p>
          </div>

          {report.additionalDetails && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Additional Details</p>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed">
                {report.additionalDetails}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Reporter Information</p>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 space-y-1">
              <p><span className="font-medium text-gray-500">Name:</span> {report.reporterName || <span className="italic text-gray-400">Not provided</span>}</p>
              <p><span className="font-medium text-gray-500">Email:</span> {report.reporterEmail || <span className="italic text-gray-400">Not provided</span>}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex flex-wrap gap-3 justify-between">
          <button onClick={() => onDelete(report._id)} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors">
            {isDeleting ? 'Deleting...' : 'Delete Report'}
          </button>
          <div className="flex gap-2">
            {report.status !== 'reviewed' && (
              <button onClick={() => onUpdate(report._id, 'reviewed')} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 disabled:opacity-50 transition-colors">
                Mark Reviewed
              </button>
            )}
            {report.status !== 'resolved' && (
              <button onClick={() => onUpdate(report._id, 'resolved')} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors">
                {isUpdating ? 'Updating...' : 'Mark Resolved'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
