import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, Mail, RefreshCw, UserCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const AdminLoginPage = () => {
  // steps: 'login' | 'setup' | 'otp' | 'forgot'
  const [step, setStep] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [setupForm, setSetupForm] = useState({ name: '', email: '', confirmEmail: '' });
  const [setupErrors, setSetupErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  useEffect(() => {
    let t; if (step === 'otp' && countdown > 0) t = setInterval(() => setCountdown(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  useEffect(() => {
    let t; if (step === 'otp' && resendCooldown > 0) t = setInterval(() => setResendCooldown(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendCooldown]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please enter username and password');
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data.requiresSetup) { toast('Complete your account setup to enable OTP login.', { icon: '⚙️' }); setStep('setup'); }
      else if (res.data.requiresOtp) { toast.success('OTP sent to your registered email'); setStep('otp'); setCountdown(300); setResendCooldown(30); }
    } catch (error) { toast.error(error.response?.data?.message || 'Login failed. Check your credentials.'); }
    finally { setLoading(false); }
  };

  const validateSetup = () => {
    const errors = {};
    if (!setupForm.name.trim()) errors.name = 'Full name is required';
    if (!setupForm.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setupForm.email)) errors.email = 'Enter a valid email address';
    if (!setupForm.confirmEmail) errors.confirmEmail = 'Please confirm your email';
    else if (setupForm.email !== setupForm.confirmEmail) errors.confirmEmail = 'Emails do not match';
    setSetupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSetup()) return;
    try {
      setLoading(true);
      await apiClient.post('/auth/setup-email', { username, name: setupForm.name, email: setupForm.email, confirmEmail: setupForm.confirmEmail });
      toast.success('Email saved! OTP sent to your inbox.');
      setStep('otp'); setCountdown(300); setResendCooldown(30);
    } catch (error) { toast.error(error.response?.data?.message || 'Setup failed. Try again.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP');
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/verify-otp', { username, otp });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
      if (error.response?.status === 403) setStep('login');
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      await apiClient.post('/auth/resend-otp', { username });
      toast.success('New OTP sent to your email');
      setCountdown(300); setResendCooldown(30);
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to resend OTP'); }
    finally { setLoading(false); }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) return toast.error('Please enter a valid email address');
    try {
      setLoading(true);
      await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (error) { toast.error(error.response?.data?.message || 'No account found with that email'); }
    finally { setLoading(false); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const goodInput = 'block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors outline-none';
  const badInput  = 'block w-full pl-10 pr-3 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-200 sm:text-sm bg-red-50 transition-colors outline-none';

  const stepIcon = { login: <Lock className="w-8 h-8 text-primary" />, setup: <UserCircle className="w-8 h-8 text-primary" />, otp: <ShieldCheck className="w-8 h-8 text-primary" />, forgot: <HelpCircle className="w-8 h-8 text-primary" /> };
  const isBack = step !== 'login';

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="h-32 bg-primary/10 flex items-center justify-center relative">
          {isBack && (
            <button onClick={() => setStep('login')} className="absolute top-4 left-4 p-2 bg-white/50 rounded-full hover:bg-white text-primary transition-all">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          )}
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center -mb-20 ring-4 ring-white">
            {stepIcon[step]}
          </div>
        </div>

        <div className="p-8 pt-12">

          {/* ── LOGIN ── */}
          {step === 'login' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                <p className="text-gray-500 mt-1 text-sm">Sign in to manage inventory</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className={goodInput} placeholder="admin" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={goodInput} placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary hover:bg-teal-700 disabled:opacity-70 transition-colors">
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
              <div className="mt-5 text-center">
                <button onClick={() => { setForgotSent(false); setForgotEmail(''); setStep('forgot'); }} className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Forgot your password?
                </button>
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary mx-auto transition-colors">
                  <ArrowLeftIcon className="w-4 h-4" /> Return to Storefront
                </button>
              </div>
            </>
          )}

          {/* ── FIRST-TIME EMAIL SETUP ── */}
          {step === 'setup' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Setup</h2>
                <p className="text-gray-500 mt-2 text-sm">One-time setup to enable secure OTP login.</p>
              </div>
              <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <span>This email will be used to receive OTP codes on every future login.</span>
              </div>
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserCircle className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" value={setupForm.name} onChange={e => { setSetupForm({...setupForm, name: e.target.value}); setSetupErrors({...setupErrors, name: ''}); }} className={setupErrors.name ? badInput : goodInput} placeholder="John Admin" />
                  </div>
                  {setupErrors.name && <p className="text-red-500 text-xs mt-1 pl-1">{setupErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                    <input type="email" value={setupForm.email} onChange={e => { setSetupForm({...setupForm, email: e.target.value}); setSetupErrors({...setupErrors, email: ''}); }} className={setupErrors.email ? badInput : goodInput} placeholder="admin@example.com" />
                  </div>
                  {setupErrors.email && <p className="text-red-500 text-xs mt-1 pl-1">{setupErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Email *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CheckCircle2 className="h-5 w-5 text-gray-400" /></div>
                    <input type="email" value={setupForm.confirmEmail} onChange={e => { setSetupForm({...setupForm, confirmEmail: e.target.value}); setSetupErrors({...setupErrors, confirmEmail: ''}); }} className={setupErrors.confirmEmail ? badInput : goodInput} placeholder="Re-enter email" />
                  </div>
                  {setupErrors.confirmEmail && <p className="text-red-500 text-xs mt-1 pl-1">{setupErrors.confirmEmail}</p>}
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary hover:bg-teal-700 disabled:opacity-70 transition-colors mt-2">
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Save &amp; Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* ── OTP ── */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Verify Identity</h2>
                <p className="text-gray-500 mt-2 text-sm">We sent a 6-digit code to your registered email.</p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-center text-gray-700 mb-3">Enter OTP</label>
                  <div className="flex justify-center">
                    <input type="text" required maxLength="6" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))} className="block w-3/4 text-center text-2xl tracking-[0.5em] py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-colors outline-none" placeholder="------" />
                  </div>
                  {countdown > 0 ? (
                    <p className="text-center text-xs text-gray-400 mt-3">Expires in: <strong className={countdown < 60 ? 'text-red-500' : 'text-primary'}>{formatTime(countdown)}</strong></p>
                  ) : (
                    <p className="text-center text-xs text-red-500 font-bold mt-3">OTP Expired</p>
                  )}
                </div>
                <button type="submit" disabled={loading || countdown === 0} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-black disabled:opacity-70 transition-colors">
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Code'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0 || loading} className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {step === 'forgot' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-gray-500 mt-2 text-sm">Enter your registered email and we'll send a reset link.</p>
              </div>
              {forgotSent ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="font-bold text-gray-800">Reset email sent!</p>
                  <p className="text-sm text-gray-500">Check your inbox for the password reset link. It expires in <strong>15 minutes</strong>.</p>
                  <button onClick={() => setStep('login')} className="text-sm text-primary hover:underline font-medium">Back to login</button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                      <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={goodInput} placeholder="admin@example.com" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-primary hover:bg-teal-700 disabled:opacity-70 transition-colors">
                    {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

export default AdminLoginPage;
