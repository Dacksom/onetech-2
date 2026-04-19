"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Sede } from "@/data/products";

export type Transfer = {
  id: string;
  productId: string;
  from: Sede;
  to: Sede;
  qty: number;
  createdAt: number;
  status: "pending" | "in-transit" | "completed";
};

type InventoryState = {
  stock: Record<string, Record<Sede, number>>;
  transfers: Transfer[];
  init: () => void;
  adjust: (productId: string, sede: Sede, delta: number) => void;
  set: (productId: string, sede: Sede, value: number) => void;
  transfer: (productId: string, from: Sede, to: Sede, qty: number) => Transfer | null;
  advanceTransfer: (id: string) => void;
};

const seed = (): Record<string, Record<Sede, number>> => {
  const out: Record<string, Record<Sede, number>> = {};
  for (const p of PRODUCTS) out[p.id] = { ...p.stock };
  return out;
};

function genId() {
  return `TRF-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const useInventory = create<InventoryState>()(
  persist(
    (setState, get) => ({
      stock: seed(),
      transfers: [],
      init: () => {
        if (Object.keys(get().stock).length === 0) setState({ stock: seed() });
      },
      adjust: (productId, sede, delta) =>
        setState((s) => ({
          stock: {
            ...s.stock,
            [productId]: {
              ...s.stock[productId],
              [sede]: Math.max(0, (s.stock[productId]?.[sede] ?? 0) + delta),
            },
          },
        })),
      set: (productId, sede, value) =>
        setState((s) => ({
          stock: {
            ...s.stock,
            [productId]: {
              ...s.stock[productId],
              [sede]: Math.max(0, value),
            },
          },
        })),
      transfer: (productId, from, to, qty) => {
        const available = get().stock[productId]?.[from] ?? 0;
        if (qty <= 0 || qty > available || from === to) return null;
        const t: Transfer = {
          id: genId(),
          productId,
          from,
          to,
          qty,
          createdAt: Date.now(),
          status: "pending",
        };
        setState((s) => ({
          transfers: [t, ...s.transfers],
          stock: {
            ...s.stock,
            [productId]: {
              ...s.stock[productId],
              [from]: s.stock[productId][from] - qty,
            },
          },
        }));
        return t;
      },
      advanceTransfer: (id) =>
        setState((s) => ({
          transfers: s.transfers.map((t) => {
            if (t.id !== id) return t;
            if (t.status === "pending") return { ...t, status: "in-transit" };
            if (t.status === "in-transit") {
              s.stock[t.productId][t.to] =
                (s.stock[t.productId][t.to] ?? 0) + t.qty;
              return { ...t, status: "completed" };
            }
            return t;
          }),
          stock: { ...s.stock },
        })),
    }),
    { name: "onetech-inventory", skipHydration: true }
  )
);
