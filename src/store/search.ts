import { create } from "zustand";

interface TriggerRect {
  left: number;
  width: number;
  bottom: number;
}

interface SearchState {
  open: boolean;
  triggerRect: TriggerRect | null;
  openSearch: (rect?: TriggerRect) => void;
  closeSearch: () => void;
}

export const useSearch = create<SearchState>((set) => ({
  open: false,
  triggerRect: null,
  openSearch: (rect) => set({ open: true, triggerRect: rect ?? null }),
  closeSearch: () => set({ open: false }),
}));
