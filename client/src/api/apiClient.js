import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor — attach admin token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 (stale / invalid token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Redirect to admin login if we're inside the dashboard
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin' && path !== '/admin/reset-password') {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
