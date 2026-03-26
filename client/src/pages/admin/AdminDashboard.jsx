import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogOut, Settings, KeyRound, LayoutDashboard, PackageSearch, Truck, Activity, MessageSquare } from 'lucide-react';
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
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
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div>
               <h1 className="text-xl font-bold text-gray-900 hidden lg:block">Welcome back, Admin</h1>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" /> <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Tab Render */}
          {renderActiveTab()}
        </div>
      </div>

      {isSettingsOpen && <CredentialsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

// ─── Settings / Credentials Modal ─────────────────────────────────────────────
const CredentialsModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const credentialsMutation = useMutation({
    mutationFn: (data) => apiClient.put('/admin/credentials', data),
    onSuccess: (res) => {
      toast.success(res.data.message || 'Credentials updated!');
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (res.data.username) user.username = res.data.username;
      localStorage.setItem('adminUser', JSON.stringify(user));
      if (res.data.token) localStorage.setItem('adminToken', res.data.token);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update credentials')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) return toast.error('New passwords do not match');
    if (!formData.newUsername && !formData.newPassword) return toast.error('Provide at least a username or password');
    credentialsMutation.mutate({
      currentPassword: formData.currentPassword,
      newUsername: formData.newUsername || undefined,
      newPassword: formData.newPassword || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2"><KeyRound className="w-5 h-5 text-primary" /> Credentials</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-sm font-medium mb-1">Current Password *</label><input required type="password" value={formData.currentPassword} onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">New Credentials</p>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">New Username</label><input type="text" value={formData.newUsername} onChange={e => setFormData({ ...formData, newUsername: e.target.value })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" value={formData.confirmNewPassword} onChange={e => setFormData({ ...formData, confirmNewPassword: e.target.value })} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none" /></div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t mt-4">
             <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
             <button type="submit" disabled={credentialsMutation.isLoading} className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium">{credentialsMutation.isLoading ? 'Saving...' : 'Save'}</button>
          </div>
         </form>
       </div>
    </div>
  );
};

export default AdminDashboard;
