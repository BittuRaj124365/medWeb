import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock, User, ArrowRight, ShieldCheck, Mail, RefreshCw,
  UserCircle, CheckCircle2, HelpCircle, ChevronLeft,
  ShieldAlert, Fingerprint, Key, Globe, Sparkles, Loader2, Activity
} from 'lucide-react';
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
    if (!username || !password) return toast.error('Check identity and credentials');
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      if (res.data.requiresSetup) {
        toast('Account Security: Initial Setup Required', { icon: '🛡️' });
        setStep('setup');
      }
      else if (res.data.requiresOtp) {
        toast.success('Secure OTP dispatched to encrypted channel');
        setStep('otp'); setCountdown(300); setResendCooldown(30);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Access Denied: Check Credentials');
    } finally { setLoading(false); }
  };

  const validateSetup = () => {
    const errors = {};
    if (!setupForm.name.trim()) errors.name = 'Clinical identity required';
    if (!setupForm.email) errors.email = 'Secure email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setupForm.email)) errors.email = 'Invalid communication channel';
    if (!setupForm.confirmEmail) errors.confirmEmail = 'Re-verification required';
    else if (setupForm.email !== setupForm.confirmEmail) errors.confirmEmail = 'Verification mismatch';
    setSetupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSetup()) return;
    try {
      setLoading(true);
      await apiClient.post('/auth/setup-email', { username, name: setupForm.name, email: setupForm.email, confirmEmail: setupForm.confirmEmail });
      toast.success('Channel Verified; Dispatched OTP');
      setStep('otp'); setCountdown(300); setResendCooldown(30);
    } catch (error) { toast.error(error.response?.data?.message || 'Initialization Failure. Retry.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Invalid Protocol Buffer: Check digits');
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/verify-otp', { username, otp });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      toast.success('Security Clearance Granted');
      navigate('/admin/dashboard/overview');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Security Verification Failed');
      if (error.response?.status === 403) setStep('login');
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      await apiClient.post('/auth/resend-otp', { username });
      toast.success('Secondary Burst OTP Dispatched');
      setCountdown(300); setResendCooldown(30);
    } catch (error) { toast.error(error.response?.data?.message || 'Burst Transmission Failed'); }
    finally { setLoading(false); }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) return toast.error('Check Communication Channel');
    try {
      setLoading(true);
      await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (error) { toast.error(error.response?.data?.message || 'Identity not found in logs'); }
    finally { setLoading(false); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const inputStyle = (hasError) => `block w-full pl-14 pr-6 py-5 bg-gray-50 border rounded-2xl font-bold text-sm outline-none transition-all focus:bg-white focus:ring-4 ${hasError ? 'border-red-300 focus:ring-red-50' : 'border-gray-100 focus:ring-primary/5 focus:border-primary/20'}`;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">

      {/* ── LEFT: EXPERT VISUAL ── */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center p-20 animate-in fade-in duration-1000">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579154235602-33d5f73043d1?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Medical Laboratory"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-transparent to-primary/20" />
        </div>

        <div className="relative z-10 space-y-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            <ShieldAlert className="w-4 h-4" /> Secure Terminal
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter italic">
            Pharmaceutical <br />
            <span className="text-primary italic">Command Center.</span>
          </h1>
          <p className="text-xl text-gray-400 font-semibold leading-relaxed italic">
            "Precision in inventory, integrity in results. Access the central clinical distribution network."
          </p>
          <div className="pt-10 flex items-center gap-8 border-t border-white/5">
            {[
              { label: 'Admin Access', value: 'Verified', icon: <Fingerprint className="w-5 h-5" /> },
              { label: 'Data Integrity', value: 'High', icon: <Activity className="w-5 h-5" /> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  {item.icon} {item.label}
                </div>
                <div className="text-lg font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Floating */}
        <div className="absolute top-12 left-12">
          <Link to="/" className="text-3xl font-black text-white tracking-tighter flex items-center gap-3 italic">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white"><Pill className="w-6 h-6" /></div>
            MedShop.
          </Link>
        </div>
      </div>

      {/* ── RIGHT: AUTH FORM ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative overflow-hidden bg-gray-50 lg:bg-white animate-in slide-in-from-right-12 duration-1000">

        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-md w-full relative z-10">

          <div className="mb-12 text-center lg:text-left">
            <div className="inline-block lg:hidden mb-10">
              <Link to="/" className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3 italic">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white"><Pill className="w-6 h-6" /></div>
                MedShop.
              </Link>
            </div>

            {step !== 'login' && (
              <button
                onClick={() => setStep('login')}
                className="mb-8 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Entrance
              </button>
            )}

            <TitleSection step={step} />
          </div>

          <div className="space-y-10">
            {/* ── LOGIN PHASE ── */}
            {step === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className={inputStyle(false)}
                      placeholder="Clinical Identity"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={inputStyle(false)}
                      placeholder="Authorization Key"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary">Storefront Access</Link>
                  <button
                    type="button"
                    onClick={() => { setForgotSent(false); setForgotEmail(''); setStep('forgot'); }}
                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary"
                  >
                    Recovery Protocol
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Request Clearance <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {/* ── SETUP PHASE ── */}
            {step === 'setup' && (
              <form onSubmit={handleSetupSubmit} className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500"><ShieldAlert className="w-5 h-5" /></div>
                  <p className="text-amber-800 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Security Initialization required. Link your encrypted communication channel.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="text" value={setupForm.name} onChange={e => { setSetupForm({ ...setupForm, name: e.target.value }); setSetupErrors({ ...setupErrors, name: '' }); }} className={inputStyle(!!setupErrors.name)} placeholder="Internal Full Name" />
                    {setupErrors.name && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 pl-6">{setupErrors.name}</p>}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="email" value={setupForm.email} onChange={e => { setSetupForm({ ...setupForm, email: e.target.value }); setSetupErrors({ ...setupErrors, email: '' }); }} className={inputStyle(!!setupErrors.email)} placeholder="Verification Email Address" />
                    {setupErrors.email && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 pl-6">{setupErrors.email}</p>}
                  </div>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="email" value={setupForm.confirmEmail} onChange={e => { setSetupForm({ ...setupForm, confirmEmail: e.target.value }); setSetupErrors({ ...setupErrors, confirmEmail: '' }); }} className={inputStyle(!!setupErrors.confirmEmail)} placeholder="Re-Verify Email Channel" />
                    {setupErrors.confirmEmail && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest mt-2 pl-6">{setupErrors.confirmEmail}</p>}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full h-20 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-teal-700 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Initialize Security <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            )}

            {/* ── OTP PHASE ── */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-10 animate-in fade-in duration-500 text-center">
                <div className="space-y-8">
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Protocol Token Verification</div>
                  <div className="flex justify-center gap-4">
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full max-w-[280px] text-center text-4xl font-black italic tracking-[0.4em] py-8 bg-gray-50 border border-gray-100 rounded-[32px] focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none italic"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex justify-center items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${countdown < 60 ? 'bg-red-500' : 'bg-primary'}`} />
                      Sync Time: {formatTime(countdown)}
                    </div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-[10px] font-black text-primary uppercase tracking-widest disabled:text-gray-300 hover:underline"
                    >
                      {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend Request'}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading || countdown === 0} className="w-full h-20 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize Clearance <Key className="w-4 h-4 text-primary" /></>}
                </button>
              </form>
            )}

            {/* ── FORGOT PHASE ── */}
            {step === 'forgot' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                {forgotSent ? (
                  <div className="text-center space-y-10 py-10">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full blur-[40px] animate-pulse" />
                      <div className="relative w-24 h-24 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">Dispatched.</h3>
                      <p className="text-gray-500 font-semibold leading-relaxed">
                        A one-time recovery linkage has been sent to your registered communication channel. Valid for 15 minutes.
                      </p>
                    </div>
                    <button onClick={() => setStep('login')} className="px-10 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all">
                      Back to Initialization
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Verified Channel</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={inputStyle(false)} placeholder="Registered email address" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full h-20 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-teal-700 shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Request Linkage <SendIcon className="w-5 h-5 text-white" /></>}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Support Footer */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-center gap-6 grayscale opacity-20">
            <ShieldCheck className="w-10 h-10" />
            <Globe className="w-10 h-10" />
            <Sparkles className="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TitleSection = ({ step }) => {
  const content = {
    login: { title: "Admin Portal", sub: "Identification required for access." },
    setup: { title: "Safety Sync", sub: "Establishing secure communication logs." },
    otp: { title: "Identity Log", sub: "Confirming 2FA protocol token." },
    forgot: { title: "Archival Sync", sub: "Recovering lost credentials log." }
  };
  const { title, sub } = content[step];
  return (
    <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">{title}</h2>
      <p className="text-gray-400 font-bold tracking-tight">{sub}</p>
    </div>
  );
};

const SendIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

const Pill = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.054.496l-1.058 1.058a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.348 2.348l2.387-.477a2 2 0 001.022-.547l1.058-1.058a2 2 0 00.496-1.054l.158-.318a2 2 0 01.517-3.86l.158-.318a2 2 0 00.517-3.86l.158-.318a2 2 0 01.517-3.86l.158-.318a2 2 0 00.517-3.86l.158-.318a2 2 0 01.517-3.86l.158-.318a2 2 0 00-.547-1.022l-1.058-1.058a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-2.348 2.348l.477 2.387a2 2 0 00.547 1.022l1.058 1.058a2 2 0 001.022.547l2.387.477a2 2 0 002.348-2.348l-.477-2.387z" />
  </svg>
)

export default AdminLoginPage;
