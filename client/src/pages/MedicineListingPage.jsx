import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
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
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync nav search event
  useEffect(() => {
    const handleNavSearch = (e) => setSearchTerm(e.detail);
    window.addEventListener('nav-search', handleNavSearch);
    return () => window.removeEventListener('nav-search', handleNavSearch);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['medicines', { page, category, availability, sort, search: debouncedSearchTerm }],
    queryFn: async () => {
      let url = '/medicines?limit=12';
      
      // If we have a debounced search term, use the search endpoint instead
      if (debouncedSearchTerm) {
        url = `/medicines/search?q=${encodeURIComponent(debouncedSearchTerm)}`;
        const res = await apiClient.get(url);
        // Map the search array result to the same format as list result
        return { medicines: res.data, page: 1, pages: 1, total: res.data.length };
      }
      
      if (page) url += `&page=${page}`;
      if (category) url += `&category=${category}`;
      if (availability) url += `&availability=${availability}`;
      if (sort) url += `&sort=${sort}`;
      
      const res = await apiClient.get(url);
      return res.data;
    },
    keepPreviousData: true
  });

  // Toast when search has no results
  useEffect(() => {
    if (!isLoading && debouncedSearchTerm && data?.medicines?.length === 0) {
      toast.error(`No medicines found for "${debouncedSearchTerm}"`, { id: 'no-results', duration: 3000 });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-textMain">Medicines Inventory</h1>
        <button 
          className="md:hidden flex items-center gap-2 border px-4 py-2 rounded-lg"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`w-full md:w-64 flex-shrink-0 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm sticky top-24 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Filters</h3>
              {(category || availability || searchTerm) && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 flex items-center">
                  <X className="w-3 h-3 mr-1" /> Clear
                </button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <input 
                type="text"
                placeholder="Name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <select 
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full text-sm p-2 border border-gray-200 rounded-md outline-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
              <select 
                value={availability}
                onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                className="w-full text-sm p-2 border border-gray-200 rounded-md outline-none bg-white"
              >
                <option value="">All Availability</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
              <select 
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full text-sm p-2 border border-gray-200 rounded-md outline-none bg-white"
              >
                <option value="createdAt">Newest Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : data?.medicines?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No medicines found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-primary font-medium hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                Showing {data?.medicines?.length} {data?.total ? `out of ${data.total}` : ''} results
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.medicines?.map(medicine => (
                  <MedicineCard key={medicine._id} medicine={medicine} />
                ))}
              </div>
              
              {/* Pagination (Only show if not searching or if multiple pages exist) */}
              {!debouncedSearchTerm && data?.pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {[...Array(data.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        page === i + 1 ? 'bg-primary text-white' : 'border hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={page === data.pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineListingPage;
