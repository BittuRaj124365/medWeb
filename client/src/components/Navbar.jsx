import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, Search, ShieldAlert, ShoppingCart, Menu, X, Phone, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="fixed top-0 left-0 right-0 z-[60] transition-all duration-300">
        {/* Top Info Bar */}
        <div className={`bg-primary text-white py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 8:00 AM - 10:00 PM</span>
              <span className="hidden sm:flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-teal-200 transition-colors">Our Story</Link>
              <Link to="/privacy-policy" className="hover:text-teal-200 transition-colors">Terms</Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className={`w-full transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-white border-b border-gray-100 py-5'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                  <Pill className="text-white h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl leading-none tracking-tighter text-gray-900">MedShop</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Healthcare</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-2">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Browse', path: '/medicines' },
                  { label: 'About', path: '/about' },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 overflow-hidden group ${
                      location.pathname === link.path ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-primary transition-transform duration-300 transform origin-left ${
                      location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>
                ))}
              </div>

              {/* Search Pill */}
              <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchVal}
                  placeholder="Search your medicine..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium"
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
                  className="p-2.5 text-gray-500 hover:text-primary transition-colors md:hidden glass rounded-xl"
                >
                  <Search className="w-5 h-5" />
                </button>

                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 text-gray-900 hover:text-primary transition-all active:scale-90 group"
                >
                  <div className="glass p-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1 animate-in zoom-in-0">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2.5 text-gray-900 hover:text-primary transition-colors lg:hidden glass rounded-xl"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Expandable Search */}
            <div className={`overflow-hidden transition-all duration-500 ${isMobileSearchVisible ? 'max-h-20 opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchVal}
                  placeholder="What are you looking for?"
                  className="w-full pl-12 pr-4 py-3 text-base bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5"
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <span className="font-black text-2xl tracking-tighter">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Browse Medicines', path: '/medicines' },
                { label: 'About Us', path: '/about' },
                { label: 'Privacy Policy', path: '/privacy-policy' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-4 rounded-2xl font-black text-lg transition-all ${
                    location.pathname === link.path ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-gray-100">
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white font-black rounded-[24px] uppercase tracking-widest text-xs"
              >
                <ShieldAlert className="w-5 h-5" />
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Spacer to prevent content jump */}
      <div className={`transition-all duration-300 ${isScrolled ? 'h-24' : 'h-32'}`} />
    </>
  );
};

export default Navbar;
