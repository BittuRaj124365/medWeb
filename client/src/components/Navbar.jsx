import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, Search, ShieldAlert, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  const handleSearch = (val) => {
    setSearchVal(val);
    window.dispatchEvent(new CustomEvent('nav-search', { detail: val }));
    if (location.pathname !== '/medicines' && val.trim().length > 2) {
      navigate(`/medicines?search=${encodeURIComponent(val)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchVal)}`);
      setIsMobileSearchVisible(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Pill className="text-white h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-primary hidden sm:block">
                MedShop
              </span>
            </Link>

            {/* Desktop Nav links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === '/' ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>Home</Link>
              <Link to="/medicines" className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${location.pathname === '/medicines' ? 'text-primary bg-primary/5' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`}>Browse</Link>
            </div>

            {/* Desktop Search */}
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                placeholder="Search medicines..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
                className="p-2 text-gray-500 hover:text-primary transition-colors md:hidden"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors border border-transparent hover:border-primary/20 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4 text-primary" />
                Admin
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-primary transition-all active:scale-95"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-primary transition-colors lg:hidden"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Expandable) */}
          {isMobileSearchVisible && (
            <div className="pb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchVal}
                  placeholder="Search medicines..."
                  className="w-full pl-10 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-1 shadow-inner">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-bold ${location.pathname === '/' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
            >
              Home
            </Link>
            <Link
              to="/medicines"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-bold ${location.pathname === '/medicines' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
            >
              Browse
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-bold text-gray-600 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-primary" /> Admin Portal
            </Link>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
