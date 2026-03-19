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

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Tablet': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', accent: 'bg-blue-600' };
      case 'Syrup': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', accent: 'bg-purple-600' };
      case 'Injection': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', accent: 'bg-rose-600' };
      case 'Capsule': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', accent: 'bg-amber-600' };
      case 'Vitamins': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', accent: 'bg-emerald-600' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', accent: 'bg-gray-600' };
    }
  };

  const styles = getCategoryStyles(medicine.category);

  return (
    <Link to={`/medicines/${medicine._id}`} className="block group">
      <div className={`rounded-3xl shadow-sm border ${styles.border} ${styles.bg} overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col`}>
        {/* Image Container */}
        <div className="h-48 bg-white/60 m-3 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-3 right-3 z-10">
            {isOutOfStock ? (
              <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-red-200">Out of Stock</span>
            ) : isLowStock ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-200 shadow-sm">Low Stock</span>
            ) : (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200 shadow-sm">Verified</span>
            )}
          </div>
          <img
            src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
            alt={medicine.name}
            className="h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop';
            }}
          />
        </div>

        <div className="p-6 pt-2 flex flex-col flex-grow">
          <span className={`inline-block text-[10px] font-black uppercase tracking-widest ${styles.text} mb-3`}>
            {medicine.category}
          </span>

          <h3 className={`font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-2 group-hover:${styles.text} transition-colors`} title={medicine.name}>
            {medicine.name}
          </h3>

          <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2 font-medium opacity-80">
            {medicine.genericName || medicine.description}
          </p>

          <div className="flex justify-between items-end mt-auto pt-4 border-t border-black/5 mb-5">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mb-0.5">Best Price</div>
              <span className={`font-black text-2xl ${styles.text}`}>
                {formatPrice(medicine.price)}
              </span>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right mb-1">
              {medicine.manufacturer}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(medicine);
            }}
            disabled={isOutOfStock}
            className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95
              ${isOutOfStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : `${styles.accent} text-white hover:brightness-110 hover:shadow-${styles.text.split('-')[1]}/20`}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Sold Out' : 'Explore Item'}
          </button>
        </div>
      </div>
    </Link>
  );
};


export default MedicineCard;
