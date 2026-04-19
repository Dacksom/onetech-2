"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SavedState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "onetech-saved", skipHydration: true }
  )
);
