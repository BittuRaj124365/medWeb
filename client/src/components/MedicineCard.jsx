import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MedicineCard = ({ medicine }) => {
  const isOutOfStock = medicine.stockQuantity === 0;
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < 10;
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };
  const { addToCart } = useCart();

  const styles = {
    bg: 'bg-white',
    text: 'text-indigo-700',
    border: 'border-gray-100',
    accent: 'bg-indigo-600',
    hoverBorder: 'hover:border-indigo-400'
  };

  return (
    <Link to={`/medicines/${medicine._id}`} className="block group">
      <div className={`rounded-2xl shadow-sm border ${styles.border} ${styles.bg} ${styles.hoverBorder} overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative`}>
        {/* Image Container */}
        <div className="h-48 bg-gray-50/50 m-0 rounded-t-2xl flex items-center justify-center p-6 relative overflow-hidden backdrop-blur-sm border-b border-gray-50">
          <div className="absolute top-3 right-3 z-10">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-red-200">Out of Stock</span>
            ) : isLowStock ? (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-amber-200">Low Stock</span>
            ) : (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-indigo-200">Verified</span>
            )}
          </div>
          <img
            src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
            alt={medicine.name}
            className="h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop';
            }}
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            {medicine.category}
          </span>

          <h3 className="font-semibold text-gray-800 text-base leading-tight line-clamp-2 mb-1 group-hover:text-indigo-700 transition-colors" title={medicine.name}>
            {medicine.name}
          </h3>

          <p className="text-gray-400 text-[11px] mb-4 flex-grow line-clamp-2 font-medium">
            {medicine.genericName || medicine.description}
          </p>

          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-xl text-gray-900">
              {formatPrice(medicine.price)}
            </span>
            <span className="text-[9px] font-medium text-gray-300 uppercase tracking-widest">
              {medicine.manufacturer}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(medicine);
            }}
            disabled={isOutOfStock}
            className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : `${styles.accent} text-white hover:bg-emerald-700 active:scale-95 shadow-md hover:shadow-emerald-500/20`}`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Sold Out' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </Link>

  );
};


export default MedicineCard;
