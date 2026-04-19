"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Search,
  Send,
  FileText,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/data/products";
import { useQuotes, type QuoteItem } from "@/store/quotes";
import { formatUSD, cn } from "@/lib/cn";

export default function QuotesPage() {
  const list = useQuotes((s) => s.list);
  const create = useQuotes((s) => s.create);
  const setStatus = useQuotes((s) => s.setStatus);
  const remove = useQuotes((s) => s.remove);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    company: "",
  });
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState(7);

  const total = useMemo(
    () =>
      items.reduce((n, it) => {
        const p = PRODUCTS.find((x) => x.id === it.productId);
        return n + (p ? p.price * it.qty : 0);
      }, 0),
    [items]
  );

  const candidates = PRODUCTS.filter((p) =>
    q.trim()
      ? `${p.name} ${p.brand} ${p.id}`.toLowerCase().includes(q.toLowerCase())
      : true
  );

  function addItem(id: string) {
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === id);
      if (exists)
        return prev.map((i) =>
          i.productId === id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { productId: id, qty: 1 }];
    });
  }

  function qtyChange(id: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function finalize() {
    if (!customer.name || !customer.phone || items.length === 0) return;
    create({ customer, items, notes, validDays, total });
    setOpen(false);
    setItems([]);
    setCustomer({ name: "", phone: "", company: "" });
    setNotes("");
  }

  return (
    <div className="pb-6 relative">
      <section className="px-5 flex items-center justify-between">
        <div>
          <span className="brand-label">Cotizaciones</span>
          <h2 className="text-[18px] font-medium tracking-tight mt-0.5">
            Gestión comercial
          </h2>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus size={14} strokeWidth={2} /> Nueva
        </Button>
      </section>

      {list.length === 0 ? (
        <div className="mt-6 mx-5 rounded-3xl border-hairline border-dashed border-black/15 px-6 py-10 text-center">
          <span className="text-5xl">📄</span>
          <p className="mt-3 text-[13.5px] font-medium tracking-tight">
            Sin cotizaciones aún
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Arma una cotización con varios equipos en segundos.
          </p>
        </div>
      ) : (
        <section className="mt-5 px-5 space-y-2.5">
          {list.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <span className="brand-label">{q.id}</span>
                    <div className="text-[13.5px] font-medium tracking-tight mt-0.5">
                      {q.customer.name}
                    </div>
                    <div className="text-[11px] text-ink-muted font-mono">
                      {q.customer.phone}
                      {q.customer.company ? ` · ${q.customer.company}` : ""}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "h-6 px-2 rounded-full text-[10px] font-medium flex items-center",
                      q.status === "draft" && "bg-black/6 text-ink-muted",
                      q.status === "sent" && "bg-brand-gradient-soft text-brand-deep",
                      q.status === "accepted" && "bg-success/10 text-success",
                      q.status === "expired" && "bg-danger/10 text-danger"
                    )}
                  >
                    {q.status === "draft"
                      ? "Borrador"
                      : q.status === "sent"
                      ? "Enviada"
                      : q.status === "accepted"
                      ? "Aceptada"
                      : "Expirada"}
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-surface-active divide-y divide-black/5 border-hairline border-black/6 overflow-hidden">
                  {q.items.map((it) => {
                    const p = PRODUCTS.find((pr) => pr.id === it.productId);
                    if (!p) return null;
                    return (
                      <div
                        key={it.productId}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <span className="text-[18px]">{p.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] font-medium line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-ink-muted font-mono">
                            {it.qty} × ${formatUSD(p.price)}
                          </div>
                        </div>
                        <span className="text-[11.5px] font-mono font-medium">
                          ${formatUSD(p.price * it.qty)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="brand-label">Total</div>
                    <div className="price text-[18px]">
                      ${formatUSD(q.total)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {q.status === "draft" && (
                      <button
                        onClick={() => setStatus(q.id, "sent")}
                        className="h-8 px-3 rounded-full bg-brand-gradient text-white text-[11px] font-medium flex items-center gap-1 tap"
                      >
                        <Send size={11} /> Enviar
                      </button>
                    )}
                    {q.status === "sent" && (
                      <button
                        onClick={() => setStatus(q.id, "accepted")}
                        className="h-8 px-3 rounded-full bg-success text-white text-[11px] font-medium tap"
                      >
                        Marcar aceptada
                      </button>
                    )}
                    <button
                      onClick={() => remove(q.id)}
                      className="h-8 w-8 rounded-full bg-surface-active flex items-center justify-center text-ink-muted tap"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </section>
      )}

      {/* Create sheet */}
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
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-30 p-5 max-h-[88%] overflow-y-auto"
            >
              <div className="mx-auto h-1 w-10 rounded-full bg-black/12 mb-4" />
              <h3 className="text-[16px] font-medium tracking-tight">
                Nueva cotización
              </h3>

              {/* Customer */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Input
                  label="Cliente"
                  value={customer.name}
                  onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
                />
                <Input
                  label="Teléfono"
                  mono
                  value={customer.phone}
                  onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Empresa (opcional)"
                  value={customer.company}
                  onChange={(v) => setCustomer((c) => ({ ...c, company: v }))}
                />
              </div>

              {/* Product search */}
              <div className="mt-4">
                <span className="brand-label">Agregar productos</span>
                <div className="mt-1.5 flex items-center h-10 px-3 gap-2 rounded-xl bg-surface-active border-hairline border-black/8">
                  <Search size={14} className="text-ink-muted" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar producto"
                    className="flex-1 bg-transparent outline-none text-[12.5px]"
                  />
                </div>
                <div className="mt-2 max-h-[140px] overflow-y-auto border-hairline border-black/8 rounded-xl divide-y divide-black/5">
                  {candidates.slice(0, 20).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addItem(p.id)}
                      className="w-full flex items-center gap-2.5 p-2.5 tap text-left hover:bg-surface-active"
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[10.5px] text-ink-muted">
                          {p.brand} · ${formatUSD(p.price)}
                        </div>
                      </div>
                      <Plus size={13} className="text-brand-deep" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected items */}
              {items.length > 0 && (
                <div className="mt-4">
                  <span className="brand-label">En esta cotización</span>
                  <div className="mt-1.5 rounded-xl bg-surface-active divide-y divide-black/5 border-hairline border-black/6 overflow-hidden">
                    {items.map((it) => {
                      const p = PRODUCTS.find((x) => x.id === it.productId)!;
                      return (
                        <div
                          key={it.productId}
                          className="flex items-center gap-2 p-2.5"
                        >
                          <span className="text-lg">{p.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[10.5px] font-mono text-ink-muted">
                              ${formatUSD(p.price * it.qty)}
                            </div>
                          </div>
                          <div className="flex items-center h-7 rounded-full bg-white border-hairline border-black/8">
                            <button
                              onClick={() => qtyChange(it.productId, -1)}
                              className="h-7 w-7 flex items-center justify-center tap"
                            >
                              <Minus size={10} strokeWidth={2} />
                            </button>
                            <span className="w-5 text-center text-[11px] font-mono">
                              {it.qty}
                            </span>
                            <button
                              onClick={() => qtyChange(it.productId, 1)}
                              className="h-7 w-7 flex items-center justify-center tap"
                            >
                              <Plus size={10} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="brand-label">Total</span>
                    <span className="price text-[18px]">
                      ${formatUSD(total)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Input
                  label="Validez (días)"
                  mono
                  value={`${validDays}`}
                  onChange={(v) => setValidDays(Math.max(1, +v || 1))}
                />
                <Input
                  label="Nota"
                  value={notes}
                  onChange={(v) => setNotes(v)}
                />
              </div>

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
                  onClick={finalize}
                  disabled={!customer.name || !customer.phone || items.length === 0}
                >
                  <FileText size={14} /> Generar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="brand-label">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 rounded-xl bg-surface-active border-hairline border-black/8 px-3 text-[12.5px] outline-none",
          mono && "font-mono font-medium tracking-tight"
        )}
      />
    </label>
  );
}
