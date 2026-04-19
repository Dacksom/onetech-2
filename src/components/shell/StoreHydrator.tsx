"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";
import { useOrders } from "@/store/orders";
import { useInventory } from "@/store/inventory";
import { useQuotes } from "@/store/quotes";

export function StoreHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useSaved.persist.rehydrate();
    useOrders.persist.rehydrate();
    useInventory.persist.rehydrate();
    useQuotes.persist.rehydrate();
  }, []);
  return null;
}
