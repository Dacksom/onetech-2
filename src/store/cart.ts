"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  qty: number;
  color?: string;
};

type CartState = {
  items: CartItem[];
  coupon?: { code: string; percent: number };
  add: (id: string, opts?: { qty?: number; color?: string }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  clear: () => void;
};

const COUPONS: Record<string, number> = {
  ONETECH10: 10,
  VZLA5: 5,
  GAMER15: 15,
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (id, opts) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + (opts?.qty ?? 1) } : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              { id, qty: opts?.qty ?? 1, color: opts?.color },
            ],
          };
        }),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      applyCoupon: (code) => {
        const c = COUPONS[code.toUpperCase()];
        if (!c) return false;
        set({ coupon: { code: code.toUpperCase(), percent: c } });
        return true;
      },
      clearCoupon: () => set({ coupon: undefined }),
      clear: () => set({ items: [], coupon: undefined }),
    }),
    { name: "onetech-cart", skipHydration: true }
  )
);
