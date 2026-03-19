import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout & Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MedicineListingPage from './pages/MedicineListingPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
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

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
