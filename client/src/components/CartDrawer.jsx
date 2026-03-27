import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-500 animate-in fade-in" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col transform transition-transform duration-500 ease-out animate-in slide-in-from-right">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                My Bag
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-11">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-gray-900 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                  <div className="relative p-10 bg-gray-50 rounded-[40px] border border-gray-100">
                    <ShoppingCart className="w-16 h-16 text-gray-200" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-400 font-medium max-w-[200px] mx-auto">Looks like you haven't added anything to your cart yet.</p>
                </div>
                <button
                  onClick={() => { onClose(); navigate('/medicines'); }}
                  className="px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-teal-700 shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {cartItems.map((item, idx) => (
                  <div key={item._id} className="flex gap-5 relative group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="w-24 h-24 bg-gray-50 rounded-[24px] p-3 flex-shrink-0 flex items-center justify-center border border-gray-100 group-hover:border-primary/20 transition-colors">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'; }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate group-hover:text-primary transition-colors pr-6">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{item.category}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-black text-gray-900 italic">
                          ₹{item.price.toFixed(2)}
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-primary hover:shadow-sm text-gray-400 transition-all active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-black w-4 text-center text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-primary hover:shadow-sm text-gray-400 transition-all disabled:opacity-30 active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Tax & Shipping</span>
                  <span className="text-teal-600">Calculated later</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Amount</span>
                    <span className="text-3xl font-black text-gray-900 italic">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    alert('Checkout functionality coming soon!');
                  }}
                  className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-black shadow-2xl shadow-gray-400/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  Confirm Order
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
