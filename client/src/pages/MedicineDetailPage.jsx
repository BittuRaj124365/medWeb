import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Tag, Calendar, Package, Info, CheckCircle2, XCircle, AlertCircle, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useCart } from '../context/CartContext';

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();

  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, message: '', userName: '', userEmail: '' });

  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ['medicine', id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}`);
      return res.data;
    }
  });

  const { data: feedbacks, isLoading: loadingFeedbacks } = useQuery({
    queryKey: ['feedbacks', id],
    queryFn: async () => {
      const res = await apiClient.get(`/medicines/${id}/feedbacks`);
      return res.data;
    },
    enabled: !!id
  });

  const feedbackMutation = useMutation({
    mutationFn: (data) => apiClient.post(`/medicines/${id}/feedbacks`, data),
    onSuccess: () => {
      toast.success('Feedback submitted! It will appear once approved.');
      setFeedbackForm({ rating: 5, message: '', userName: '', userEmail: '' });
      queryClient.invalidateQueries(['feedbacks', id]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error submitting feedback')
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.userName || !feedbackForm.rating) return toast.error('Name and rating are required');
    feedbackMutation.mutate(feedbackForm);
  };

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
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < (medicine.minStockThreshold || 10);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Image Sidebar */}
          <div className="w-full md:w-5/12 p-8 lg:p-12 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
            <img
              src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'}
              alt={medicine.name}
              className="max-w-full h-auto object-contain mix-blend-multiply drop-shadow-lg"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'; }}
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

              {medicine.rating?.count > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded border border-amber-100 ml-auto">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> 
                  {medicine.rating.average.toFixed(1)} <span className="text-amber-600/60 ml-1">({medicine.rating.count} reviews)</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">{medicine.name}</h1>
            <p className="text-xl text-gray-500 mb-6 font-medium">{medicine.genericName}</p>

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
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>

            {/* Accordion-like Details */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-2">
                  <Info className="w-5 h-5 text-gray-400" /> Description
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">
                  {medicine.description || 'No detailed description available for this product.'}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-2">
                  <Info className="w-5 h-5 text-gray-400" /> Usage Instructions
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7">
                  {medicine.usageInstructions || 'Please consult your healthcare provider for usage instructions.'}
                </p>
              </div>

              {/* Grid Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t mt-8">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Manufacturer</div>
                    <div className="text-gray-900 font-medium">{medicine.manufacturer || 'Unknown'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Category</div>
                    <div className="text-gray-900 font-medium">{medicine.category}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Master Expiry Date</div>
                    <div className="text-gray-900 font-medium">{formatDate(medicine.expiryDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Total Stock Available</div>
                    <div className="text-gray-900 font-medium">{medicine.stockQuantity} units</div>
                  </div>
                </div>
              </div>

              {/* Batches Info (If Available) */}
              {medicine.batches?.length > 0 && (
                <div className="pt-6 border-t mt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Available Batches</h3>
                  <div className="space-y-2">
                    {medicine.batches.map((batch, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                         <span className="font-medium text-gray-700">Batch: {batch.batchNumber}</span>
                         <span className="text-gray-500">Exp: {formatDate(batch.expiryDate)}</span>
                         <span className="text-gray-500">Qty: {batch.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> Customer Reviews
          </h2>
          {loadingFeedbacks ? (
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-100 rounded-2xl w-full"></div>
              <div className="h-24 bg-gray-100 rounded-2xl w-full"></div>
            </div>
          ) : feedbacks?.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks?.map(fb => (
                <div key={fb._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                       <h4 className="font-bold text-gray-900">{fb.userName}</h4>
                       <p className="text-xs text-gray-400">{formatDate(fb.dateSubmitted)}</p>
                     </div>
                     <div className="flex items-center text-amber-500">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'fill-amber-500' : 'fill-gray-200 text-gray-200'}`} />
                       ))}
                     </div>
                  </div>
                  {fb.message && <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed">{fb.message}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-black text-slate-900 mb-4">Write a Review</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      type="button" 
                      key={star}
                      onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${star <= feedbackForm.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input required type="text" value={feedbackForm.userName} onChange={e => setFeedbackForm({...feedbackForm, userName: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (Optional)</label>
                <input type="email" value={feedbackForm.userEmail} onChange={e => setFeedbackForm({...feedbackForm, userEmail: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={feedbackForm.message} onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})} className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none" rows="4" placeholder="How was your experience?"></textarea>
              </div>

              <button type="submit" disabled={feedbackMutation.isLoading} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                {feedbackMutation.isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MedicineDetailPage;
