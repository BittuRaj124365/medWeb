import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useCart();
  const isOutOfStock = medicine.stockQuantity === 0;
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < 10;

  const categoryColors = {
    'Tablet': 'bg-blue-500',
    'Syrup': 'bg-purple-500',
    'Injection': 'bg-rose-500',
    'Capsule': 'bg-amber-500',
    'Vitamins': 'bg-emerald-500',
    'Others': 'bg-gray-500'
  };

  const accentColor = categoryColors[medicine.category] || 'bg-primary';

  return (
    <Link to={`/medicines/${medicine._id}`} className="block group h-full">
      <div className="card-premium h-full flex flex-col relative overflow-hidden group">
        {/* Category Strip */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentColor} opacity-70`} />
        
        {/* Image Area */}
        <div className="relative h-56 bg-gray-50/50 flex items-center justify-center p-8 overflow-hidden">
          {/* Stock Badge */}
          <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:scale-110">
            {isOutOfStock ? (
              <span className="px-3 py-1 bg-red-100/90 backdrop-blur-sm text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-200 shadow-sm">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="px-3 py-1 bg-amber-100/90 backdrop-blur-sm text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 shadow-sm">
                Low Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-emerald-100/90 backdrop-blur-sm text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 shadow-sm">
                In Stock
              </span>
            )}
          </div>

          <img
            src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
            alt={medicine.name}
            className="h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop';
            }}
          />

          {/* Hover Overlay Button */}
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <div className="bg-white text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                <Package className={`w-3 h-3 ${accentColor.replace('bg-', 'text-')}`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                  {medicine.category}
                </span>
             </div>
            {medicine.rating?.count > 0 && (
              <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> 
                {medicine.rating.average.toFixed(1)}
              </div>
            )}
          </div>

          <h3 className="font-black text-gray-900 text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {medicine.name}
          </h3>
          
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wide line-clamp-1 mb-4">
            {medicine.genericName || "Standard Formulation"}
          </p>

          <div className="mt-auto pt-6 border-t border-gray-50">
            <div className="flex items-end justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Price</span>
                <span className="text-2xl font-black text-primary leading-none">
                  ₹{medicine.price.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tighter">
                {medicine.manufacturer}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(medicine);
              }}
              disabled={isOutOfStock}
              className={`w-full py-4 flex items-center justify-center gap-3 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all
                ${isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-gray-900 text-white hover:bg-primary active:scale-95 shadow-xl hover:shadow-primary/30'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MedicineCard;
