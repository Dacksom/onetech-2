"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, MapPin, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useOrders } from "@/store/orders";
import { getProduct } from "@/data/products";
import { formatUSD, cn } from "@/lib/cn";

const TIMELINE = [
  { key: "received", label: "Pedido recibido", Icon: Check },
  { key: "preparing", label: "Preparando en sede", Icon: Package },
  { key: "shipped", label: "En camino", Icon: Truck },
  { key: "delivered", label: "Entregado", Icon: Home },
] as const;

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const order = useOrders((s) => s.list.find((o) => o.id === id));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl">📦</span>
        <p className="mt-3 text-[14px] text-ink-muted">Orden no encontrada</p>
        <Link href="/" className="mt-4 text-brand-deep text-[13px] font-medium">
          Ir al inicio
        </Link>
      </div>
    );
  }

  const currentIdx = TIMELINE.findIndex((t) => t.key === order.status);

  return (
    <div className="pb-10">
      {/* Hero with gradient + checkmark */}
      <div className="relative bg-brand-gradient text-white px-6 pt-10 pb-16 overflow-hidden">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="relative mx-auto h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-lift"
        >
          <motion.svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            className="text-brand-deep"
          >
            <motion.path
              d="M10 19 L16 25 L27 13"
              fill="none"
              stroke="url(#check-grad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="check-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a3cb5" />
                <stop offset="100%" stopColor="#4db8ff" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative text-center mt-5"
        >
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/75 font-medium">
            Compra confirmada
          </span>
          <h1 className="mt-2 text-[24px] font-medium tracking-tight leading-tight">
            ¡Listo! Tu pedido está en camino.
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/15 backdrop-blur text-[12px] font-mono tracking-tight">
            <span className="opacity-70">Orden</span>
            <span className="font-medium">{order.id}</span>
          </div>
        </motion.div>
      </div>

      {/* Timeline card */}
      <div className="-mt-10 mx-5 bg-white rounded-3xl border-hairline border-black/8 shadow-lift p-5">
        <span className="brand-label">Seguimiento</span>
        <div className="mt-4 relative">
          <div className="absolute left-[17px] top-4 bottom-4 w-[2px] bg-black/8 rounded-full" />
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: `${(currentIdx / (TIMELINE.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="absolute left-[17px] top-4 w-[2px] bg-brand-gradient rounded-full"
          />
          <div className="space-y-4">
            {TIMELINE.map((t, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={t.key} className="flex items-start gap-3 relative">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-hairline",
                      done
                        ? "bg-brand-gradient text-white border-transparent"
                        : "bg-white text-ink-subtle border-black/10"
                    )}
                  >
                    <t.Icon size={15} strokeWidth={2} />
                    {active && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-brand-mid"
                      />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <div
                      className={cn(
                        "text-[13px] tracking-tight",
                        done ? "font-medium text-ink" : "text-ink-subtle"
                      )}
                    >
                      {t.label}
                    </div>
                    {active && (
                      <div className="text-[10.5px] text-ink-muted mt-0.5">
                        Estado actual
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order summary */}
      <section className="mt-5 px-5">
        <span className="brand-label">Resumen del pedido</span>
        <div className="mt-2 bg-white rounded-2xl border-hairline border-black/8 shadow-soft overflow-hidden">
          {order.items.map((it, idx) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <div
                key={it.id}
                className={cn(
                  "flex items-center gap-3 p-3",
                  idx > 0 && "border-t-hairline border-black/6"
                )}
              >
                <div className="h-12 w-12 rounded-xl bg-surface-base flex items-center justify-center text-[28px] flex-shrink-0 relative overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-1.5 mix-blend-multiply"
                      sizes="48px"
                    />
                  ) : (
                    p.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium tracking-tight line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-[10.5px] text-ink-muted">
                    {p.brand} · Cant. {it.qty}
                  </div>
                </div>
                <span className="price text-[13px]">
                  ${formatUSD(p.price * it.qty)}
                </span>
              </div>
            );
          })}
          <div className="bg-surface-active px-4 py-3 border-t-hairline border-black/6 space-y-1.5">
            <Row label="Subtotal" value={`$${formatUSD(order.subtotal)}`} />
            {order.discount > 0 && (
              <Row
                label="Ahorros"
                value={`-$${formatUSD(order.discount)}`}
                positive
              />
            )}
            <Row
              label="Envío"
              value={
                order.shipping === 0
                  ? "Gratis"
                  : `$${formatUSD(order.shipping)}`
              }
            />
            <div className="border-t-hairline border-black/8 pt-1.5 flex items-baseline justify-between">
              <span className="text-[12.5px] font-medium">Total pagado</span>
              <span className="price text-[16px]">
                ${formatUSD(order.total)}
              </span>
            </div>
            <div className="text-[10.5px] text-ink-muted">
              Método: {order.payment}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping info */}
      <section className="mt-4 px-5">
        <div className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-4">
          <span className="brand-label">Datos de entrega</span>
          <div className="mt-2 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-brand-deep" strokeWidth={1.6} />
            </div>
            <div className="text-[12.5px] leading-relaxed">
              <div className="font-medium">{order.shipTo.name}</div>
              <div className="text-ink-muted">{order.shipTo.address}</div>
              <div className="text-ink-muted">{order.shipTo.city}</div>
              <div className="text-ink-muted font-mono">{order.shipTo.phone}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="mt-5 px-5 flex gap-2.5">
        <Button
          variant="whatsapp"
          size="lg"
          className="flex-1"
          onClick={() => {}}
        >
          <WhatsAppIcon size={18} />
          Soporte
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => router.push("/")}
        >
          Volver al inicio
        </Button>
      </section>
    </div>
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
      <span className="text-[11.5px] text-ink-muted">{label}</span>
      <span
        className={cn(
          "text-[12px] font-mono tracking-tight",
          positive ? "text-success font-medium" : "text-ink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
