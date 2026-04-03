import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoInternetBanner from './components/NoInternetBanner';

// Pages
import HomePage from './pages/HomePage';
import MedicineListingPage from './pages/MedicineListingPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResetPasswordPage from './pages/admin/AdminResetPasswordPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';

// Admin Tabs
import OverviewTab from './components/admin/OverviewTab';
import InventoryTab from './components/admin/InventoryTab';
import SuppliersTab from './components/admin/SuppliersTab';
import LogsTab from './components/admin/LogsTab';
import FeedbacksTab from './components/admin/FeedbacksTab';
import ReportsTab from './components/admin/ReportsTab';
import ProtectedRoute from './components/admin/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-textMain pt-8">
            {/* Announcement Bar */}
            <div className="fixed top-0 left-0 right-0 z-[70] bg-teal-500 text-white py-1.5 px-4 flex items-center justify-center shadow-md">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                All medicines are genuine and sourced directly from manufacturers
              </p>
            </div>
            
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/medicines" element={<MedicineListingPage />} />
                <Route path="/medicines/:id" element={<MedicineDetailPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />}>
                    <Route index element={<OverviewTab />} />
                    <Route path="overview" element={<OverviewTab />} />
                    <Route path="medicines" element={<InventoryTab />} />
                    <Route path="suppliers" element={<SuppliersTab />} />
                    <Route path="feedbacks" element={<FeedbacksTab />} />
                    <Route path="reports" element={<ReportsTab />} />
                    <Route path="logs" element={<LogsTab />} />
                    <Route path="settings" element={<OverviewTab />} /> {/* Settings handled via modal or sub-path */}
                  </Route>

                  {/* Top-level aliases centered around /admin/ as requested */}
                  <Route path="/admin/medicines" element={<Navigate to="/admin/dashboard/medicines" replace />} />
                  <Route path="/admin/feedbacks" element={<Navigate to="/admin/dashboard/feedbacks" replace />} />
                  <Route path="/admin/reports" element={<Navigate to="/admin/dashboard/reports" replace />} />
                  <Route path="/admin/suppliers" element={<Navigate to="/admin/dashboard/suppliers" replace />} />
                  <Route path="/admin/logs" element={<Navigate to="/admin/dashboard/logs" replace />} />
                  <Route path="/admin/settings" element={<Navigate to="/admin/dashboard/settings" replace />} />
                </Route>

                <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <NoInternetBanner />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
