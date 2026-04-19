"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, ShoppingCart, Check, X } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getProduct, totalStock } from "@/data/products";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";
import { useInventory } from "@/store/inventory";
import { formatUSD, cn } from "@/lib/cn";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = getProduct(id);
  const add = useCart((s) => s.add);
  const saved = useSaved((s) => s.ids.includes(id));
  const toggleSaved = useSaved((s) => s.toggle);
  const stockMap = useInventory((s) => s.stock[id]);

  const [color, setColor] = useState(product?.colors?.[0]?.label ?? "");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartItems = useCart((s) => s.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const stock = useMemo(() => {
    if (!stockMap) return product ? totalStock(product) : 0;
    return Object.values(stockMap).reduce((n, v) => n + v, 0);
  }, [stockMap, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <TopBar transparent />
        <span className="text-5xl">🔎</span>
        <p className="mt-3 text-[14px] text-ink-muted">Producto no encontrado</p>
      </div>
    );
  }

  const savings = product.priceOriginal
    ? product.priceOriginal - product.price
    : 0;

  function handleAdd(navigateToCart = false) {
    if (stock === 0) return;
    add(product!.id, { qty, color });
    if (navigateToCart) {
      setDrawerOpen(true);
    } else {
      setToast("Agregado al carrito");
      setAdded(true);
      setTimeout(() => {
        setToast(null);
        setAdded(false);
      }, 2000);
      setDrawerOpen(true);
    }
  }

  return (
    <div className="relative flex flex-col min-h-full">
      {/* Hero image with emoji */}
      <div className="relative h-[380px] bg-surface-base flex items-center justify-center">
        <TopBar
          transparent
          right={
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaved(product.id)}
                className="h-10 w-10 rounded-full bg-white/80 backdrop-blur border-hairline border-white/40 flex items-center justify-center tap"
              >
                <Heart
                  size={17}
                  className={saved ? "fill-brand-deep text-brand-deep" : "text-ink"}
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={() => setDrawerOpen((o) => !o)}
                className="relative h-10 w-10 rounded-full bg-white/80 backdrop-blur border-hairline border-white/40 flex items-center justify-center tap"
              >
                <ShoppingCart size={17} className="text-ink" strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-success text-white text-[10px] flex items-center justify-center font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          }
        />
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8 mix-blend-multiply"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        ) : (
          <div className="text-[180px] leading-none">{product.emoji}</div>
        )}

        {product.priceOriginal && (
          <span className="absolute top-16 left-5 h-7 px-3 rounded-full bg-brand-gradient text-white text-[11px] font-medium flex items-center tracking-tight">
            Ahorras ${formatUSD(savings)}
          </span>
        )}

        {stock > 0 && stock <= 5 && (
          <span className="absolute bottom-4 left-5 h-7 px-3 rounded-full bg-danger/10 text-danger border-hairline border-danger/20 text-[11px] font-medium flex items-center">
            ⚡ Solo quedan {stock} unidades
          </span>
        )}
      </div>

      {/* Info card */}
      <div className="-mt-6 bg-white rounded-t-3xl px-5 pt-6 pb-6 relative">
        <div className="flex items-start justify-between">
          <div>
            <span className="brand-label">{product.brand}</span>
            <h1 className="mt-1 text-[22px] font-medium tracking-tight leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-1 text-[12.5px] text-ink-muted">
                {product.tagline}
              </p>
            )}
          </div>
          <span
            className={cn(
              "h-6 px-2 rounded-full text-[10px] font-medium flex items-center flex-shrink-0",
              product.estado === "Nuevo"
                ? "bg-success/10 text-success"
                : "bg-ink/8 text-ink-muted"
            )}
          >
            {product.estado}
          </span>
        </div>

        {/* Price block */}
        <div className="mt-4 flex items-end gap-3">
          <span className="price text-[32px] leading-none">
            ${formatUSD(product.price)}
          </span>
          {product.priceOriginal && (
            <>
              <span className="price !text-ink-muted !font-normal line-through text-[14px] mb-[3px]">
                ${formatUSD(product.priceOriginal)}
              </span>
              <span className="text-[11px] text-success font-medium mb-1">
                -{Math.round((savings / product.priceOriginal) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Stock */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              stock > 0 ? "bg-success" : "bg-danger"
            )}
          />
          <span className="text-[12px] text-ink-muted">
            {stock > 0
              ? `${stock} en stock · Sambil + La Chinita`
              : "Agotado · consulta disponibilidad"}
          </span>
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-5">
            <span className="brand-label">Color · {color}</span>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setColor(c.label)}
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center tap border-hairline",
                    color === c.label
                      ? "border-brand-deep ring-2 ring-brand-deep/20"
                      : "border-black/10"
                  )}
                >
                  <span
                    className="h-6 w-6 rounded-full"
                    style={{ background: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Specs */}
        <div className="mt-6">
          <span className="brand-label">Especificaciones</span>
          <div className="mt-2 rounded-2xl border-hairline border-black/8 overflow-hidden divide-y divide-black/5">
            {Object.entries(product.specs).map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between px-4 py-3 gap-3"
              >
                <span className="text-[12px] text-ink-muted">{k}</span>
                <span className="text-[12.5px] font-medium text-right max-w-[60%]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Qty */}
        <div className="mt-6 flex items-center justify-between">
          <span className="brand-label">Cantidad</span>
          <div className="flex items-center h-10 rounded-full bg-surface-active border-hairline border-black/8">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 flex items-center justify-center tap"
            >
              <Minus size={14} strokeWidth={1.8} />
            </button>
            <span className="w-8 text-center text-[13px] font-medium font-mono">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
              className="h-10 w-10 flex items-center justify-center tap"
            >
              <Plus size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="sticky bottom-0 mt-auto bg-white/95 backdrop-blur-md border-t-hairline border-black/10 p-4 flex gap-2.5 z-10"
        style={{ paddingBottom: `calc(16px + var(--safe-bottom))` }}
      >
        <Button
          variant="whatsapp"
          size="lg"
          className="flex-shrink-0 w-[52px] !px-0"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={20} />
        </Button>
        <Button
          variant={added ? "whatsapp" : "secondary"}
          size="lg"
          className={cn("flex-1 transition-all duration-300", added && "!bg-success !text-white !border-transparent shadow-[0_8px_24px_-8px_rgba(22,163,74,0.4)]")}
          onClick={() => handleAdd(false)}
          disabled={stock === 0}
        >
          {added ? (
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2">
              <Check size={16} strokeWidth={2} />
              En el carrito
            </motion.div>
          ) : (
            <>
              <ShoppingBag size={16} strokeWidth={1.6} />
              Agregar
            </>
          )}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => handleAdd(true)}
          disabled={stock === 0}
        >
          Comprar
        </Button>
      </div>

      {/* Mini Cart Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[400px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-5 border-b-hairline border-black/10">
                <span className="font-medium">Tu Carrito</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-8 w-8 rounded-full bg-surface-active flex items-center justify-center tap"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.map((item) => {
                  const p = getProduct(item.id);
                  if (!p) return null;
                  return (
                    <div
                      key={`${item.id}-${item.color}`}
                      className="flex gap-3 items-center"
                    >
                      <div className="h-[70px] w-[70px] rounded-xl bg-surface-base flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-2 mix-blend-multiply"
                            sizes="70px"
                          />
                        ) : (
                          <span className="text-[30px]">{p.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[13px] truncate">
                          {p.name}
                        </div>
                        <div className="text-ink-muted text-[11px]">
                          {p.brand} · Cant: {item.qty}
                        </div>
                        <div className="font-medium text-[13px] mt-1 text-brand-deep">
                          ${formatUSD(p.price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-5 border-t-hairline border-black/10 bg-surface-active">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => router.push("/cart")}
                >
                  Confirmar carrito · Pagar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 h-9 px-4 rounded-full bg-surface-night text-white text-[12px] font-medium flex items-center shadow-lift z-20"
          >
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
