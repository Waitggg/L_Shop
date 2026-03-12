import React, { createContext, useState, useContext, useEffect } from 'react';

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

interface CartContextType {
  cart: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем корзину с сервера при монтировании
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Не авторизован - просто пустая корзина
          setCart({ items: [], totalItems: 0, totalPrice: 0 });
          return;
        }
        throw new Error('Ошибка загрузки корзины');
      }

      const data = await response.json();
      if (data.success && data.cart) {
        const { totalItems, totalPrice } = calculateTotals(data.cart.items || []);
        setCart({
          items: data.cart.items || [],
          totalItems,
          totalPrice
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки корзины');
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      setError(null);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(item)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Если не авторизован, показываем сообщение
          throw new Error('Необходимо авторизоваться');
        }
        throw new Error('Ошибка добавления товара');
      }

      const data = await response.json();
      if (data.success && data.cart) {
        const { totalItems, totalPrice } = calculateTotals(data.cart.items || []);
        setCart({
          items: data.cart.items || [],
          totalItems,
          totalPrice
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления товара');
      throw err;
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления количества');
      }

      const data = await response.json();
      if (data.success && data.cart) {
        const { totalItems, totalPrice } = calculateTotals(data.cart.items || []);
        setCart({
          items: data.cart.items || [],
          totalItems,
          totalPrice
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления количества');
      throw err;
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления товара');
      }

      const data = await response.json();
      if (data.success && data.cart) {
        const { totalItems, totalPrice } = calculateTotals(data.cart.items || []);
        setCart({
          items: data.cart.items || [],
          totalItems,
          totalPrice
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления товара');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка очистки корзины');
      }

      const data = await response.json();
      if (data.success) {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка очистки корзины');
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loading,
      error
    }}>
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