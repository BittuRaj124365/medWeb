import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LogOut, Settings, LayoutDashboard, PackageSearch, Truck,
  Activity, MessageSquare, Flag, KeyRound, UserCircle, Camera,
  User, Mail, Lock, Eye, EyeOff, CheckCircle2, X, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

import OverviewTab  from '../../components/admin/OverviewTab';
import InventoryTab from '../../components/admin/InventoryTab';
import SuppliersTab from '../../components/admin/SuppliersTab';
import LogsTab      from '../../components/admin/LogsTab';
import FeedbacksTab from '../../components/admin/FeedbacksTab';
import ReportsTab   from '../../components/admin/ReportsTab';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  (name || 'A').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState('profile'); // 'profile' | 'security'
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin'); return; }
    const u = localStorage.getItem('adminUser');
    if (u) setAdminData(JSON.parse(u));
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
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const openSettings = (section = 'profile') => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: PackageSearch },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { id: 'reports',   label: 'Reports',   icon: Flag, badge: unreviewedCount },
    { id: 'logs',      label: 'Logs',      icon: Activity },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab />;
      case 'inventory': return <InventoryTab />;
      case 'suppliers': return <SuppliersTab />;
      case 'feedbacks': return <FeedbacksTab />;
      case 'reports':   return <ReportsTab />;
      case 'logs':      return <LogsTab />;
      default:          return <OverviewTab />;
    }
  };

  const renderAvatar = (size = 'md') => {
    const dim = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-10 h-10 text-sm';
    const border = size === 'lg' ? 'border-4 border-white' : 'border-2 border-white';
    
    if (adminData?.profilePicture) {
      // If it starts with http, it's a full URL from the backend. 
      // Otherwise, we prepend the base URL for historical or relative paths.
      const src = adminData.profilePicture.startsWith('http')
        ? adminData.profilePicture
        : `http://localhost:5000${adminData.profilePicture}`;
      
      return (
        <img 
          src={src} 
          alt="Avatar" 
          className={`${dim} rounded-full object-cover ${border} shadow-sm transition-all duration-300 transform hover:scale-105`} 
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    return (
      <div className={`${dim} ${border} rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm animate-in fade-in zoom-in duration-300`}>
        {getInitials(adminData?.name || adminData?.username)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-6 mb-12">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0 space-y-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 font-bold text-xl text-primary tracking-tight">
            Dashboard
          </div>
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 text-sm font-medium ${active ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Icon className="w-5 h-5" />
                  {t.label}
                  {t.badge > 0 && (
                    <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Settings shortcuts */}
          <div className="hidden lg:flex flex-col gap-2 pt-3 border-t border-gray-100">
            <button onClick={() => openSettings('profile')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <UserCircle className="w-5 h-5" /> Profile Settings
            </button>
            <button onClick={() => openSettings('security')} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <KeyRound className="w-5 h-5" /> Security Settings
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-grow min-w-0">
          {/* No-email warning */}
          {adminData && !adminData.email && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full"><Mail className="w-5 h-5 text-amber-600" /></div>
                <div>
                  <h3 className="font-bold text-sm">Email Address Required</h3>
                  <p className="text-sm opacity-90">Add your email to enable secure OTP login.</p>
                </div>
              </div>
              <button onClick={() => openSettings('profile')} className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 transition-colors">Add Email</button>
            </div>
          )}

          {/* Header bar */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              {renderAvatar()}
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gray-400">Welcome back,</p>
                <h1 className="text-lg font-bold text-gray-900">{adminData?.name || adminData?.username || 'Admin'}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openSettings('profile')} className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="hidden lg:inline text-sm font-medium">Settings</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          {renderTab()}
        </div>
      </div>

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

// ─── Account Settings Modal — split Profile + Security ─────────────────────
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
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      // Validate file size (2MB)
      if (f.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setFile(f); 
      setPreviewUrl(URL.createObjectURL(f)); 
    }
  };

  // ── Profile mutation ──
  const validateProfile = () => {
    const errors = {};
    if (!profileForm.email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errors.email = 'Enter a valid email address';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const profileMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (profileForm.name)  fd.append('name',  profileForm.name);
      if (profileForm.email) fd.append('email', profileForm.email);
      if (file) fd.append('profilePicture', file);
      // Let the browser set the content type with the boundary
      return apiClient.put('/admin/profile', fd);
    },
    onSuccess: (res) => {
      toast.success('Profile updated successfully!');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.name)           user.name = res.data.name;
      if (res.data.email)          user.email = res.data.email;
      if (res.data.profilePicture) user.profilePicture = res.data.profilePicture;
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminData(user);
      queryClient.invalidateQueries(['unreviewedReportsCount']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    profileMutation.mutate();
  };

  // ── Security mutation ──
  const validateSecurity = () => {
    const errors = {};
    if (securityForm.newPassword && !securityForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (securityForm.newPassword && securityForm.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmNewPassword) errors.confirmNewPassword = 'Passwords do not match';
    if (!securityForm.newUsername && !securityForm.newPassword) errors.general = 'Enter a new username or new password to save';
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
      toast.success('Security settings updated!');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.username) { user.username = res.data.username; localStorage.setItem('adminUser', JSON.stringify(user)); setAdminData(user); }
      if (res.data.token)    localStorage.setItem('adminToken', res.data.token);
      setSecurityForm({ newUsername: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update security settings'),
  });

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (!validateSecurity()) return;
    securityMutation.mutate();
  };

  const tabCls = (id) =>
    `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${section === id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`;

  const inputCls = 'w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm bg-gray-50 focus:bg-white';
  const inputErr = 'w-full px-3 py-2.5 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-200 outline-none text-sm bg-red-50';

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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">

        {/* Modal header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Account Settings
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b shrink-0 bg-white">
          <button className={tabCls('profile')} onClick={() => setSection('profile')}>
            <UserCircle className="w-4 h-4" /> Profile Settings
          </button>
          <button className={tabCls('security')} onClick={() => setSection('security')}>
            <KeyRound className="w-4 h-4" /> Security Settings
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">

          {/* ── PROFILE SECTION ── */}
          {section === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative group cursor-pointer w-24 h-24">
                  {getAvatarSrc() ? (
                    <img src={getAvatarSrc()} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl border-4 border-primary/20">
                      {getInitials(profileForm.name || adminData?.username)}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-7 h-7 text-white" />
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-400">Click to change profile photo</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className={`${inputCls} pl-9`} placeholder="Admin Name" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={e => { setProfileForm({...profileForm, email: e.target.value}); setProfileErrors({...profileErrors, email: ''}); }}
                      className={`${profileErrors.email ? inputErr : inputCls} pl-9`}
                      placeholder="admin@example.com"
                    />
                  </div>
                  {profileErrors.email && <p className="text-red-500 text-xs mt-1 pl-1">{profileErrors.email}</p>}
                  <p className="text-xs text-gray-400 mt-1.5 pl-1">This email is used for OTP login verification.</p>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={profileMutation.isLoading} className="w-full flex justify-center items-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors">
                  {profileMutation.isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Profile</>}
                </button>
              </div>
            </form>
          )}

          {/* ── SECURITY SECTION ── */}
          {section === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>To change your password, you must provide your current password for verification. Username can be changed without password.</span>
              </div>

              {/* Change Username */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Change Username
                </h3>
                <input
                  type="text"
                  value={securityForm.newUsername}
                  onChange={e => setSecurityForm({...securityForm, newUsername: e.target.value})}
                  className={inputCls}
                  placeholder={`Current: ${adminData?.username || 'admin'}`}
                />
              </div>

              {/* Change Password */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Change Password
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={securityForm.currentPassword}
                      onChange={e => { setSecurityForm({...securityForm, currentPassword: e.target.value}); setSecurityErrors({...securityErrors, currentPassword: ''}); }}
                      className={`${securityErrors.currentPassword ? inputErr : inputCls} pr-10`}
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.currentPassword && <p className="text-red-500 text-xs mt-1 pl-1">{securityErrors.currentPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={securityForm.newPassword}
                      onChange={e => { setSecurityForm({...securityForm, newPassword: e.target.value}); setSecurityErrors({...securityErrors, newPassword: ''}); }}
                      className={`${securityErrors.newPassword ? inputErr : inputCls} pr-10`}
                      placeholder="Min. 6 characters"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.newPassword && <p className="text-red-500 text-xs mt-1 pl-1">{securityErrors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={securityForm.confirmNewPassword}
                      onChange={e => { setSecurityForm({...securityForm, confirmNewPassword: e.target.value}); setSecurityErrors({...securityErrors, confirmNewPassword: ''}); }}
                      className={`${securityErrors.confirmNewPassword ? inputErr : inputCls} pr-10`}
                      placeholder="Re-enter new password"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {securityErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1 pl-1">{securityErrors.confirmNewPassword}</p>}
                </div>
              </div>

              {securityErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">{securityErrors.general}</div>
              )}

              <div className="pt-2">
                <button type="submit" disabled={securityMutation.isLoading} className="w-full flex justify-center items-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-black disabled:opacity-60 transition-colors">
                  {securityMutation.isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Security Settings</>}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
