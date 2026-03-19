import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Tag, Calendar, Package, Info, CheckCircle2, XCircle, AlertCircle, ShoppingCart } from 'lucide-react';
import apiClient from '../api/apiClient';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useCart } from '../context/CartContext';

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ['medicine', id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-2xl"></div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Medicine not found</h2>
        <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/medicines')} className="text-primary hover:underline">
          Return to directory
        </button>
      </div>
    );
  }

  const isOutOfStock = medicine.stockQuantity === 0;
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < 10;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Image Sidebar */}
          <div className="w-full md:w-5/12 p-8 lg:p-12 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
            <img
              src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'}
              alt={medicine.name}
              className="max-w-full h-auto object-contain mix-blend-multiply"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop';
              }}
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-7/12 p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium">
                {medicine.category}
              </span>

              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-100">
                  <XCircle className="w-4 h-4" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded border border-yellow-100">
                  <AlertCircle className="w-4 h-4" /> Low Stock: Only {medicine.stockQuantity} left
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded border border-green-100">
                  <CheckCircle2 className="w-4 h-4" /> In Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-textMain mb-2">{medicine.name}</h1>
            <p className="text-xl text-gray-500 mb-6">{medicine.genericName}</p>

            {/* Price block */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="text-4xl font-black text-primary">
                {formatPrice(medicine.price)}
              </div>
              
              <button
                onClick={() => addToCart(medicine)}
                disabled={isOutOfStock}
                className={`py-3.5 px-10 flex items-center justify-center gap-2 rounded-2xl font-bold transition-all shadow-lg active:scale-95
                  ${isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-primary text-white hover:bg-teal-700 hover:shadow-primary/20'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Explore'}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-textMain mb-2">
                  <Info className="w-5 h-5 text-gray-400" /> Description
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">
                  {medicine.description || 'No detailed description available for this product.'}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-textMain mb-2">
                  <Info className="w-5 h-5 text-gray-400" /> Usage Instructions
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">
                  {medicine.usageInstructions || 'Please consult your healthcare provider for usage instructions.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t mt-8">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Manufacturer</div>
                    <div className="text-gray-900">{medicine.manufacturer || 'Unknown'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Category</div>
                    <div className="text-gray-900">{medicine.category}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Expiry Date</div>
                    <div className="text-gray-900">{formatDate(medicine.expiryDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Stock</div>
                    <div className="text-gray-900">{medicine.stockQuantity} units</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetailPage;
