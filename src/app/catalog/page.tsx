"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import Image from "next/image";
import { useSearch } from "@/store/search";
import { cn } from "@/lib/cn";

function CatalogInner() {
  const sp = useSearchParams();
  const openSearch = useSearch((s) => s.openSearch);
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
      {/* Header */}
      <header className="px-5 lg:px-0 pt-6 lg:pt-0 pb-3">
        <span className="brand-label">Catálogo</span>
        <h1 className="text-[22px] lg:text-[28px] font-medium tracking-tight leading-tight">
          Todo lo que necesitas<br className="hidden lg:block" /> para tu setup.
        </h1>
      </header>

      {/* Search + filter */}
      <div className="px-5 lg:px-0">
        <div className="flex gap-2">
          <button
            onClick={() => openSearch()}
            className="flex-1 flex items-center h-11 lg:h-12 px-4 gap-2.5 rounded-2xl bg-white border-hairline border-black/8 shadow-soft tap text-left"
          >
            <Search size={16} className="text-ink-muted flex-shrink-0" strokeWidth={1.5} />
            <span className="text-[13px] lg:text-[14px] text-ink-subtle">Buscar en el catálogo</span>
          </button>
          <button className="h-11 lg:h-12 w-11 lg:w-12 rounded-2xl bg-white border-hairline border-black/8 shadow-soft flex items-center justify-center flex-shrink-0">
            <SlidersHorizontal size={14} strokeWidth={1.5} className="text-ink-muted" />
          </button>
        </div>
      </div>

      {/* Category image tiles — scroll on mobile, row on desktop */}
      <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar px-5 lg:px-0 lg:overflow-visible">
        {/* "Todos" tile */}
        <button
          onClick={() => setCat(null)}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 tap"
        >
          <div className={cn(
            "w-[68px] h-[68px] lg:w-[60px] lg:h-[60px] rounded-2xl flex items-center justify-center transition-all",
            cat === null
              ? "bg-brand-gradient ring-2 ring-brand-deep ring-offset-2"
              : "bg-surface-active border border-black/8"
          )}>
            <span className="text-[26px] lg:text-[22px]">🏬</span>
          </div>
          <span className={cn(
            "text-[11px] font-medium tracking-tight leading-none",
            cat === null ? "text-brand-deep" : "text-ink-muted"
          )}>Todos</span>
        </button>

        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 tap"
          >
            <div className={cn(
              "relative w-[68px] h-[68px] lg:w-[60px] lg:h-[60px] rounded-2xl overflow-hidden transition-all",
              cat === c.id && "ring-2 ring-brand-deep ring-offset-2"
            )}>
              <Image
                src={`/categories/${c.id}.png`}
                alt={c.label}
                fill
                className="object-cover"
                sizes="68px"
              />
            </div>
            <span className={cn(
              "text-[11px] font-medium tracking-tight leading-none",
              cat === c.id ? "text-brand-deep" : "text-ink-muted"
            )}>{c.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 px-5 lg:px-0 flex items-center justify-between">
        <span className="text-[12px] text-ink-muted">
          {products.length} resultados{cat ? ` en ${CATEGORIES.find(c => c.id === cat)?.label}` : ""}
        </span>
      </div>

      {/* Product grid — 2 cols mobile, 3 cols desktop */}
      <motion.div
        layout
        className="mt-3 px-5 lg:px-0 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4"
      >
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
