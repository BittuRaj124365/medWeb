import { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LogOut, Settings, LayoutDashboard, PackageSearch, Truck,
  Activity, MessageSquare, Flag, KeyRound, UserCircle, Camera,
  User, Mail, Lock, Eye, EyeOff, CheckCircle2, X, Save, 
  ChevronRight, ShieldCheck, Fingerprint, Bell, Search, 
  Menu, MoreVertical, Globe, Sparkles, Pill, Loader2,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  (name || 'A').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState('profile'); // 'profile' | 'security'
  const [adminData, setAdminData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('adminUser');
    if (u) setAdminData(JSON.parse(u));
  }, []);

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
    toast.success('Security clearance revoked', { icon: '🔐' });
    navigate('/admin/login');
  };

  const openSettings = (section = 'profile') => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  const pageTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview';
  const displayTitle = pageTitle === 'inventory' || pageTitle === 'medicines' ? 'Medicines' : pageTitle;

  const renderAvatar = (size = 'md') => {
    const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-xs';
    const border = size === 'lg' ? 'border-4 border-white' : 'border-2 border-white/50';
    
    if (adminData?.profilePicture) {
      const src = adminData.profilePicture.startsWith('http')
        ? adminData.profilePicture
        : `http://localhost:5000${adminData.profilePicture}`;
      
      return (
        <img 
          src={src} 
          alt="Avatar" 
          className={`${dim} rounded-3xl object-cover ${border} shadow-premium transition-all duration-300 transform group-hover:scale-105`} 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }
    
    return (
      <div className={`${dim} ${border} rounded-3xl bg-gray-900 flex items-center justify-center text-white font-black shadow-premium animate-in zoom-in duration-500`}>
        {getInitials(adminData?.name || adminData?.username)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex overflow-hidden relative">
      
      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`bg-gray-900 border-r border-gray-800 transition-all duration-500 ease-in-out fixed inset-y-0 left-0 z-[110] lg:relative flex flex-col 
        ${sidebarCollapsed ? 'lg:w-24' : 'lg:w-72'} 
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Sidebar Header */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
           <Link to="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 transition-transform group-hover:rotate-12">
                <Pill className="w-6 h-6" />
              </div>
              {(!sidebarCollapsed || isMobileMenuOpen) && (
                <span className="text-xl font-black text-white tracking-tighter italic animate-in fade-in slide-in-from-left-2 transition-all">MedWeb.</span>
              )}
           </Link>
           {isMobileMenuOpen && (
             <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
               <X className="w-6 h-6" />
             </button>
           )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
            {[
                { id: 'overview',  label: 'Control Center',  icon: LayoutDashboard, path: '/admin/dashboard/overview' },
                { id: 'medicines', label: 'Medicine Records', icon: PackageSearch, path: '/admin/dashboard/medicines' },
                { id: 'suppliers', label: 'Medicine Suppliers', icon: Truck, path: '/admin/dashboard/suppliers' },
                { id: 'feedbacks', label: 'Patient Reviews', icon: MessageSquare, path: '/admin/dashboard/feedbacks' },
                { id: 'reports',   label: 'Medicine Reports', icon: Flag, badge: unreviewedCount, path: '/admin/dashboard/reports' },
                { id: 'logs',      label: 'System Activity', icon: Activity, path: '/admin/dashboard/logs' },
            ].map(t => {
                const Icon = t.icon;
                return (
                    <NavLink 
                        key={t.id} 
                        to={t.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${
                            isActive 
                                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {({ isActive }) => (
                          <>
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                            {(!sidebarCollapsed || isMobileMenuOpen) && (
                                <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">{t.label}</span>
                            )}
                            {t.badge > 0 && (!sidebarCollapsed || isMobileMenuOpen) && (
                                <span className={`ml-auto px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                                    {t.badge}
                                </span>
                            )}
                            {t.badge > 0 && sidebarCollapsed && !isMobileMenuOpen && (
                                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900" />
                            )}
                          </>
                        )}
                    </NavLink>
                );
            })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-white/5 space-y-2">
            <button 
                onClick={() => { openSettings('profile'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
            >
                <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform" />
                {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">Settings</span>}
            </button>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
                <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
                {(!sidebarCollapsed || isMobileMenuOpen) && <span className="text-[11px] font-black uppercase tracking-widest pt-0.5">Logout</span>}
            </button>
        </div>

        {/* Toggle Collapse */}
        <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-28 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white border-4 border-[#F8FAFB] shadow-lg hover:scale-110 transition-all z-40 hidden lg:flex"
        >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-500 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        
        {/* Glass Header */}
        <header className="h-24 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 bg-white/70 backdrop-blur-xl border-b border-gray-100">
             <div className="flex items-center gap-4 lg:gap-6">
                 <div className="p-3 bg-gray-50 rounded-2xl lg:hidden cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
                     <Menu className="w-5 h-5 text-gray-500" />
                 </div>
                 <div>
                    <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none truncate max-w-[150px] sm:max-w-none">
                      {displayTitle}
                    </h1>
                    <div className="text-[9px] lg:text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="hidden sm:inline">Live Medicine Feed Active</span>
                       <span className="sm:hidden">Live Feed</span>
                    </div>
                 </div>
             </div>

             <div className="flex items-center gap-3 lg:gap-6">
                 <div className="relative group hidden md:block">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                     <input 
                         type="text" 
                         placeholder="Quick explore..." 
                         className="bg-gray-50 border border-transparent focus:border-gray-100 focus:bg-white pl-11 pr-4 py-3 rounded-2xl text-xs font-bold outline-none w-48 lg:w-64 transition-all focus:w-80"
                     />
                 </div>
                 
                 <div className="h-10 w-px bg-gray-100 mx-2 hidden md:block" />
 
                 <div className="flex items-center gap-3 lg:gap-4">
                     <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all relative">
                         <Bell className="w-5 h-5" />
                         <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                     </button>
                     <div 
                         className="flex items-center gap-3 cursor-pointer group p-1 lg:p-1.5 lg:pr-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[22px] transition-all"
                         onClick={() => openSettings('profile')}
                     >
                         {renderAvatar()}
                         <div className="text-left hidden lg:block">
                             <div className="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-none italic">{adminData?.username || 'Admin'}</div>
                             <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 leading-none">Security Level 4</div>
                         </div>
                     </div>
                 </div>
             </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 animate-in fade-in duration-700">
           {/* No-email warning */}
           {adminData && !adminData.email && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 lg:p-8 rounded-[30px] lg:rounded-[40px] border border-amber-100 shadow-xl shadow-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-8 duration-1000">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-[18px] lg:rounded-[24px] shadow-sm flex items-center justify-center border border-amber-200 shrink-0"><ShieldAlert className="w-6 h-6 lg:w-8 lg:h-8 text-amber-500 animate-bounce-slow" /></div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg lg:text-xl font-black text-amber-900 tracking-tighter uppercase italic">Email Verification Required</h3>
                  <p className="text-[11px] lg:text-sm text-amber-800/70 font-semibold italic">Link a verified clinical email to enable advanced 2-Factor Authentication protocols.</p>
                </div>
              </div>
              <button onClick={() => openSettings('profile')} className="w-full sm:w-auto px-10 py-4 bg-amber-600 text-white text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all active:scale-95 whitespace-nowrap">
                Initialize Linking
              </button>
            </div>
           )}

           <Outlet />
        </div>

        {/* Background Ambient Layers */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      </main>

      {/* ── ACCOUNT SETTINGS MODAL ── */}
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

// ─── Account Settings Modal ─────────────────────
const AccountSettingsModal = ({ initialSection, adminData, setAdminData, onClose }) => {
  const queryClient = useQueryClient();
  const [section, setSection] = useState(initialSection);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: adminData?.name || '',
    email: adminData?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
        toast.error('Clinical logs only accept JPG/PNG metrics');
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        toast.error('Dossier size exceeds 2MB limit');
        return;
      }
      setFile(f); 
      setPreviewUrl(URL.createObjectURL(f)); 
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.email) errors.email = 'Primary contact log required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errors.email = 'Invalid communication channel';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const profileMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (profileForm.name)  fd.append('name',  profileForm.name);
      if (profileForm.email) fd.append('email', profileForm.email);
      if (file) fd.append('profilePicture', file);
      return apiClient.put('/admin/profile', fd);
    },
    onSuccess: (res) => {
      toast.success('System Profile Synchronized', { icon: '🔄' });
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.name)           user.name = res.data.name;
      if (res.data.email)          user.email = res.data.email;
      if (res.data.profilePicture) user.profilePicture = res.data.profilePicture;
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminData(user);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Synchronization Failure'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    profileMutation.mutate();
  };

  const validateSecurity = () => {
    const errors = {};
    if (securityForm.newPassword && !securityForm.currentPassword) errors.currentPassword = 'Master key verification required';
    if (securityForm.newPassword && securityForm.newPassword.length < 6) errors.newPassword = 'New key must be 6+ identifiers';
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmNewPassword) errors.confirmNewPassword = 'Key parity mismatch';
    if (!securityForm.newUsername && !securityForm.newPassword) errors.general = 'Identify a specific update parameter';
    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const securityMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (securityForm.newUsername)     fd.append('newUsername',     securityForm.newUsername);
      if (securityForm.currentPassword) fd.append('currentPassword', securityForm.currentPassword);
      if (securityForm.newPassword)     fd.append('newPassword',     securityForm.newPassword);
      return apiClient.put('/admin/profile', fd);
    },
    onSuccess: (res) => {
      toast.success('Security Protocols Updated');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.username) { user.username = res.data.username; localStorage.setItem('adminUser', JSON.stringify(user)); setAdminData(user); }
      if (res.data.token)    localStorage.setItem('adminToken', res.data.token);
      setSecurityForm({ newUsername: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Access Modification Failed'),
  });

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (!validateSecurity()) return;
    securityMutation.mutate();
  };

  const tabCls = (id) =>
    `flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${section === id ? 'text-primary' : 'text-gray-400 hover:text-gray-900 group'}`;

  const inputCls = (err) => `w-full pl-14 pr-6 py-5 bg-gray-50 border rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all font-bold text-sm ${err ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-primary/5 focus:border-primary/20'}`;

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
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-12 text-primary opacity-5 -z-10 rotate-12"><Security className="w-64 h-64" /></div>

        {/* Modal header */}
        <div className="p-6 lg:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-3 lg:p-4 bg-white rounded-[18px] lg:rounded-[24px] shadow-sm text-primary animate-float"><Settings className="w-5 h-5 lg:w-6 lg:h-6" /></div>
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tighter italic uppercase">Admin Settings</h2>
              <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Account Parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 lg:p-4 bg-white text-gray-400 hover:text-red-500 rounded-[20px] lg:rounded-3xl shadow-sm transition-all hover:rotate-90"><X className="w-5 h-5 lg:w-6 lg:h-6" /></button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-gray-100 shrink-0 bg-white px-2 overflow-x-auto no-scrollbar">
          <button className={tabCls('profile')} onClick={() => setSection('profile')}>
            <UserCircle className="w-5 h-5" /> Profile Settings
            {section === 'profile' && <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary rounded-full animate-in slide-in-from-bottom-2" />}
          </button>
          <button className={tabCls('security')} onClick={() => setSection('security')}>
            <KeyRound className="w-5 h-5" /> Security Protocol
            {section === 'security' && <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary rounded-full animate-in slide-in-from-bottom-2" />}
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-6 lg:p-10 no-scrollbar">

          {/* ── PROFILE SECTION ── */}
          {section === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-10 animate-in fade-in duration-500">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative group w-24 h-24 lg:w-32 lg:h-32">
                  <div className="absolute -inset-2 bg-primary/20 rounded-[44px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Identity Photo</div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className={inputCls(false)} placeholder="e.g. Dr. John Doe" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={e => { setProfileForm({...profileForm, email: e.target.value}); setProfileErrors({...profileErrors, email: ''}); }}
                      className={inputCls(!!profileErrors.email)}
                      placeholder="Verified email log"
                    />
                  </div>
                  {profileErrors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-6">{profileErrors.email}</p>}
                </div>
              </div>

              <button type="submit" disabled={profileMutation.isLoading} className="w-full h-16 lg:h-20 bg-gray-900 text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] rounded-[24px] lg:rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                {profileMutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <><Save className="w-5 h-5 text-primary" /> Save Changes</>}
              </button>
            </form>
          )}

          {/* ── SECURITY SECTION ── */}
          {section === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-10 animate-in fade-in duration-500">
              <div className="bg-gray-900 p-6 lg:p-8 rounded-[30px] lg:rounded-[40px] text-white space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:rotate-12 transition-transform duration-700"><Fingerprint className="w-32 h-32" /></div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                    <h3 className="text-lg lg:text-xl font-black italic uppercase tracking-tighter">Login Security</h3>
                </div>
                <p className="text-gray-400 font-semibold italic text-[11px] lg:text-sm">Change your username or update your password regularly to keep your account safe.</p>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Username</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={securityForm.newUsername}
                        onChange={e => setSecurityForm({...securityForm, newUsername: e.target.value})}
                        className={inputCls(false)}
                        placeholder={`Current: ${adminData?.username || 'admin'}`}
                      />
                    </div>
                 </div>

                 <div className="h-px bg-gray-50" />

                 <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Current Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            <input
                            type={showCurrent ? 'text' : 'password'}
                            value={securityForm.currentPassword}
                            onChange={e => { setSecurityForm({...securityForm, currentPassword: e.target.value}); setSecurityErrors({...securityErrors, currentPassword: ''}); }}
                            className={inputCls(!!securityErrors.currentPassword)}
                            placeholder="Current Password"
                            />
                            <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {securityErrors.currentPassword && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-6">{securityErrors.currentPassword}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">New Password</label>
                            <div className="relative group">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={securityForm.newPassword}
                                    onChange={e => { setSecurityForm({...securityForm, newPassword: e.target.value}); setSecurityErrors({...securityErrors, newPassword: ''}); }}
                                    className={inputCls(!!securityErrors.newPassword)}
                                    placeholder="6+ characters"
                                />
                                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4 italic">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={securityForm.confirmNewPassword}
                                    onChange={e => { setSecurityForm({...securityForm, confirmNewPassword: e.target.value}); setSecurityErrors({...securityErrors, confirmNewPassword: ''}); }}
                                    className={inputCls(!!securityErrors.confirmNewPassword)}
                                    placeholder="Repeat Password"
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {(securityErrors.newPassword || securityErrors.confirmNewPassword) && (
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 text-center">Passwords must match</p>
                    )}
                 </div>
              </div>

              {securityErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl text-center">{securityErrors.general}</div>
              )}

              <button type="submit" disabled={securityMutation.isLoading} className="w-full h-16 lg:h-20 bg-gray-900 text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] rounded-[24px] lg:rounded-[32px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95">
                {securityMutation.isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <><CheckCircle2 className="w-5 h-5 text-primary" /> Update Password</>}
              </button>
            </form>
          )}

        </div>
        
        {/* Modal Footer proofs */}
        <div className="p-8 border-t border-gray-100 flex items-center justify-center gap-10 grayscale opacity-10">
            <Globe className="w-8 h-8" />
            <Activity className="w-8 h-8" />
            <Sparkles className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const Security = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
    </svg>
)

export default AdminDashboard;
