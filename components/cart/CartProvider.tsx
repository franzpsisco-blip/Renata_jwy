"use client";

import React from "react";
import type { CartItem, Product } from "@/lib/types";
import { getDiscountedSubtotal } from "@/lib/discount";

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

const STORAGE_KEY = "renata_cart_v2";
const LEGACY_STORAGE_KEYS = ["renata_cart_v1", "renata_cart_v0", "renata_cart"];

function calcSubtotal(items: CartItem[]) {
  return getDiscountedSubtotal(items);
}

function sanitizeItems(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((item): item is CartItem => {
      return Boolean(
        item &&
          typeof item === "object" &&
          "product" in item &&
          item.product &&
          typeof item.product === "object" &&
          typeof item.product.id === "string" &&
          typeof item.product.name === "string" &&
          typeof item.product.price === "number" &&
          typeof item.qty === "number"
      );
    })
    .map((item) => ({
      product: item.product,
      qty: Math.max(1, Math.min(99, Math.floor(item.qty))),
    }));
}

function clearLegacyCartStorage() {
  if (typeof window === "undefined") return;

  for (const key of LEGACY_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  }
}

function readCartFromSession(): CartState {
  if (typeof window === "undefined") return { items: [] };

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as CartState;
    return { items: sanitizeItems(parsed?.items) };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ items: [] });
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    clearLegacyCartStorage();
    setState(readCartFromSession());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    try {
      if (state.items.length === 0) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const api: CartContextValue = React.useMemo(() => {
    const count = state.items.reduce((c, it) => c + it.qty, 0);
    const subtotal = calcSubtotal(state.items);

    function add(product: Product, qty = 1) {
      const safeQty = Math.max(1, Math.min(99, Math.floor(qty)));

      setState((s) => {
        const existing = s.items.find((x) => x.product.id === product.id);
        if (existing) {
          return {
            items: s.items.map((x) =>
              x.product.id === product.id
                ? { ...x, qty: Math.min(99, x.qty + safeQty) }
                : x
            ),
          };
        }
        return { items: [...s.items, { product, qty: safeQty }] };
      });
    }

    function remove(productId: string) {
      setState((s) => ({ items: s.items.filter((x) => x.product.id !== productId) }));
    }

    function setQty(productId: string, qty: number) {
      const safe = Math.floor(qty);

      if (safe <= 0) {
        remove(productId);
        return;
      }

      setState((s) => ({
        items: s.items.map((x) =>
          x.product.id === productId
            ? { ...x, qty: Math.max(1, Math.min(99, safe)) }
            : x
        ),
      }));
    }

    function clear() {
      setState({ items: [] });

      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
          clearLegacyCartStorage();
        } catch {}
      }
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
