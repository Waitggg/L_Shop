import React, { createContext, useState, useContext, useEffect } from 'react';
//import type { CartItem, CartState } from '../types/cartTypes';

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}
export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>(() => {
    // Загружаем корзину из localStorage при инициализации
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalItems: 0, totalPrice: 0 };
  });

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(i => i.id === item.id);
      
      let newItems;
      if (existingItem) {
        newItems = prevCart.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...prevCart.items, { ...item, quantity: 1 }];
      }

      return {
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      };
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(i => i.id !== id);
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      };
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(i =>
        i.id === id ? { ...i, quantity } : i
      );
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};