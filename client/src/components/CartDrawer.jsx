import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Your Cart
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
                <button 
                  onClick={() => { onClose(); navigate('/medicines'); }}
                  className="mt-4 px-6 py-2 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary/20 transition-colors"
                >
                  Browse Medicines
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 bg-white border rounded-2xl shadow-sm relative group">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'} 
                        alt={item.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200&auto=format&fit=crop'; }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight pr-8 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.stockQuantity}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete button (shows on hover) */}
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 bg-gray-50/50 space-y-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pb-4 border-b">
                <span>Tax & Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-end mb-6">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={clearCart}
                  className="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Clear Cart
                </button>
                <button 
                  className="px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-teal-700 shadow-sm transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    alert('Checkout functionality coming soon!');
                  }}
                >
                  Checkout
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
