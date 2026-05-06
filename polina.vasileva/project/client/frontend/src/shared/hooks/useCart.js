import { useState } from "react";

/**
 * useCart
 * Хранит корзину в localStorage.
 * cartItems: Map<productId, { product, qty }>
 */
export const useCart = () => {
  const load = () => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return new Map();
      const arr = JSON.parse(raw);
      return new Map(arr.map((item) => [item.id, { product: item.product, qty: item.qty }]));
    } catch {
      return new Map();
    }
  };

  const [cart, setCart] = useState(load);

  const save = (map) => {
    const arr = [...map.values()].map((v) => ({ id: v.product.id, product: v.product, qty: v.qty }));
    localStorage.setItem("cart", JSON.stringify(arr));
    setCart(new Map(map));
  };

  const addToCart = (product) => {
    const next = new Map(cart);
    const existing = next.get(product.id);
    if (existing) {
      next.set(product.id, { product, qty: existing.qty + 1 });
    } else {
      next.set(product.id, { product, qty: 1 });
    }
    save(next);
  };

  const changeQty = (id, delta) => {
    const next = new Map(cart);
    const item = next.get(id);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      next.delete(id);
    } else {
      next.set(id, { ...item, qty: newQty });
    }
    save(next);
  };

  const removeItem = (id) => {
    const next = new Map(cart);
    next.delete(id);
    save(next);
  };

  const removeItems = (ids) => {
  setCart(prevCart => {
    const newCart = new Map(prevCart);
    ids.forEach(id => {
      newCart.delete(id);
    });
    return newCart;
  });
  
  
  const updatedCart = Array.from(cart.values()).filter(item => !ids.includes(item.product.id));
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart(new Map());
  };

  const qtyMap = new Map([...cart.entries()].map(([id, v]) => [id, v.qty]));

  const totalCount = [...cart.values()].reduce((s, v) => s + v.qty, 0);

  return {
    cart,          // Map<id, {product, qty}>
    qtyMap,        // Map<id, qty>
    totalCount,
    addToCart,
    changeQty,
    removeItem,
    removeItems,
    clearCart,
  };
};