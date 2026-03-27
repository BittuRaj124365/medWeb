import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, X, LayoutGrid, List, Search, ChevronRight, Home, 
  ArrowUpDown, SlidersHorizontal, PackageSearch, RefreshCw,
  ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import MedicineCard from '../components/MedicineCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Custom hook for debounced value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

const MedicineListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync nav search event
  useEffect(() => {
    const handleNavSearch = (e) => setSearchTerm(e.detail);
    window.addEventListener('nav-search', handleNavSearch);
    return () => window.removeEventListener('nav-search', handleNavSearch);
  }, []);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['medicines', { page, category, availability, sort, search: debouncedSearchTerm }],
    queryFn: async () => {
      let url = '/medicines?limit=12';
      
      if (debouncedSearchTerm) {
        url = `/medicines/search?q=${encodeURIComponent(debouncedSearchTerm)}`;
        const res = await apiClient.get(url);
        return { medicines: res.data, page: 1, pages: 1, total: res.data.length };
      }
      
      if (page) url += `&page=${page}`;
      if (category) url += `&category=${category}`;
      if (availability) url += `&availability=${availability}`;
      if (sort) url += `&sort=${sort}`;
      
      const res = await apiClient.get(url);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (!isLoading && debouncedSearchTerm && data?.medicines?.length === 0) {
      toast.error(`No results for "${debouncedSearchTerm}"`, { id: 'no-results' });
    }
  }, [isLoading, debouncedSearchTerm, data?.medicines?.length]);

  const categories = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Vitamins', 'Other'];

  const clearFilters = () => {
    setCategory('');
    setAvailability('');
    setSearchTerm('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* ── MODERN GRADIENT HEADER ── */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Breadcrumbs */}
           <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5 border-b border-transparent hover:border-primary pb-0.5">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-900 border-b border-gray-900 pb-0.5">Browse Pharmacy</span>
           </nav>

           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                    Pharmaceutical <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Inventory.</span>
                  </h1>
                  <p className="text-lg text-gray-500 font-semibold leading-relaxed">
                    Explore our extensive catalog of genuine medications. Filter by clinical category, manufacturer, or availability in real-time.
                  </p>
              </div>
              
              <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-700 delay-200">
                 <div className="p-4 bg-white rounded-[24px] shadow-premium border border-gray-50 flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary font-black text-xs">
                        {data?.total || 0}
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Total Products</div>
                        <div className="text-sm font-black text-gray-900 leading-none italic">In Stock Now</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── MAIN LISTING CONTENT ── */}
      <section className="pb-24 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* ── SIDEBAR FILTERS ── */}
                <aside className={`w-full lg:w-72 flex-shrink-0 animate-in fade-in slide-in-from-left-8 duration-700 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium p-8 sticky top-32 space-y-10">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Clinical Filters</h3>
                            {(category || availability || searchTerm) && (
                                <button onClick={clearFilters} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all group">
                                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Search in Sidebar */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Keyword Search</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Generic or Brand..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Category Select */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Therapeutic Form</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['', ...categories].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setCategory(c); setPage(1); }}
                                        className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                            category === c 
                                                ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                                                : 'text-gray-500 bg-gray-50 hover:bg-gray-100 border border-transparent'
                                        }`}
                                    >
                                        {c === '' ? 'All Medications' : c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Availability Toggle */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Status</label>
                            <div className="flex gap-2">
                                {[
                                    { label: 'All', value: '' },
                                    { label: 'In Stock', value: 'in-stock' },
                                    { label: 'Sold Out', value: 'out-of-stock' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setAvailability(opt.value); setPage(1); }}
                                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                                            availability === opt.value 
                                                ? 'bg-gray-900 text-white shadow-lg' 
                                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button 
                            className="w-full lg:hidden py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase"
                            onClick={() => setShowFiltersMobile(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* ── MAIN PRODUCT SECTION ── */}
                <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    
                    {/* Toolbar */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                                Showing <span className="text-gray-900 underline underline-offset-4 decoration-primary/30">{data?.medicines?.length || 0}</span> results
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-56">
                                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <select 
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 appearance-none cursor-pointer"
                                >
                                    <option value="createdAt">Latest Arrival</option>
                                    <option value="price-asc">Price Lowest</option>
                                    <option value="price-desc">Price Highest</option>
                                    <option value="name-asc">Alphabetical A-Z</option>
                                    <option value="name-desc">Alphabetical Z-A</option>
                                </select>
                            </div>
                            <button 
                                className="lg:hidden p-3.5 bg-gray-900 text-white rounded-2xl shadow-lg active:scale-95"
                                onClick={() => setShowFiltersMobile(true)}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Results Grid/List */}
                    {isLoading ? (
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
                        </div>
                    ) : data?.medicines?.length === 0 ? (
                        <div className="bg-white rounded-[48px] border border-dashed border-gray-200 p-24 text-center space-y-8 animate-in zoom-in-95 duration-500">
                           <div className="relative inline-block">
                                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[40px]" />
                                <div className="relative p-12 bg-gray-50 rounded-[40px]">
                                    <PackageSearch className="w-20 h-20 text-gray-200" />
                                </div>
                           </div>
                           <div className="space-y-3">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none italic">No Medicines Logged</h3>
                                <p className="text-gray-500 font-medium max-w-sm mx-auto">None of our current inventory matches your specific clinical filters.</p>
                           </div>
                           <button 
                                onClick={clearFilters}
                                className="px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-teal-700 transition-all flex items-center gap-3 mx-auto active:scale-95"
                           >
                                <RefreshCw className="w-4 h-4" /> Reset Clinical Filters
                           </button>
                        </div>
                    ) : (
                        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-1' : 'space-y-6'}`}>
                            {data?.medicines?.map((medicine, idx) => (
                                <div 
                                    key={medicine._id} 
                                    className="animate-in fade-in slide-in-from-bottom-8 duration-700" 
                                    style={{ animationDelay: `${idx * 80}ms` }}
                                >
                                    {viewMode === 'grid' ? (
                                        <MedicineCard medicine={medicine} />
                                    ) : (
                                        <div className="card-premium flex flex-col sm:flex-row items-center gap-8 p-6 group">
                                            <div className="w-40 h-40 bg-gray-50 rounded-3xl p-6 flex items-center justify-center border border-gray-50 group-hover:border-primary/20 transition-all shrink-0">
                                                <img 
                                                    src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'} 
                                                    alt={medicine.name}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 w-full text-center sm:text-left space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{medicine.category}</div>
                                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors italic leading-none">{medicine.name}</h3>
                                                        <p className="text-sm font-bold text-gray-400 mt-2">{medicine.manufacturer}</p>
                                                    </div>
                                                    <div className="text-3xl font-black text-gray-900 sm:text-right">₹{medicine.price.toFixed(2)}</div>
                                                </div>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4 border-t border-gray-50">
                                                    <Link 
                                                        to={`/medicines/${medicine._id}`}
                                                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                                    >
                                                        Details
                                                    </Link>
                                                    {medicine.stockQuantity > 0 ? (
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">In Stock • {medicine.stockQuantity} Left</span>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">Out of Stock</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── PREMIUM PAGINATION ── */}
                    {!debouncedSearchTerm && data?.pages > 1 && (
                        <div className="flex justify-center items-center py-20 gap-4">
                            <button 
                                disabled={page === 1}
                                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-white hover:shadow-xl transition-all disabled:opacity-30 active:scale-90"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div className="flex items-center space-x-2">
                                {(() => {
                                    const pages = [];
                                    const totalPages = data.pages;
                                    const maxVisible = 5;
                                    
                                    let start = Math.max(1, page - 2);
                                    let end = Math.min(totalPages, start + maxVisible - 1);
                                    
                                    if (end === totalPages) {
                                        start = Math.max(1, end - maxVisible + 1);
                                    }

                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <button
                                                key={i}
                                                onClick={() => { setPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`w-14 h-14 rounded-[24px] text-sm font-black transition-all ${
                                                    page === i 
                                                        ? 'bg-gray-900 text-white shadow-2xl scale-110 rotate-3 z-10' 
                                                        : 'text-gray-400 bg-white border border-gray-100 hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}
                            </div>

                            <button 
                                disabled={page === data.pages}
                                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-white hover:shadow-xl transition-all disabled:opacity-30 active:scale-90"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
      </section>
    </div>
  );
};

export default MedicineListingPage;
