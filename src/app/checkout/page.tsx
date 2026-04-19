"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Phone, Building2, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/ui/TopBar";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { computeTotals } from "@/lib/totals";
import { formatUSD, cn } from "@/lib/cn";
import { ZelleIcon, PagoMovilIcon, CryptoIcon, MastercardIcon, VisaIcon } from "@/components/ui/PaymentIcons";

const STEPS = ["Carrito", "Entrega", "Pago", "Listo"];
const SEDES = ["Sambil Maracaibo", "La Chinita"] as const;
const PAYMENTS = [
  { id: "Zelle", tag: "USD", Icon: ZelleIcon },
  { id: "Pago Móvil", tag: "Bs.", Icon: PagoMovilIcon },
  { id: "Crypto", tag: "USDT", Icon: CryptoIcon },
  { id: "Visa", tag: "Tarjeta", Icon: VisaIcon },
  { id: "Mastercard", tag: "Tarjeta", Icon: MastercardIcon },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const clear = useCart((s) => s.clear);
  const createOrder = useOrders((s) => s.create);

  const totals = computeTotals(items, coupon);

  const [step, setStep] = useState<1 | 2>(1);
  const [shipTo, setShipTo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Maracaibo",
  });
  const [sede, setSede] = useState<(typeof SEDES)[number]>("Sambil Maracaibo");
  const [payment, setPayment] =
    useState<(typeof PAYMENTS)[number]["id"]>("Zelle");
  const [loading, setLoading] = useState(false);

  const deliveryValid =
    shipTo.name.trim().length > 2 &&
    shipTo.phone.trim().length >= 7 &&
    shipTo.address.trim().length > 4;

  async function finalize() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const order = createOrder({
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      payment,
      sede,
      shipTo,
    });
    clear();
    router.replace(`/order/${order.id}`);
  }

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Checkout" />

      <div className="px-5">
        <Stepper steps={STEPS} current={step} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="s1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="mt-5 px-5 space-y-4"
          >
            <div>
              <span className="brand-label">Datos de entrega</span>
              <div className="mt-2 bg-white rounded-2xl border-hairline border-black/8 overflow-hidden shadow-soft">
                <Field
                  icon={<User size={15} />}
                  label="Nombre completo"
                  value={shipTo.name}
                  onChange={(v) => setShipTo((s) => ({ ...s, name: v }))}
                />
                <Field
                  icon={<Phone size={15} />}
                  label="Teléfono"
                  value={shipTo.phone}
                  onChange={(v) => setShipTo((s) => ({ ...s, phone: v }))}
                  placeholder="0414-1234567"
                  mono
                />
                <Field
                  icon={<MapPin size={15} />}
                  label="Dirección"
                  value={shipTo.address}
                  onChange={(v) => setShipTo((s) => ({ ...s, address: v }))}
                  placeholder="Calle, urbanización, punto de referencia"
                />
                <Field
                  icon={<Building2 size={15} />}
                  label="Ciudad"
                  value={shipTo.city}
                  onChange={(v) => setShipTo((s) => ({ ...s, city: v }))}
                  last
                />
              </div>
            </div>

            <div>
              <span className="brand-label">Retiro en tienda</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SEDES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSede(s)}
                    className={cn(
                      "h-16 rounded-2xl px-3 text-left tap border-hairline",
                      sede === s
                        ? "bg-brand-gradient-soft border-brand-deep/30"
                        : "bg-white border-black/8"
                    )}
                  >
                    <span className="brand-label">Sede</span>
                    <div className="text-[12.5px] font-medium tracking-tight mt-0.5">
                      {s}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="s2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="mt-5 px-5 space-y-4 pb-36"
          >
            <div>
              <span className="brand-label">Método de pago</span>
              <div className="mt-2 space-y-2">
                {PAYMENTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPayment(p.id)}
                    className={cn(
                      "w-full h-[60px] rounded-2xl px-4 flex items-center gap-4 tap border-[1.5px]",
                      payment === p.id
                        ? "bg-brand-gradient-soft border-brand-deep/50 shadow-soft"
                        : "bg-white border-black/8"
                    )}
                  >
                    <p.Icon />
                    <div className="flex-1 text-left">
                      <div className="text-[15px] font-semibold tracking-tight">
                        {p.id}
                      </div>
                      <div className="text-[11.5px] text-ink-muted">{p.tag}</div>
                    </div>
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full border-hairline flex items-center justify-center",
                        payment === p.id
                          ? "bg-brand-gradient border-transparent"
                          : "border-black/20"
                      )}
                    >
                      {payment === p.id && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-4 space-y-2">
              <Row label="Productos" value={`${items.length}`} />
              <Row label="Subtotal" value={`$${formatUSD(totals.subtotal)}`} />
              <Row
                label="Envío"
                value={
                  totals.shipping === 0
                    ? "Gratis"
                    : `$${formatUSD(totals.shipping)}`
                }
                positive={totals.shipping === 0}
              />
              {/*
              {totals.discount > 0 && (
                <Row
                  label="Ahorros"
                  value={`-$${formatUSD(totals.discount)}`}
                  positive
                />
              )}
              */}
              <div className="border-t-hairline border-black/8 pt-2 mt-1 flex items-baseline justify-between">
                <span className="text-[13px] font-medium">Total a pagar</span>
                <span className="price text-[22px]">
                  ${formatUSD(totals.total)}
                </span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Sticky footer */}
      <div
        className="sticky bottom-0 mt-auto bg-white/95 backdrop-blur-md border-t-hairline border-black/10 p-4 flex gap-2 z-10"
        style={{ paddingBottom: `calc(16px + var(--safe-bottom))` }}
      >
        {step === 1 ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!deliveryValid}
            onClick={() => setStep(2)}
          >
            Continuar al pago
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="flex-shrink-0 px-5"
              onClick={() => setStep(1)}
            >
              Atrás
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={finalize}
              disabled={loading}
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirmar · ${formatUSD(totals.total)}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  last,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  last?: boolean;
  mono?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 px-4 h-14",
        !last && "border-b-hairline border-black/6"
      )}
    >
      <span className="h-8 w-8 rounded-lg bg-surface-active flex items-center justify-center text-brand-deep flex-shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10.5px] tracking-[0.12em] uppercase text-ink-subtle font-medium">
          {label}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent outline-none text-[13.5px] tracking-tight placeholder:text-ink-subtle",
            mono && "font-mono"
          )}
        />
      </div>
    </label>
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
