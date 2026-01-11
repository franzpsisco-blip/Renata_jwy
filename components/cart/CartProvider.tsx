"use client";

import React from "react";
import type { CartItem, Product } from "@/lib/types";

type CartState = {
  items: CartItem[];
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "renata_cart_v1";

function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ items: [] });

  // load from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartState;
      if (parsed?.items) setState({ items: parsed.items });
    } catch {}
  }, []);

  // persist
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api: CartContextValue = React.useMemo(() => {
    const count = state.items.reduce((c, it) => c + it.qty, 0);
    const subtotal = calcSubtotal(state.items);

    function add(product: Product, qty = 1) {
      setState((s) => {
        const existing = s.items.find((x) => x.product.id === product.id);
        if (existing) {
          return {
            items: s.items.map((x) =>
              x.product.id === product.id ? { ...x, qty: x.qty + qty } : x
            ),
          };
        }
        return { items: [...s.items, { product, qty }] };
      });
    }

    function remove(productId: string) {
      setState((s) => ({ items: s.items.filter((x) => x.product.id !== productId) }));
    }

    function setQty(productId: string, qty: number) {
      const safe = Math.max(1, Math.min(99, Math.floor(qty)));
      setState((s) => ({
        items: s.items.map((x) => (x.product.id === productId ? { ...x, qty: safe } : x)),
      }));
    }

    function clear() {
      setState({ items: [] });
    }

    return { items: state.items, count, subtotal, add, remove, setQty, clear };
  }, [state.items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
