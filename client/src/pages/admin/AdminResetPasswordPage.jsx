import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const AdminResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new one.');
      navigate('/admin');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/reset-password', { token, newPassword, confirmPassword });
      setSuccess(true);
      toast.success(res.data.message);
      setTimeout(() => navigate('/admin'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Password Reset!</h2>
          <p className="text-gray-500">Your password has been updated successfully.<br />Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const inputClass = 'block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        <div className="h-32 bg-primary/10 flex items-center justify-center">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center -mb-20 ring-4 ring-white">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create New Password</h2>
            <p className="text-gray-500 text-sm mt-2">Enter a strong password for your admin account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Minimum 6 characters"
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`${inputClass} ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300 bg-red-50' : ''}`}
                  placeholder="Re-enter password"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1 pl-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary hover:bg-teal-700 disabled:opacity-70 transition-colors"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-primary transition-colors">
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
