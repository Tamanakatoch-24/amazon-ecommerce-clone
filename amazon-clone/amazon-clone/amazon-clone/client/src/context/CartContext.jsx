import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

const CART_STORAGE_KEY = "amazon_clone_cart";

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exist = cart.find(p => p.id === product.id);

    if (exist) {
      setCart(cart.map(p =>
        p.id === product.id
          ? { ...p, qty: p.qty + 1 }
          : p
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(p => p.id !== id));
  };

  const updateQty = (id, qty) => {
    setCart(cart.map(p =>
      p.id === id ? { ...p, qty } : p
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart
  }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;