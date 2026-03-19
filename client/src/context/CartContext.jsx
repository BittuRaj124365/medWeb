import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('medCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from local storage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('medCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, quantity = 1) => {
    let message = '';
    setCartItems(prev => {
      const existing = prev.find(item => item._id === medicine._id);
      if (existing) {
        message = `Updated ${medicine.name} in cart`;
        return prev.map(item => 
          item._id === medicine._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      message = `Added ${medicine.name} to cart`;
      return [...prev, { ...medicine, quantity }];
    });
    if (message) toast.success(message);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
