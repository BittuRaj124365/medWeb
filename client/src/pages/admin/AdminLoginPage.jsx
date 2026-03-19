import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Pill, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return toast.error('Please enter all fields');
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header decoration */}
        <div className="h-32 bg-primary/10 flex items-center justify-center">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center -mb-20 ring-4 ring-white">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="p-8 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-gray-500 mt-1">Sign in to manage inventory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors"
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick fix for the missing ArrowLeft import above, I'll inline it.
const ArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default AdminLoginPage;
