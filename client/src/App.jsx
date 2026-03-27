import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { CartProvider } from './context/CartContext';

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
          <div className="flex flex-col min-h-screen bg-background text-textMain">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/medicines" element={<MedicineListingPage />} />
                <Route path="/medicines/:id" element={<MedicineDetailPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
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
