import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, 
  ArrowLeft, Key, ShieldAlert, Loader2, RefreshCw,
  Fingerprint, Sparkles, Activity
} from 'lucide-react';
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
      toast.error('Security Protocol: Invalid Reset Token', { icon: '🚫' });
      navigate('/admin');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Credential Strength: 6+ characters required');
    if (newPassword !== confirmPassword) return toast.error('Validation Error: Passwords do not match');

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/reset-password', { token, newPassword, confirmPassword });
      setSuccess(true);
      toast.success('Clinical Credentials Updated', { icon: '🔐' });
      setTimeout(() => navigate('/admin'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Linkage Expired: Re-request recovery');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 lg:p-12 animate-in zoom-in duration-700">
        <div className="max-w-md w-full bg-white rounded-[48px] shadow-premium border border-gray-100 p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-emerald-500/5 -z-10"><ShieldCheck className="w-32 h-32" /></div>
          
          <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-100 rounded-full blur-[40px] animate-pulse" />
              <div className="relative w-24 h-24 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
          </div>
          
          <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Access <br /> Restored.</h2>
              <p className="text-gray-500 font-semibold leading-relaxed">
                  Your biometric and credential logs have been successfully updated in our neural network. 
                  <br /><span className="text-primary italic">Redirecting to login portal...</span>
              </p>
          </div>
          
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-gray-200 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = (hasError) => `block w-full pl-14 pr-12 py-5 bg-gray-50 border rounded-[24px] font-bold text-sm outline-none transition-all focus:bg-white focus:ring-4 ${hasError ? 'border-red-300 focus:ring-red-50' : 'border-gray-100 focus:ring-primary/5 focus:border-primary/20'}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
           <button 
              onClick={() => navigate('/admin')}
              className="mb-8 inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all group"
           >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Entrance Protocol
           </button>
           
           <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-primary/10 rounded-[32px] blur-2xl" />
                <div className="relative w-20 h-20 bg-white rounded-[28px] shadow-sm border border-gray-100 flex items-center justify-center text-primary group">
                    <Fingerprint className="w-8 h-8 transform group-hover:rotate-12 transition-transform" />
                </div>
           </div>
           
           <div className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter leading-none uppercase">Credential <br /> Recovery.</h1>
                <p className="text-gray-400 font-bold tracking-tight">Updating secure access parameters.</p>
           </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-10 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Neural Unlock Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            <input
                                type={showNew ? 'text' : 'password'}
                                required
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className={inputStyle(false)}
                                placeholder="Min. 6 Alpha-Numeric"
                            />
                            <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Redundancy Check</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className={inputStyle(confirmPassword && newPassword !== confirmPassword)}
                                placeholder="Verify Credentials"
                            />
                            <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 pl-6">Parity Mismatch Detected</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-20 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <>Log Changes <Key className="w-4 h-4 text-primary" /></>}
                </button>
            </form>
        </div>

        {/* Footer Proofs */}
        <div className="pt-8 flex items-center justify-center gap-8 grayscale opacity-10">
            <Activity className="w-8 h-8" />
            <ShieldCheck className="w-8 h-8" />
            <Sparkles className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
