"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import { useSearch } from "@/store/search";
import { CATEGORIES, PRODUCTS } from "@/data/products";

const TRENDING = [
  "Laptop Compaq",
  "Monitor 27 pulgadas",
  "PC Gamer",
  "Silla gamer",
  "CPU Intel i5",
];

export function SearchOverlay() {
  const { open, closeSearch, triggerRect } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  /* Focus input when overlay opens */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setQ("");
    }
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeSearch]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    closeSearch();
    router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
  }

  function goTo(href: string) {
    closeSearch();
    router.push(href);
  }

  /* Live results (top 5) */
  const results = q.trim().length > 1
    ? PRODUCTS.filter((p) =>
        `${p.name} ${p.brand} ${p.category}`
          .toLowerCase()
          .includes(q.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop (desktop only) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[79] hidden lg:block bg-black/30 backdrop-blur-[2px]"
          style={{ top: triggerRect ? triggerRect.bottom : 144 }}
          />

          {/* ══ MOBILE: full-screen ══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden fixed inset-0 z-[80] bg-white flex flex-col overflow-hidden"
          >
            {/* Search bar */}
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 32, delay: 0.04 }}
              className="flex-shrink-0 flex items-center gap-3 px-4"
              style={{ paddingTop: `max(16px, env(safe-area-inset-top))` }}
            >
              <button onClick={closeSearch} className="h-10 w-10 rounded-full bg-surface-active flex items-center justify-center tap flex-shrink-0">
                <ArrowLeft size={18} className="text-ink" strokeWidth={1.8} />
              </button>
              <form onSubmit={submit} className="flex-1">
                <div className="flex items-center h-11 rounded-2xl bg-[#f0f4ff] border border-black/8 px-4 gap-3 focus-within:border-brand-deep/40 transition-all">
                  <Search size={15} className="text-ink-muted flex-shrink-0" strokeWidth={1.5} />
                  <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar productos, marcas…" className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-ink-subtle" />
                  {q && <button type="button" onClick={() => setQ("")}><X size={14} className="text-ink-muted" /></button>}
                </div>
              </form>
            </motion.div>

            <div className="h-px bg-black/6 mt-4 flex-shrink-0" />
            <MobileBody q={q} setQ={setQ} results={results} goTo={goTo} inputRef={inputRef} />
          </motion.div>

          {/* ══ DESKTOP: dropdown alineado al search bar ══ */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="hidden lg:flex fixed z-[80] flex-col bg-white rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28)] border border-black/8 overflow-hidden"
            style={{
              top: triggerRect ? triggerRect.bottom + 8 : 160,
              left: triggerRect ? triggerRect.left : "50%",
              width: triggerRect ? triggerRect.width : 640,
              transform: triggerRect ? "none" : "translateX(-50%)",
              maxHeight: "calc(100vh - 200px)",
            }}
          >
            {/* Search input */}
            <form onSubmit={submit} className="flex items-center gap-3 px-5 h-[60px] border-b border-black/8 flex-shrink-0">
              <Search size={17} className="text-ink-muted flex-shrink-0" strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar laptops, monitores, CPUs…"
                className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-ink-subtle"
              />
              {q
                ? <button type="button" onClick={() => setQ("")} className="h-6 w-6 rounded-full bg-surface-active flex items-center justify-center flex-shrink-0"><X size={12} /></button>
                : <kbd className="text-[11px] text-ink-subtle bg-surface-active border border-black/10 rounded-md px-2 py-1 font-mono flex-shrink-0">Esc</kbd>
              }
            </form>

            {/* Body */}
            <div className="overflow-y-auto overscroll-contain">
              <DesktopBody q={q} setQ={setQ} results={results} goTo={goTo} inputRef={inputRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared props
───────────────────────────────────────────────────────── */
type BodyProps = {
  q: string;
  setQ: (v: string) => void;
  results: ReturnType<typeof PRODUCTS.filter>;
  goTo: (href: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

/* ─────────────────────────────────────────────────────────
   MOBILE body — categories with images
───────────────────────────────────────────────────────── */
function MobileBody({ q, setQ, results, goTo, inputRef }: BodyProps) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      <LiveResults q={q} results={results} goTo={goTo} />

      {!q && (
        <>
          <TrendingSection setQ={setQ} inputRef={inputRef} />

          {/* Categories with images */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="px-4 pt-6 pb-10"
          >
            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.05, type: "spring", stiffness: 340, damping: 28 }}
                  onClick={() => goTo(`/catalog?cat=${cat.id}`)}
                  className="flex flex-col items-center gap-2 tap"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={`/categories/${cat.id}.png`}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 390px) 120px"
                    />
                  </div>
                  <span className="text-[12px] font-medium text-ink tracking-tight leading-none">
                    {cat.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DESKTOP body — categories with images, compact
───────────────────────────────────────────────────────── */
function DesktopBody({ q, setQ, results, goTo, inputRef }: BodyProps) {
  return (
    <div className="px-2 py-3">
      <LiveResults q={q} results={results} goTo={goTo} />

      {!q && (
        <>
          <TrendingSection setQ={setQ} inputRef={inputRef} />

          {/* Categories with images — 3 cols */}
          <div className="px-3 pt-4 pb-4">
            <div className="grid grid-cols-6 gap-x-2 gap-y-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => goTo(`/catalog?cat=${cat.id}`)}
                  className="flex flex-col items-center gap-1.5 tap"
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={`/categories/${cat.id}.png`}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <span className="text-[10.5px] font-medium text-ink tracking-tight leading-none">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────────────────────── */
function LiveResults({ q, results, goTo }: Pick<BodyProps, "q" | "results" | "goTo">) {
  return (
    <AnimatePresence>
      {results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 pt-4">
          <p className="brand-label mb-2">Resultados</p>
          <div className="space-y-1">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => goTo(`/product/${p.id}`)}
                className="w-full flex items-center gap-3 h-12 px-3 rounded-xl hover:bg-surface-active transition-colors tap text-left"
              >
                <span className="text-2xl w-8 text-center flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{p.name}</div>
                  <div className="text-[11px] text-ink-muted">{p.brand}</div>
                </div>
                <span className="text-[12px] font-medium text-brand-deep font-mono">${p.price}</span>
              </button>
            ))}
          </div>
          <div className="h-px bg-black/6 mt-3" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TrendingSection({ setQ, inputRef }: Pick<BodyProps, "setQ" | "inputRef">) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="px-4 pt-4">
      <div className="flex items-center gap-2 mb-2.5">
        <TrendingUp size={13} className="text-brand-deep" strokeWidth={1.8} />
        <p className="brand-label">Búsquedas populares</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TRENDING.map((t) => (
          <button
            key={t}
            onClick={() => { setQ(t); inputRef.current?.focus(); }}
            className="h-8 px-3.5 rounded-full bg-surface-active border border-black/8 text-[12px] font-medium text-ink tap hover:bg-brand-gradient hover:text-white hover:border-transparent transition-all"
          >
            {t}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
