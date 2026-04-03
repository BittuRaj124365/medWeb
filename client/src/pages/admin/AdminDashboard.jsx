import { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LogOut, Settings, LayoutDashboard, PackageSearch, Truck,
  Activity, MessageSquare, Flag, KeyRound, UserCircle, Camera,
  User, Mail, Lock, Eye, EyeOff, CheckCircle2, X, Save,
  ChevronRight, ShieldCheck, Fingerprint, Bell, Search,
  Menu, MoreVertical, Globe, Sparkles, Pill, Loader2,
  ShieldAlert, Send, Plus, RefreshCw, ArrowRight, Minus,
  Trash2, Edit3, Filter, MoreHorizontal, Calendar, 
  ChevronUp, ChevronDown, ExternalLink, Download, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  (name || 'A').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const SecurityDecoration = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>
);

// ─── Account Settings Modal (Defined first to avoid reference errors) ──────────
const AccountSettingsModal = ({ initialSection, adminData, setAdminData, onClose }) => {
  const queryClient = useQueryClient();
  const [section, setSection] = useState(initialSection);

  // Profile form state
  const [profileForm, setProfileForm] = useState({ name: adminData?.name || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Email change state
  const [emailForm, setEmailForm] = useState({ newEmail: '', currentEmail: adminData?.email || '' });
  const [emailErrors, setEmailErrors] = useState({});
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);
  const [emailChangeOtp, setEmailChangeOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [securityErrors, setSecurityErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)) {
        toast.error('Only JPG/PNG images are allowed');
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        toast.error('Image size must be under 2MB');
        return;
      }
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.name) errors.name = 'Identity name is required';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmail = () => {
    const errors = {};
    if (!emailForm.newEmail) errors.newEmail = 'New email required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) errors.newEmail = 'Invalid communication format';
    else if (emailForm.newEmail === adminData?.email) errors.newEmail = 'Must be separate from current email';
    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const profileMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (profileForm.name) fd.append('name', profileForm.name);
      if (file) fd.append('profilePicture', file);
      return apiClient.put('/admin/profile', fd);
    },
    onSuccess: (res) => {
      toast.success('Profile updated', { icon: '🔄' });
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.name) user.name = res.data.name;
      if (res.data.profilePicture) user.profilePicture = res.data.profilePicture;
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminData(user);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const requestEmailChangeMutation = useMutation({
    mutationFn: async () => apiClient.post('/auth/request-email-change', { username: adminData?.username, newEmail: emailForm.newEmail }),
    onSuccess: (res) => {
      toast.success(res.data.message, { icon: '📧' });
      setEmailChangeRequested(true);
      setResendCooldown(30);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  });

  const resendEmailOtpMutation = useMutation({
    mutationFn: async () => apiClient.post('/auth/resend-otp', { username: adminData?.username }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setResendCooldown(30);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Resend failed'),
  });

  const verifyEmailChangeMutation = useMutation({
    mutationFn: async () => apiClient.post('/auth/verify-email-change', { username: adminData?.username, otp: emailChangeOtp, newEmail: emailForm.newEmail }),
    onSuccess: (res) => {
      toast.success('Email successfully verified and updated', { icon: '✅' });
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      user.email = res.data.email;
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminData(user);
      setEmailChangeRequested(false);
      setEmailChangeOtp('');
      setEmailForm(prev => ({ ...prev, newEmail: '' }));
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Incorrect verification code'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    profileMutation.mutate();
  };

  const handleEmailRequest = (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    requestEmailChangeMutation.mutate();
  };

  const handleEmailVerify = (e) => {
    e.preventDefault();
    if (!emailChangeOtp) return toast.error('Verification code required');
    verifyEmailChangeMutation.mutate();
  };

  const validateSecurity = () => {
    const errors = {};
    if (securityForm.newPassword && !securityForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (securityForm.newPassword && securityForm.newPassword.length < 6) errors.newPassword = 'New password must be 6+ characters';
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match';
    if (!securityForm.newUsername && !securityForm.newPassword) errors.general = 'Please provide an update to save';
    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const securityMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (securityForm.newUsername) fd.append('newUsername', securityForm.newUsername);
      if (securityForm.currentPassword) fd.append('currentPassword', securityForm.currentPassword);
      if (securityForm.newPassword) fd.append('newPassword', securityForm.newPassword);
      return apiClient.put('/admin/profile', fd);
    },
    onSuccess: (res) => {
      toast.success('Security settings updated');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.username) { user.username = res.data.username; localStorage.setItem('adminUser', JSON.stringify(user)); setAdminData(user); }
      if (res.data.token) localStorage.setItem('adminToken', res.data.token);
      setSecurityForm({ newUsername: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Security update failed'),
  });

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (!validateSecurity()) return;
    securityMutation.mutate();
  };

  const tabCls = (id) =>
    `flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${section === id ? 'text-teal-600' : 'text-gray-400 hover:text-gray-900 group'}`;

  const inputCls = (err) => `w-full pl-14 pr-6 py-5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all font-bold text-sm ${err ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-teal-500/5 focus:border-teal-500/20'}`;

  const getAvatarSrc = () => {
    if (previewUrl) return previewUrl;
    if (adminData?.profilePicture) {
      return adminData.profilePicture.startsWith('http')
        ? adminData.profilePicture
        : `http://localhost:5000${adminData.profilePicture}`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-[200] p-4 animate-in fade-in duration-500" onClick={onClose}>
      <div className="bg-white rounded-[40px] lg:rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
        
        <div className="absolute top-0 right-0 p-12 text-teal-500 opacity-5 -z-10 rotate-12"><SecurityDecoration className="w-64 h-64" /></div>

        <div className="p-6 lg:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-3 lg:p-4 bg-white rounded-[18px] lg:rounded-[24px] shadow-sm text-teal-500 animate-float"><Settings className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Admin Settings</h2>
              <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Tier: Internal Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 lg:p-4 bg-white text-gray-400 hover:text-red-500 rounded-[20px] lg:rounded-3xl shadow-sm transition-all hover:rotate-90"><X className="w-5 h-5 lg:w-6 lg:h-6" /></button>
        </div>

        <div className="flex border-b border-gray-100 shrink-0 bg-white px-2 overflow-x-auto no-scrollbar">
          <button className={tabCls('profile')} onClick={() => setSection('profile')}>
            <UserCircle className="w-5 h-5" /> Profile Identity
            {section === 'profile' && <div className="absolute bottom-0 left-8 right-8 h-1 bg-teal-500 rounded-full" />}
          </button>
          <button className={tabCls('security')} onClick={() => setSection('security')}>
            <KeyRound className="w-5 h-5" /> Safety Protocols
            {section === 'security' && <div className="absolute bottom-0 left-8 right-8 h-1 bg-teal-500 rounded-full" />}
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-6 lg:p-10 no-scrollbar">
          {section === 'profile' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <form onSubmit={handleProfileSubmit} className="space-y-10 bg-gray-50/50 p-8 rounded-[40px] border border-gray-100">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group w-24 h-24 lg:w-32 lg:h-32">
                    <div className="absolute -inset-2 bg-teal-500/20 rounded-[44px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    {getAvatarSrc() ? (
                      <img src={getAvatarSrc()} alt="Avatar" className="w-24 h-24 lg:w-32 lg:h-32 rounded-[32px] lg:rounded-[40px] object-cover border-4 border-white shadow-premium relative z-10" />
                    ) : (
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[32px] lg:rounded-[40px] bg-gray-900 text-white flex items-center justify-center font-black text-4xl lg:text-5xl border-4 border-white shadow-premium relative z-10 italic">
                        {getInitials(profileForm.name || adminData?.username)}
                      </div>
                    )}
                    <label className="absolute inset-0 bg-gray-900/60 rounded-[32px] lg:rounded-[40px] flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                      <Camera className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                    </label>
                  </div>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Identity Hub</div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Full Legal Name</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                      <input type="text" value={profileForm.name} onChange={e => { setProfileForm({ ...profileForm, name: e.target.value }); setProfileErrors({ ...profileErrors, name: '' }); }} className={inputCls(!!profileErrors.name)} placeholder="e.g. Dr. John Doe" />
                    </div>
                    {profileErrors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-6">{profileErrors.name}</p>}
                  </div>
                </div>

                <button type="submit" disabled={profileMutation.isLoading} className="w-full h-16 lg:h-20 bg-gray-900 text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] rounded-[24px] lg:rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                  {profileMutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin text-teal-500" /> : <><Save className="w-5 h-5 text-teal-400" /> Commit Identity</>}
                </button>
              </form>

              <div className="space-y-8 bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium relative overflow-hidden">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-teal-50 rounded-2xl"><Mail className="w-5 h-5 text-teal-600" /></div>
                  <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter">Clinical Communication</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verify & Update Relay Channel</p>
                  </div>
                </div>

                {!emailChangeRequested ? (
                  <form onSubmit={handleEmailRequest} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Target Email Endpoint</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                        <input
                          type="email"
                          required
                          value={emailForm.newEmail}
                          onChange={e => { setEmailForm({ ...emailForm, newEmail: e.target.value }); setEmailErrors({ ...emailErrors, newEmail: '' }); }}
                          className={inputCls(!!emailErrors.newEmail)}
                          placeholder={`Current: ${adminData?.email || 'unlinked'}`}
                        />
                      </div>
                      {emailErrors.newEmail && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-6">{emailErrors.newEmail}</p>}
                    </div>

                    <button type="submit" disabled={requestEmailChangeMutation.isLoading} className="w-full h-16 bg-white border-2 border-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-gray-50 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50">
                      {requestEmailChangeMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Request Migration <Send className="w-4 h-4 text-teal-500" /></>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailVerify} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 mb-6 font-semibold italic text-emerald-800">
                        OTP dispatched to your current registry.
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Security Token</label>
                      <div className="relative group">
                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input type="text" maxLength="6" value={emailChangeOtp} onChange={e => setEmailChangeOtp(e.target.value)} className={inputCls(false)} placeholder="000000" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button type="submit" disabled={verifyEmailChangeMutation.isLoading} className="flex-[2] h-16 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95">
                         {verifyEmailChangeMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finalize Link</>}
                       </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {section === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-10 animate-in fade-in duration-500">
              <div className="bg-gray-900 p-8 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:rotate-12 transition-transform duration-700"><Fingerprint className="w-32 h-32" /></div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-teal-400"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Vault Defense</h3>
                </div>
                <p className="text-gray-400 font-semibold italic text-sm mt-4">Rotate credentials periodically to maintain clinical data integrity.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Administrator Username</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input type="text" value={securityForm.newUsername} onChange={e => setSecurityForm({ ...securityForm, newUsername: e.target.value })} className={inputCls(false)} placeholder={`Current: ${adminData?.username}`} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Current Authorization</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
                    <input type={showCurrent ? 'text' : 'password'} value={securityForm.currentPassword} onChange={e => setSecurityForm({ ...securityForm, currentPassword: e.target.value })} className={inputCls(!!securityErrors.currentPassword)} placeholder="Current Secret" />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">New Cipher</label>
                    <div className="relative group">
                      <input type={showNew ? 'text' : 'password'} value={securityForm.newPassword} onChange={e => setSecurityForm({ ...securityForm, newPassword: e.target.value })} className={inputCls(!!securityErrors.newPassword)} placeholder="New Password" />
                      <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Confirm Cipher</label>
                    <div className="relative group">
                      <input type={showConfirm ? 'text' : 'password'} value={securityForm.confirmNewPassword} onChange={e => setSecurityForm({ ...securityForm, confirmNewPassword: e.target.value })} className={inputCls(!!securityErrors.confirmNewPassword)} placeholder="Repeat" />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={securityMutation.isLoading} className="w-full h-16 lg:h-20 bg-gray-900 text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] rounded-[24px] lg:rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95">
                {securityMutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin text-teal-400" /> : <><CheckCircle2 className="w-5 h-5 text-teal-400" /> Update Security Vault</>}
              </button>
            </form>
          )}
        </div>

        <div className="p-10 border-t border-gray-100 flex items-center justify-center gap-10 grayscale opacity-10">
          <Globe className="w-8 h-8" />
          <Activity className="w-8 h-8" />
          <Sparkles className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState('profile');
  const [adminData, setAdminData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('adminUser');
    if (u) setAdminData(JSON.parse(u));
    if (!localStorage.getItem('adminToken')) navigate('/admin/login');
  }, [navigate]);

  const { data: countData } = useQuery({
    queryKey: ['unreviewedReportsCount'],
    queryFn: async () => (await apiClient.get('/admin/product-reports/count')).data,
    refetchInterval: 30000,
    enabled: !!localStorage.getItem('adminToken')
  });
  const unreviewedCount = countData?.count || 0;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    toast.success('Secure Terminal Logged Out', { icon: '🔐' });
    navigate('/admin/login');
  };

  const openSettings = (section = 'profile') => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  const pageTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview';
  const displayTitle = pageTitle === 'inventory' || pageTitle === 'medicines' ? 'Medicines' : pageTitle;

  const renderAvatar = () => {
    const dim = 'w-10 h-10 text-xs';
    const border = 'border-2 border-white/50';

    if (adminData?.profilePicture) {
      const src = adminData.profilePicture.startsWith('http')
        ? adminData.profilePicture
        : `http://localhost:5000${adminData.profilePicture}`;

      return (
        <img src={src} alt="Avatar" className={`${dim} rounded-3xl object-cover ${border} shadow-premium transition-all duration-300 transform group-hover:scale-105`} />
      );
    }
    return (
      <div className={`${dim} ${border} rounded-[14px] bg-gray-900 flex items-center justify-center text-white font-black shadow-premium animate-in zoom-in duration-500`}>
        {getInitials(adminData?.name || adminData?.username)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex overflow-hidden relative">

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`bg-gray-900 border-r border-gray-800 transition-all duration-500 ease-in-out fixed inset-y-0 left-0 z-[110] lg:relative flex flex-col ${sidebarCollapsed ? 'lg:w-24' : 'lg:w-72'} ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-xl shadow-teal-500/20 rotate-3 group-hover:rotate-12 transition-transform"><Pill className="w-6 h-6" /></div>
            {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-xl font-black text-white tracking-tighter italic">MedWeb.</span>}
          </Link>
          {isMobileMenuOpen && <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard/overview' },
            { id: 'medicines', label: 'Asset Vault', icon: PackageSearch, path: '/admin/dashboard/medicines' },
            { id: 'suppliers', label: 'Logistics', icon: Truck, path: '/admin/dashboard/suppliers' },
            { id: 'feedbacks', label: 'Clinical Feedback', icon: MessageSquare, path: '/admin/dashboard/feedbacks' },
            { id: 'reports', label: 'Incident Reports', icon: Flag, badge: unreviewedCount, path: '/admin/dashboard/reports' },
            { id: 'logs', label: 'Audit Trail', icon: Activity, path: '/admin/dashboard/logs' },
          ].map(t => {
            const Icon = t.icon;
            return (
              <NavLink key={t.id} to={t.path} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${isActive ? 'bg-teal-600 text-white shadow-xl shadow-teal-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">{t.label}</span>}
                    {t.badge > 0 && (!sidebarCollapsed || isMobileMenuOpen) && <span className={`ml-auto px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}>{t.badge}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button onClick={() => { openSettings('profile'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
            <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform" />
            {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">Terminal Settings</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all group">
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">Secure Exit</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <header className="h-24 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 bg-white/70 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="p-3 bg-gray-50 rounded-2xl lg:hidden cursor-pointer hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-5 h-5 text-gray-500" /></div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none truncate">{displayTitle}</h1>
              <div className="text-[9px] lg:text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">Clinical Terminal Connected</span>
                <span className="sm:hidden">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500 transition-colors" />
              <input type="text" placeholder="Quantum search..." className="bg-gray-50 border border-transparent focus:border-teal-100 focus:bg-white pl-11 pr-4 py-3 rounded-2xl text-xs font-bold outline-none w-48 lg:w-64 transition-all focus:w-80" />
            </div>
            <div className="h-10 w-px bg-gray-100 mx-2 hidden md:block" />
            <div className="flex items-center gap-3 lg:gap-4">
              <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl relative"><Bell className="w-5 h-5" /><div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" /></button>
              <div className="flex items-center gap-3 cursor-pointer group p-1 lg:p-1.5 lg:pr-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[22px] transition-all" onClick={() => openSettings('profile')}>
                {renderAvatar()}
                <div className="text-left hidden lg:block">
                  <div className="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-none italic">{adminData?.username || 'Admin'}</div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 leading-none">Security Officer</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 animate-in fade-in duration-700 no-scrollbar">
          {adminData && !adminData.email && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 lg:p-8 rounded-[30px] border border-amber-100 shadow-xl shadow-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-[18px] shadow-sm flex items-center justify-center border border-amber-200"><ShieldAlert className="w-6 h-6 text-amber-500 animate-bounce-slow" /></div>
                <div>
                  <h3 className="text-lg lg:text-xl font-black text-amber-900 tracking-tighter uppercase italic">Secure Email Required</h3>
                  <p className="text-[11px] lg:text-sm text-amber-800/70 font-semibold italic">Protocol breach prevention: Link an encrypted clinical address.</p>
                </div>
              </div>
              <button onClick={() => openSettings('profile')} className="px-10 py-4 bg-amber-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-amber-700 transition-all active:scale-95">Link Endpoint</button>
            </div>
          )}
          <Outlet context={{ adminData }} />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      </main>

      {settingsOpen && (
        <AccountSettingsModal 
          initialSection={settingsSection} 
          adminData={adminData} 
          setAdminData={setAdminData} 
          onClose={() => setSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
