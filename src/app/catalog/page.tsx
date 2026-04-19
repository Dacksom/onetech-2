"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import { cn } from "@/lib/cn";

function CatalogInner() {
  const sp = useSearchParams();
  const initialCat = (sp.get("cat") as Category | null) ?? null;
  const [cat, setCat] = useState<Category | null>(initialCat);
  const [q, setQ] = useState("");

  const products = useMemo(() => {
    return PRODUCTS.filter((p) => !cat || p.category === cat).filter((p) =>
      q.trim()
        ? `${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase())
        : true
    );
  }, [cat, q]);

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-3">
        <span className="brand-label">Catálogo</span>
        <h1 className="text-[22px] font-medium tracking-tight leading-tight">
          Todo lo que necesitas para tu setup.
        </h1>
      </header>

      <div className="px-5">
        <div className="flex items-center h-11 px-4 gap-2.5 rounded-2xl bg-white border-hairline border-black/8 shadow-soft">
          <Search size={16} className="text-ink-muted" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar en el catálogo"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-ink-subtle"
          />
          <button className="h-7 w-7 rounded-full bg-surface-active flex items-center justify-center">
            <SlidersHorizontal size={13} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar snap-x-rail px-5">
        <button
          onClick={() => setCat(null)}
          className={cn(
            "flex-shrink-0 h-9 px-4 rounded-full text-[12px] font-medium tracking-tight tap border-hairline transition-colors",
            cat === null
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
              "flex-shrink-0 h-9 px-4 rounded-full text-[12px] font-medium tracking-tight tap border-hairline flex items-center gap-1.5",
              cat === c.id
                ? "text-white bg-brand-gradient border-transparent"
                : "text-ink bg-white border-black/10"
            )}
          >
            <span>{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 px-5 flex items-center justify-between">
        <span className="text-[12px] text-ink-muted">
          {products.length} resultados
        </span>
      </div>

      <motion.div layout className="mt-3 px-5 grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {products.map((p) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              key={p.id}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {products.length === 0 && (
        <div className="px-6 py-16 text-center">
          <span className="text-5xl">🔍</span>
          <p className="mt-3 text-[14px] text-ink-muted">
            Sin resultados. Prueba con otro filtro.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[13px] text-ink-muted">Cargando…</div>}>
      <CatalogInner />
    </Suspense>
  );
}
