import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogOut, Settings, UserCircle, KeyRound, LayoutDashboard, PackageSearch, Truck, Activity, MessageSquare, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

// Tab Components
import OverviewTab from '../../components/admin/OverviewTab';
import InventoryTab from '../../components/admin/InventoryTab';
import SuppliersTab from '../../components/admin/SuppliersTab';
import LogsTab from '../../components/admin/LogsTab';
import FeedbacksTab from '../../components/admin/FeedbacksTab';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      setAdminData(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: PackageSearch },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { id: 'logs', label: 'Logs', icon: Activity },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'inventory': return <InventoryTab />;
      case 'suppliers': return <SuppliersTab />;
      case 'feedbacks': return <FeedbacksTab />;
      case 'logs': return <LogsTab />;
      default: return <OverviewTab />;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderAvatar = () => {
    if (adminData?.profilePicture) {
      const imgUrl = adminData.profilePicture.startsWith('http') 
        ? adminData.profilePicture 
        : `http://localhost:5000${adminData.profilePicture}`;
        
      return (
        <img 
          src={imgUrl} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      );
    }
    // Fallback initials
    return (
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
        {getInitials(adminData?.name || adminData?.username)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row gap-6 mb-12">
        {/* Sidebar Sidebar/Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 font-bold text-xl text-primary flex items-center gap-2 tracking-tight">
            Dashboard
          </div>
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 text-sm font-medium ${activeTab === t.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Icon className="w-5 h-5" /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {adminData && !adminData.email && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Email Address Required</h3>
                  <p className="text-sm opacity-90">Please add your email address in account settings to enable secure OTP login.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 transition"
              >
                Add Email
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
               {renderAvatar()}
               <div className="hidden sm:block">
                 <p className="text-sm font-medium text-gray-400 leading-tight">Welcome back,</p>
                 <h1 className="text-lg font-bold text-gray-900 leading-tight">{adminData?.name || adminData?.username || 'Admin'}</h1>
               </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3 justify-end">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                title="Account Settings"
              >
                <Settings className="w-5 h-5" /> <span className="hidden lg:inline text-sm font-medium">Account Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" /> <span className="hidden lg:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Tab Render */}
          {renderActiveTab()}
        </div>
      </div>

      {isSettingsOpen && <AccountSettingsModal onClose={() => setIsSettingsOpen(false)} adminData={adminData} setAdminData={setAdminData} />}
    </div>
  );
};

// ─── Account Settings Modal ─────────────────────────────────────────────
const AccountSettingsModal = ({ onClose, adminData, setAdminData }) => {
  const [formData, setFormData] = useState({
    name: adminData?.name || '',
    email: adminData?.email || '',
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
       setFile(selectedFile);
       setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const accountMutation = useMutation({
    mutationFn: async () => {
      const uploadData = new FormData();
      if (formData.name) uploadData.append('name', formData.name);
      if (formData.email) uploadData.append('email', formData.email);
      if (formData.newUsername) uploadData.append('newUsername', formData.newUsername);
      if (formData.currentPassword) uploadData.append('currentPassword', formData.currentPassword);
      if (formData.newPassword) uploadData.append('newPassword', formData.newPassword);
      if (file) uploadData.append('profilePicture', file);

      const res = await apiClient.put('/admin/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.data.message || 'Account settings updated successfully!');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.name) user.name = res.data.name;
      if (res.data.username) user.username = res.data.username;
      if (res.data.email) user.email = res.data.email;
      if (res.data.profilePicture) user.profilePicture = res.data.profilePicture;
      
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminData(user); // trigger re-render
      
      if (res.data.token) localStorage.setItem('adminToken', res.data.token);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update account')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      return toast.error('New passwords do not match');
    }
    if (formData.newPassword && !formData.currentPassword) {
      return toast.error('Current password is required to set a new password');
    }
    accountMutation.mutate();
  };

  const getInitials = (n) => {
    if (!n) return 'A';
    return n.split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Settings className="w-6 h-6 text-primary" /> Account Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto bg-white flex-grow">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
             <div className="relative group cursor-pointer w-24 h-24">
               {previewUrl || adminData?.profilePicture ? (
                 <img 
                   src={previewUrl || (adminData.profilePicture.startsWith('http') ? adminData.profilePicture : `http://localhost:5000${adminData.profilePicture}`)} 
                   alt="Preview" 
                   className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                 />
               ) : (
                 <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl border-4 border-primary/20 shadow-sm">
                   {getInitials(formData.name || adminData?.username)}
                 </div>
               )}
               <label className="absolute inset-0 bg-black/40 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
               </label>
             </div>
             <p className="text-xs text-gray-500 font-medium">Click to upload avatar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
               <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Admin Name" />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
               <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="admin@example.com" />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
               <input type="text" value={formData.newUsername} onChange={e => setFormData({ ...formData, newUsername: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder={adminData?.username || ''} />
            </div>
          </div>

          <div className="border-t pt-6 border-gray-100 mt-2">
            <p className="text-sm text-gray-800 mb-4 font-bold flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary"/> Change Password</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium mb-1 text-gray-600">Current Password (Required to change password)</label>
                 <input type="password" value={formData.currentPassword} onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Enter current password" />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-600">New Password</label>
                 <input type="password" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Leave blank to keep same" />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1 text-gray-600">Confirm New Password</label>
                 <input type="password" value={formData.confirmNewPassword} onChange={e => setFormData({ ...formData, confirmNewPassword: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Leave blank to keep same" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6 sticky bottom-0 bg-white">
             <button type="button" onClick={onClose} className="px-5 py-2.5 border text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors">Cancel</button>
             <button type="submit" disabled={accountMutation.isLoading} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-70">
               {accountMutation.isLoading ? 'Saving...' : 'Save Account Settings'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
