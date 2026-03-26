import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const AdminLoginPage = () => {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in int
  const [resendCooldown, setResendCooldown] = useState(30);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Resend cooldown logic
  useEffect(() => {
    let timer;
    if (step === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please enter all fields');

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data.requiresOtp) {
        toast.success('OTP sent to your registered email');
        setStep('otp');
        setCountdown(300);
        setResendCooldown(30);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP');

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/verify-otp', { username, otp });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      toast.success('Login verified successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      if (error.response?.status === 403) setStep('login'); // Reset if locked out
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      await apiClient.post('/auth/resend-otp', { username });
      toast.success('A new OTP has been sent to your email');
      setCountdown(300);
      setResendCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header decoration */}
        <div className="h-32 bg-primary/10 flex items-center justify-center relative">
           {step === 'otp' && (
             <button 
               onClick={() => setStep('login')} 
               className="absolute top-4 left-4 p-2 bg-white/50 rounded-full hover:bg-white text-primary transition-all"
               title="Back to login"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
           )}
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center -mb-20 ring-4 ring-white">
            {step === 'login' ? <Lock className="w-8 h-8 text-primary" /> : <ShieldCheck className="w-8 h-8 text-primary" />}
          </div>
        </div>

        <div className="p-8 pt-12">
          {step === 'login' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                <p className="text-gray-500 mt-1">Sign in to manage inventory</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors mt-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
             <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Verify Identity</h2>
                <p className="text-gray-500 mt-2 text-sm">
                  We've sent a 6-digit one time password to the registered admin email address.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-center text-gray-700 mb-3">Enter OTP</label>
                  <div className="relative flex justify-center">
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Numeric only
                      className="block w-3/4 text-center text-2xl tracking-[0.5em] py-4 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-colors outline-none"
                      placeholder="------"
                    />
                  </div>
                  {countdown > 0 ? (
                    <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                      Code expires in: <strong className={countdown < 60 ? 'text-red-500' : 'text-primary'}>{formatTime(countdown)}</strong>
                    </p>
                  ) : (
                    <p className="text-center text-xs text-red-500 font-bold mt-3">
                      OTP Expired
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || countdown === 0}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 transition-colors"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <div className="text-center pt-2">
                   <button 
                     type="button" 
                     onClick={handleResendOtp}
                     disabled={resendCooldown > 0 || loading}
                     className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50 disabled:hover:text-gray-500"
                   >
                     <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                     {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend OTP'}
                   </button>
                </div>
              </form>
             </>
          )}

          {step === 'login' && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Storefront
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default AdminLoginPage;
