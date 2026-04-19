"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart";

export type OrderStatus =
  | "received"
  | "preparing"
  | "shipped"
  | "delivered";

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  payment: "Zelle" | "Pago Móvil" | "Crypto" | "Visa" | "Mastercard";
  sede: "Sambil Maracaibo" | "La Chinita";
  shipTo: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  status: OrderStatus;
};

type OrdersState = {
  list: Order[];
  create: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  get: (id: string) => Order | undefined;
  advance: (id: string) => void;
};

function genId() {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `OT-${n}`;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      list: [],
      create: (o) => {
        const order: Order = {
          ...o,
          id: genId(),
          createdAt: Date.now(),
          status: "received",
        };
        set((s) => ({ list: [order, ...s.list] }));
        return order;
      },
      get: (id) => get().list.find((o) => o.id === id),
      advance: (id) =>
        set((s) => ({
          list: s.list.map((o) => {
            if (o.id !== id) return o;
            const next: Record<OrderStatus, OrderStatus> = {
              received: "preparing",
              preparing: "shipped",
              shipped: "delivered",
              delivered: "delivered",
            };
            return { ...o, status: next[o.status] };
          }),
        })),
    }),
    { name: "onetech-orders", skipHydration: true }
  )
);
