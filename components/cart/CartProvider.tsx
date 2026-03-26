"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ProductLike = {
  id: string | number;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  [key: string]: any;
};

export type CartItem = ProductLike & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (product: ProductLike, quantity?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "renata-cart-v4";

function normalizeId(id: string | number | undefined | null) {
  return String(id ?? "");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (product: ProductLike, quantity = 1) => {
    const productId = normalizeId(product.id);

    setItems((prev) => {
      const index = prev.findIndex((item) => normalizeId(item.id) === productId);

      if (index === -1) {
        return [...prev, { ...product, quantity }];
      }

      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity: Number(next[index].quantity || 0) + quantity,
      };
      return next;
    });
  };

  const remove = (id: string) => {
    const targetId = normalizeId(id);
    setItems((prev) => prev.filter((item) => normalizeId(item.id) !== targetId));
  };

  const clear = () => {
    setItems([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      clear,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
