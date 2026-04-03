import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Package, ArrowRight, Heart, Tag, Activity } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MedicineCard = ({ medicine }) => {
  const isOutOfStock = medicine.stockQuantity <= 0;
  const isLowStock = medicine.stockQuantity > 0 && medicine.stockQuantity < (medicine.minStockThreshold || 10);

  return (
    <Link 
      to={`/medicines/${medicine._id}`} 
      className="group block bg-white rounded-[40px] shadow-premium hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-700 transform hover:-translate-y-4 border border-gray-50 overflow-hidden h-full flex flex-col relative"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -z-10 group-hover:bg-teal-500/10 transition-colors" />
      
      {/* ── IMAGE AREA ── */}
      <div className="relative h-60 bg-gray-50/50 flex items-center justify-center overflow-hidden rounded-[36px] m-3">
        {/* Category Badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white/90 backdrop-blur-xl text-[9px] font-black uppercase tracking-[0.15em] text-teal-600 rounded-full shadow-sm border border-teal-500/10">
            <Tag className="w-3 h-3" />
            {medicine.category}
          </span>
        </div>

        {/* Stock Status Indicator */}
        <div className="absolute bottom-5 right-5 z-10">
          {isOutOfStock ? (
            <div className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" /> SOLD OUT
            </div>
          ) : isLowStock ? (
            <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> LIMITED
            </div>
          ) : (
            <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> IN STOCK
            </div>
          )}
        </div>

        {medicine.imageUrl ? (
          <img
            src={medicine.imageUrl}
            alt={medicine.name}
            className="h-full w-full object-contain p-10 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3"
          />
        ) : (
          <div className="text-gray-200 group-hover:scale-125 transition-transform duration-1000">
             <Package size={80} strokeWidth={0.5} />
          </div>
        )}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="p-8 pt-4 flex flex-col flex-grow">
        <div className="mb-4">
            <h3 className="text-xl font-black text-gray-950 leading-tight group-hover:text-teal-600 transition-colors line-clamp-1 italic uppercase tracking-tighter mb-1">
            {medicine.name}
            </h3>
            <div className="flex items-center gap-2">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] line-clamp-1 italic">
                {medicine.genericName || "Clinical Core"}
                </p>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest truncate max-w-[100px]">
                {medicine.manufacturer}
                </p>
            </div>
        </div>

        <div className="mt-auto space-y-6">
            <div className="flex items-end justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 italic px-1">Verified MSRP</span>
                    <div className="text-3xl font-black text-gray-950 tabular-nums tracking-tighter leading-none flex items-start gap-1">
                        <span className="text-sm mt-1">₹</span>{medicine.price.toFixed(2)}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="text-xs font-black text-gray-900 pt-0.5">{(medicine.averageRating || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <Heart size={14} className={medicine.likes > 0 ? "fill-teal-500 text-teal-500" : ""} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{medicine.likes || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:scale-[1.02] ${
                isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 shadow-none' 
                    : 'bg-gray-950 text-white shadow-gray-900/20 hover:bg-teal-600'
            }`}>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-teal-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                {isOutOfStock ? 'Inventory Closed' : 'Examine Record'}
                <ArrowRight size={16} className={`transition-transform duration-500 ${isOutOfStock ? 'opacity-20' : 'group-hover:translate-x-3 text-teal-400'}`} />
            </div>
        </div>
      </div>
    </Link>
  );
};

export default MedicineCard;
