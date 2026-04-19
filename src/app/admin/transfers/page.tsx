"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Search, Check, Clock, Truck } from "lucide-react";
import { PRODUCTS, SEDES, type Sede } from "@/data/products";
import { useInventory } from "@/store/inventory";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function TransfersPage() {
  const stock = useInventory((s) => s.stock);
  const transfers = useInventory((s) => s.transfers);
  const transfer = useInventory((s) => s.transfer);
  const advance = useInventory((s) => s.advanceTransfer);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [from, setFrom] = useState<Sede>("Sambil Maracaibo");
  const [to, setTo] = useState<Sede>("La Chinita");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const candidates = useMemo(
    () =>
      PRODUCTS.filter((p) =>
        q.trim()
          ? `${p.name} ${p.brand} ${p.id}`.toLowerCase().includes(q.toLowerCase())
          : true
      ).filter((p) => (stock[p.id] ?? p.stock)[from] > 0),
    [q, from, stock]
  );

  const selected = productId ? PRODUCTS.find((p) => p.id === productId) : null;
  const available = selected ? (stock[selected.id] ?? selected.stock)[from] : 0;

  function create() {
    setErr(null);
    if (!selected) return setErr("Selecciona un producto");
    if (from === to) return setErr("Las sedes deben ser distintas");
    if (qty < 1 || qty > available)
      return setErr(`Cantidad inválida (máx ${available})`);
    const t = transfer(selected.id, from, to, qty);
    if (!t) return setErr("No se pudo crear la transferencia");
    setOpen(false);
    setProductId(null);
    setQty(1);
  }

  return (
    <div className="pb-6 relative">
      <section className="px-5 flex items-center justify-between">
        <div>
          <span className="brand-label">Transferencias entre sedes</span>
          <h2 className="text-[18px] font-medium tracking-tight mt-0.5">
            Flujo de stock
          </h2>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} strokeWidth={2} /> Nueva
        </Button>
      </section>

      {transfers.length === 0 ? (
        <div className="mt-6 mx-5 rounded-3xl border-hairline border-dashed border-black/15 px-6 py-10 text-center">
          <span className="text-5xl">🔁</span>
          <p className="mt-3 text-[13.5px] font-medium tracking-tight">
            Aún no hay transferencias
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Mueve stock entre Sambil Maracaibo y La Chinita con un toque.
          </p>
        </div>
      ) : (
        <section className="mt-5 px-5 space-y-2.5">
          {transfers.map((t) => {
              const p = PRODUCTS.find((pr) => pr.id === t.productId);
              if (!p) return null;

              const stages = [
                { key: "pending", label: "Preparando", Icon: Clock },
                { key: "in-transit", label: "En ruta", Icon: Truck },
                { key: "completed", label: "Completada", Icon: Check },
              ] as const;
              const idx = stages.findIndex((s) => s.key === t.status);

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-surface-base flex items-center justify-center text-[24px] flex-shrink-0">
                        {p.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="brand-label">
                          {p.brand} · {t.id}
                        </div>
                        <div className="text-[13px] font-medium tracking-tight line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-ink-muted font-mono">
                          {t.qty} {t.qty === 1 ? "unidad" : "unidades"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => advance(t.id)}
                      disabled={t.status === "completed"}
                      className={cn(
                        "h-8 px-3 rounded-full text-[11px] font-medium tracking-tight tap",
                        t.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-brand-gradient text-white"
                      )}
                    >
                      {t.status === "completed" ? "✓ Completa" : "Avanzar"}
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-surface-active text-ink font-medium">
                      {t.from}
                    </span>
                    <ArrowRight size={12} className="text-ink-subtle" />
                    <span className="px-2.5 py-1 rounded-full bg-brand-gradient-soft text-brand-deep font-medium">
                      {t.to}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1">
                    {stages.map((s, i) => {
                      const done = i <= idx;
                      return (
                        <div key={s.key} className="flex-1 flex items-center gap-1">
                          <div
                            className={cn(
                              "h-1.5 flex-1 rounded-full",
                              done ? "bg-brand-gradient" : "bg-black/8"
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    {stages.map((s, i) => (
                      <span
                        key={s.key}
                        className={cn(
                          "text-[9.5px] tracking-[0.14em] uppercase font-medium",
                          i <= idx ? "text-brand-deep" : "text-ink-subtle"
                        )}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
        </section>
      )}

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-30 p-5 max-h-[80%] overflow-y-auto"
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-black/12 mb-4" />
              <h3 className="text-[16px] font-medium tracking-tight">
                Nueva transferencia
              </h3>
              <p className="text-[11.5px] text-ink-muted">
                Mueve stock entre sedes de ONETECH.
              </p>

              {/* From / To */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Select
                  label="Desde"
                  value={from}
                  onChange={(v) => setFrom(v as Sede)}
                />
                <Select
                  label="Hacia"
                  value={to}
                  onChange={(v) => setTo(v as Sede)}
                />
              </div>

              {/* Search */}
              <div className="mt-3">
                <div className="flex items-center h-10 px-3 gap-2 rounded-xl bg-surface-active border-hairline border-black/8">
                  <Search size={14} className="text-ink-muted" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar producto"
                    className="flex-1 bg-transparent outline-none text-[12.5px]"
                  />
                </div>
              </div>

              <div className="mt-2 max-h-[180px] overflow-y-auto border-hairline border-black/8 rounded-xl divide-y divide-black/5">
                {candidates.length === 0 && (
                  <div className="p-4 text-center text-[11.5px] text-ink-muted">
                    Sin productos disponibles en {from}
                  </div>
                )}
                {candidates.slice(0, 20).map((p) => {
                  const qtyAt = (stock[p.id] ?? p.stock)[from];
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProductId(p.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2.5 tap text-left",
                        productId === p.id && "bg-brand-gradient-soft"
                      )}
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[10.5px] text-ink-muted">
                          {p.brand} · {qtyAt} disp.
                        </div>
                      </div>
                      {productId === p.id && (
                        <Check size={14} className="text-brand-deep" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Qty */}
              {selected && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="brand-label">Cantidad</span>
                    <div className="text-[10.5px] text-ink-muted">
                      Disponibles en {from}: {available}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={available}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
                    className="w-20 h-10 rounded-xl bg-surface-active text-center text-[14px] font-mono font-medium outline-none border-hairline border-black/8"
                  />
                </div>
              )}

              {err && (
                <div className="mt-3 text-[11.5px] text-danger">{err}</div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={create}
                >
                  Crear transferencia
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="brand-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl bg-surface-active border-hairline border-black/8 px-3 text-[12.5px] font-medium outline-none"
      >
        {SEDES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}
