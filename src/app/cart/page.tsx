"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Tag, CheckCircle2 } from "lucide-react";
import { ZelleIcon, PagoMovilIcon, CryptoIcon, MastercardIcon, VisaIcon } from "@/components/ui/PaymentIcons";
import { TopBar } from "@/components/ui/TopBar";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { getProduct } from "@/data/products";
import { computeTotals } from "@/lib/totals";
import { formatUSD, cn } from "@/lib/cn";

const STEPS = ["Carrito", "Entrega", "Pago", "Listo"];

const PAYMENTS = [
  { id: "zelle", label: "Zelle", Icon: ZelleIcon },
  { id: "pagomovil", label: "Pago Móvil", Icon: PagoMovilIcon },
  { id: "crypto", label: "Crypto", Icon: CryptoIcon },
  { id: "visa", label: "Visa", Icon: VisaIcon },
  { id: "mastercard", label: "Mastercard", Icon: MastercardIcon },
];

export default function CartPage() {
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const clearCoupon = useCart((s) => s.clearCoupon);

  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const totals = computeTotals(items, coupon);

  function tryApply() {
    setErr(null);
    if (!code.trim()) return;
    const ok = applyCoupon(code.trim());
    if (!ok) setErr("Cupón inválido");
    else setCode("");
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="flex flex-col min-h-screen bg-surface-base relative z-10 lg:max-w-[720px] lg:mx-auto lg:min-h-0"
    >
      <TopBar title="Tu carrito" />

      <div className="px-5">
        <Stepper steps={STEPS} current={0} />
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <div className="text-6xl">🛒</div>
          <h2 className="mt-4 text-[18px] font-medium">Tu carrito está vacío</h2>
          <p className="mt-2 text-[13px] text-ink-muted">
            Agrega tus equipos favoritos para continuar.
          </p>
          <Link href="/catalog">
            <Button variant="primary" className="mt-6">
              Explorar catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <section className="mt-5 px-5 space-y-2.5">
            <AnimatePresence initial={false}>
              {items.map((it) => {
                const p = getProduct(it.id);
                if (!p) return null;
                return (
                  <motion.div
                    key={it.id}
                    layout
                    initial={false}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-3 flex gap-3"
                  >
                    <div className="h-20 w-20 rounded-xl bg-surface-base flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain p-2 mix-blend-multiply"
                          sizes="80px"
                        />
                      ) : (
                        <span className="text-[40px]">{p.emoji}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="brand-label">{p.brand}</span>
                      <h3 className="text-[13px] font-medium leading-tight tracking-tight line-clamp-2">
                        {p.name}
                      </h3>
                      {it.color && (
                        <span className="text-[10.5px] text-ink-muted">
                          Color: {it.color}
                        </span>
                      )}
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="price text-[14px]">
                          ${formatUSD(p.price * it.qty)}
                        </span>
                        <div className="flex items-center h-8 rounded-full bg-surface-active border-hairline border-black/8">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="h-8 w-8 flex items-center justify-center tap"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center text-[12px] font-mono font-medium">
                            {it.qty}
                          </span>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="h-8 w-8 flex items-center justify-center tap"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className="h-8 w-8 rounded-full flex items-center justify-center text-ink-muted tap self-start"
                    >
                      <Trash2 size={14} strokeWidth={1.6} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </section>

          {/* Coupon */}
          {/*
          <section className="mt-5 px-5">
            <div className="bg-white rounded-2xl border-hairline border-black/8 p-3 shadow-soft">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center">
                  <Tag size={15} className="text-brand-deep" strokeWidth={1.6} />
                </div>
                {coupon ? (
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <div className="text-[12px] font-medium tracking-tight">
                        {coupon.code}
                      </div>
                      <div className="text-[10.5px] text-success">
                        -{coupon.percent}% aplicado
                      </div>
                    </div>
                    <button
                      onClick={clearCoupon}
                      className="text-[11px] text-danger font-medium"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setErr(null);
                      }}
                      placeholder="Código de descuento"
                      className="flex-1 h-9 bg-transparent outline-none text-[13px] placeholder:text-ink-subtle font-mono tracking-tight"
                    />
                    <button
                      onClick={tryApply}
                      className="h-8 px-3 rounded-full bg-brand-gradient text-white text-[11px] font-medium tap"
                    >
                      Aplicar
                    </button>
                  </>
                )}
              </div>
              {err && (
                <div className="mt-1.5 text-[10.5px] text-danger">{err}</div>
              )}
              {!coupon && (
                <div className="mt-1.5 text-[10.5px] text-ink-subtle">
                  Prueba: ONETECH10 · VZLA5 · GAMER15
                </div>
              )}
            </div>
          </section>
          */}

          {/* Totals */}
          <section className="mt-5 px-5">
            <div className="bg-white rounded-2xl border-hairline border-black/8 p-4 shadow-soft space-y-2">
              <Row label="Subtotal" value={`$${formatUSD(totals.subtotal)}`} />
              {totals.baseSavings > 0 && (
                <Row
                  label="Descuentos del producto"
                  value={`-$${formatUSD(totals.baseSavings)}`}
                  positive
                />
              )}
              {totals.couponDiscount > 0 && (
                <Row
                  label={`Cupón ${coupon?.code}`}
                  value={`-$${formatUSD(totals.couponDiscount)}`}
                  positive
                />
              )}
              <Row
                label="Envío"
                value={
                  totals.shipping === 0 ? "Gratis" : `$${formatUSD(totals.shipping)}`
                }
                positive={totals.shipping === 0}
              />
              <div className="border-t-hairline border-black/8 pt-2 mt-1 flex items-baseline justify-between">
                <span className="text-[13px] font-medium">Total</span>
                <span className="price text-[22px]">
                  ${formatUSD(totals.total)}
                </span>
              </div>
              {/*
              {totals.discount > 0 && (
                <div className="text-[11px] text-success">
                  Estás ahorrando ${formatUSD(totals.discount)} en esta compra.
                </div>
              )}
              */}
            </div>
          </section>

          {/* Payments preview */}
          <section className="mt-5 px-5 pb-36">
            <span className="brand-label">Métodos de pago disponibles</span>
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
              {PAYMENTS.map((p) => (
                <div
                  key={p.id}
                  className="flex-shrink-0 h-[52px] px-4 rounded-2xl bg-white border-hairline border-black/8 flex items-center gap-3 shadow-soft"
                >
                  <p.Icon />
                  <span className="text-[14px] font-medium tracking-tight">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Fixed CTA */}
      {items.length > 0 && (
        <div
          className="sticky bottom-0 mt-auto bg-white/95 backdrop-blur-md border-t-hairline border-black/10 p-4 z-10"
          style={{ paddingBottom: `calc(16px + var(--safe-bottom))` }}
        >
          <Link href="/checkout" className="block">
            <Button variant="primary" size="lg" fullWidth>
              Continuar · ${formatUSD(totals.total)}
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12.5px] text-ink-muted">{label}</span>
      <span
        className={cn(
          "text-[13px] font-mono tracking-tight",
          positive ? "text-success font-medium" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
