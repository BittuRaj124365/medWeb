import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const FeedbacksTab = () => {
  const queryClient = useQueryClient();

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
      toast.success(variables.approved ? 'Feedback approved' : 'Feedback rejected');
      queryClient.invalidateQueries(['adminFeedbacks']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error updating feedback')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/admin/feedbacks/${id}`),
    onSuccess: () => {
      toast.success('Feedback deleted');
      queryClient.invalidateQueries(['adminFeedbacks']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error deleting feedback')
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
         <MessageSquare className="w-5 h-5 text-gray-600"/>
         <h2 className="text-lg font-bold text-gray-900">User Feedbacks Management</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-500 text-sm border-b">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Medicine</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading feedbacks...</td></tr>
            ) : feedbacks?.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No feedbacks found.</td></tr>
            ) : (
              feedbacks?.map(fb => (
                <tr key={fb._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{fb.userName}</div>
                    <div className="text-xs text-gray-500">{fb.userEmail}</div>
                    <div className="text-xs text-gray-400">{new Date(fb.dateSubmitted).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">{fb.medicine?.name || 'Unknown'}</td>
                  <td className="p-4">
                     <span className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                        {fb.rating} ★
                     </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={fb.message}>{fb.message || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      fb.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {fb.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {!fb.approved && (
                        <button
                          onClick={() => statusMutation.mutate({ id: fb._id, approved: true })}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                    )}
                    {fb.approved && (
                         <button
                         onClick={() => statusMutation.mutate({ id: fb._id, approved: false })}
                         className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                         title="Reject"
                       >
                         <XCircle className="w-4 h-4" />
                       </button>
                    )}
                    <button
                      onClick={() => window.confirm('Delete this feedback?') && deleteMutation.mutate(fb._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbacksTab;
