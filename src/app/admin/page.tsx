"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, AlertTriangle } from "lucide-react";
import { PRODUCTS, SEDES, CATEGORIES, type Category } from "@/data/products";
import { useInventory } from "@/store/inventory";
import { cn, formatUSD } from "@/lib/cn";

export default function InventoryPage() {
  const stock = useInventory((s) => s.stock);
  const adjust = useInventory((s) => s.adjust);

  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => cat === "all" || p.category === cat).filter(
      (p) =>
        q.trim()
          ? `${p.name} ${p.brand} ${p.id}`.toLowerCase().includes(q.toLowerCase())
          : true
    );
  }, [cat, q]);

  const kpi = useMemo(() => {
    let units = 0;
    let value = 0;
    let low = 0;
    let out = 0;
    for (const p of PRODUCTS) {
      const s = stock[p.id] ?? p.stock;
      const total = Object.values(s).reduce((a, b) => a + b, 0);
      units += total;
      value += total * p.price;
      if (total === 0) out++;
      else if (total <= 2) low++;
    }
    return { units, value, low, out };
  }, [stock]);

  return (
    <div className="pb-6">
      {/* KPIs */}
      <section className="px-5 grid grid-cols-2 gap-2.5">
        <Kpi label="Unidades" value={`${kpi.units}`} sub="En todas las sedes" />
        <Kpi label="Valor USD" value={`$${formatUSD(kpi.value)}`} sub="Precio público" />
        <Kpi label="Stock bajo" value={`${kpi.low}`} sub="≤ 2 unidades" warn />
        <Kpi label="Agotados" value={`${kpi.out}`} sub="Sin stock" danger />
      </section>

      {/* Search */}
      <section className="mt-5 px-5">
        <div className="flex items-center h-11 px-4 gap-2.5 rounded-2xl bg-white border-hairline border-black/8 shadow-soft">
          <Search size={16} className="text-ink-muted" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por SKU, marca o modelo"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-ink-subtle"
          />
        </div>
      </section>

      {/* Cat chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar px-5">
        <button
          onClick={() => setCat("all")}
          className={cn(
            "flex-shrink-0 h-8 px-3.5 rounded-full text-[11.5px] font-medium tracking-tight tap border-hairline",
            cat === "all"
              ? "text-white bg-brand-gradient border-transparent"
              : "text-ink bg-white border-black/10"
          )}
        >
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "flex-shrink-0 h-8 px-3.5 rounded-full text-[11.5px] font-medium tracking-tight tap border-hairline",
              cat === c.id
                ? "text-white bg-brand-gradient border-transparent"
                : "text-ink bg-white border-black/10"
            )}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <section className="mt-4 px-5 space-y-2">
        {list.map((p) => {
            const s = stock[p.id] ?? p.stock;
            const total = Object.values(s).reduce((a, b) => a + b, 0);
            const statusColor =
              total === 0
                ? "text-danger"
                : total <= 2
                ? "text-amber-600"
                : "text-success";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-surface-base flex items-center justify-center text-[26px] flex-shrink-0">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="brand-label">{p.brand}</span>
                      <span className="text-[9.5px] font-mono text-ink-subtle tracking-tight">
                        #{p.id}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-medium tracking-tight line-clamp-1">
                      {p.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="price text-[12.5px]">
                        ${formatUSD(p.price)}
                      </span>
                      <span
                        className={cn(
                          "text-[10.5px] font-medium tracking-tight",
                          statusColor
                        )}
                      >
                        {total === 0
                          ? "Agotado"
                          : total <= 2
                          ? `${total} · stock bajo`
                          : `${total} en stock`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {SEDES.map((sede) => {
                    const qty = s[sede] ?? 0;
                    return (
                      <div
                        key={sede}
                        className="rounded-xl bg-surface-active p-2 border-hairline border-black/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="brand-label">{sede}</div>
                            <div className="mt-0.5 text-[15px] font-medium font-mono tracking-tight">
                              {qty}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => adjust(p.id, sede, -1)}
                              className="h-7 w-7 rounded-full bg-white border-hairline border-black/8 flex items-center justify-center tap"
                            >
                              <Minus size={11} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => adjust(p.id, sede, 1)}
                              className="h-7 w-7 rounded-full bg-brand-gradient text-white flex items-center justify-center tap"
                            >
                              <Plus size={11} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {total === 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-danger">
                    <AlertTriangle size={11} />
                    Repón stock o genera una transferencia entre sedes.
                  </div>
                )}
              </div>
            );
          })}
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  warn,
  danger,
}: {
  label: string;
  value: string;
  sub: string;
  warn?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-3 border-hairline shadow-soft",
        danger
          ? "bg-danger/8 border-danger/15"
          : warn
          ? "bg-amber-50 border-amber-200/60"
          : "bg-white border-black/8"
      )}
    >
      <div className="brand-label">{label}</div>
      <div
        className={cn(
          "mt-1 text-[22px] font-medium tracking-tight font-mono",
          danger ? "text-danger" : warn ? "text-amber-700" : "text-ink"
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-ink-muted">{sub}</div>
    </div>
  );
}
