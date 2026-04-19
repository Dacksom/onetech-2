"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuoteItem = { productId: string; qty: number };

export type Quote = {
  id: string;
  createdAt: number;
  customer: { name: string; phone: string; company?: string };
  items: QuoteItem[];
  notes?: string;
  validDays: number;
  status: "draft" | "sent" | "accepted" | "expired";
  total: number;
};

type QuotesState = {
  list: Quote[];
  create: (q: Omit<Quote, "id" | "createdAt" | "status">) => Quote;
  setStatus: (id: string, status: Quote["status"]) => void;
  remove: (id: string) => void;
};

function genId() {
  return `COT-${Math.floor(10000 + Math.random() * 89999)}`;
}

export const useQuotes = create<QuotesState>()(
  persist(
    (set) => ({
      list: [],
      create: (q) => {
        const quote: Quote = {
          ...q,
          id: genId(),
          createdAt: Date.now(),
          status: "draft",
        };
        set((s) => ({ list: [quote, ...s.list] }));
        return quote;
      },
      setStatus: (id, status) =>
        set((s) => ({
          list: s.list.map((q) => (q.id === id ? { ...q, status } : q)),
        })),
      remove: (id) =>
        set((s) => ({ list: s.list.filter((q) => q.id !== id) })),
    }),
    { name: "onetech-quotes", skipHydration: true }
  )
);
