import type { CartItem } from "@/store/cart";
import { getProduct } from "@/data/products";

export function computeTotals(
  items: CartItem[],
  coupon?: { code: string; percent: number }
) {
  const subtotal = items.reduce((sum, it) => {
    const p = getProduct(it.id);
    return sum + (p ? p.price * it.qty : 0);
  }, 0);
  const originalSubtotal = items.reduce((sum, it) => {
    const p = getProduct(it.id);
    if (!p) return sum;
    return sum + (p.priceOriginal ?? p.price) * it.qty;
  }, 0);
  const baseSavings = Math.max(0, originalSubtotal - subtotal);
  const couponDiscount = coupon ? (subtotal * coupon.percent) / 100 : 0;
  const discount = baseSavings + couponDiscount;
  const shipping = subtotal >= 300 || subtotal === 0 ? 0 : 12;
  const total = subtotal - couponDiscount + shipping;
  return {
    subtotal,
    originalSubtotal,
    baseSavings,
    couponDiscount,
    discount,
    shipping,
    total,
  };
}
