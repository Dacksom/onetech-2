"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search, ShoppingBag, Heart, User, Bell,
  ChevronDown, MapPin, Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";
import { useSearch } from "@/store/search";
import { CATEGORIES, BRANDS } from "@/data/products";
import { cn } from "@/lib/cn";

const CATEGORY_NAV = [
  { href: "/catalog", label: "Todos", emoji: "🏬" },
  ...CATEGORIES.map((c) => ({ href: `/catalog?cat=${c.id}`, label: c.label, emoji: c.emoji })),
];

export function DesktopHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [brandsOpen, setBrandsOpen] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, it) => n + it.qty, 0));
  const savedCount = useSaved((s) => s.ids.length);
  const openSearch = useSearch((s) => s.openSearch);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openSearch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
  }

  const activeCat = CATEGORY_NAV.find((c) =>
    c.href !== "/catalog"
      ? pathname.includes(c.href.split("?")[1] ?? "___")
      : pathname === "/catalog" && !CATEGORY_NAV.slice(1).some((cc) => pathname.includes(cc.href))
  );

  return (
    <header className="sticky top-0 z-50 flex flex-col">

      {/* ── Top utility bar ── */}
      <div className="bg-[#0d1f5c] text-white/75 text-[11px] tracking-wide">
        <div className="max-w-[1440px] mx-auto px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} strokeWidth={1.5} />
              Sambil Maracaibo · La Chinita
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={11} strokeWidth={1.5} />
              WhatsApp disponible
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Envío a todo el país · Zoom · MRW · Tealca</span>
            <Link href="/admin" className="hover:text-white transition-colors">Panel Staff →</Link>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <div className="bg-white border-b border-black/8">
        <div className="max-w-[1440px] mx-auto px-6 h-[68px] flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo className="h-8" />
          </Link>

          {/* Search — opens overlay aligned to this button */}
          <button
            ref={searchBtnRef}
            onClick={() => {
              const r = searchBtnRef.current?.getBoundingClientRect();
              if (r) openSearch({ left: r.left, width: r.width, bottom: r.bottom });
              else openSearch();
            }}
            className="flex-1 max-w-[680px] flex items-center h-11 rounded-xl bg-[#f0f4ff] border border-black/8 px-4 gap-3 hover:border-brand-deep/30 hover:bg-[#e8eeff] transition-all text-left"
          >
            <Search size={16} className="text-ink-muted flex-shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-[13.5px] text-ink-subtle">Buscar laptops, monitores, CPUs…</span>
            <span className="text-[11px] text-ink-subtle bg-white border border-black/10 rounded-md px-2 py-0.5 font-mono hidden xl:block">⌘K</span>
          </button>

          {/* Brands dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onMouseEnter={() => setBrandsOpen(true)}
              onMouseLeave={() => setBrandsOpen(false)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl border border-black/8 bg-white text-[13px] font-medium text-ink hover:bg-surface-active transition-colors"
            >
              Marcas <ChevronDown size={14} className="text-ink-muted" />
            </button>
            <AnimatePresence>
              {brandsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setBrandsOpen(true)}
                  onMouseLeave={() => setBrandsOpen(false)}
                  className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] border border-black/8 p-3 min-w-[200px] z-50 grid grid-cols-2 gap-1"
                >
                  {BRANDS.map((b) => (
                    <Link
                      key={b}
                      href={`/catalog?brand=${b}`}
                      className="px-3 py-2 rounded-xl text-[12px] font-medium tracking-wide text-ink-muted hover:bg-surface-active hover:text-ink transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <button className="h-10 w-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-surface-active transition-colors relative">
              <Bell size={18} strokeWidth={1.5} />
            </button>

            <Link
              href="/saved"
              className="h-10 w-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-surface-active transition-colors relative"
            >
              <Heart size={18} strokeWidth={1.5} />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative h-10 px-4 rounded-xl flex items-center gap-2 bg-brand-gradient text-white text-[13px] font-medium hover:opacity-90 transition-opacity ml-1"
            >
              <ShoppingBag size={16} strokeWidth={1.8} />
              Carrito
              {cartCount > 0 && (
                <span className="h-5 min-w-[20px] px-1 rounded-full bg-white/25 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="h-10 w-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-surface-active transition-colors ml-1"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category nav strip ── */}
      <nav className="bg-[#1a3cb5] border-b border-[#1535a0]">
        <div className="max-w-[1440px] mx-auto px-6 h-[44px] flex items-center gap-1">
          {CATEGORY_NAV.map((item) => {
            const currentCat = searchParams.get("cat");
            const isActive =
              item.href === "/catalog"
                ? pathname === "/catalog" && !currentCat
                : pathname.includes("catalog") && currentCat === (item.href.split("?cat=")[1] ?? "");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12.5px] font-medium tracking-tight transition-colors flex-shrink-0",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="text-sm">{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}

          <div className="flex-1" />

          {/* Right side special links */}
          <Link
            href="/catalog?new=1"
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12px] font-medium text-yellow-300 hover:bg-white/10 transition-colors flex-shrink-0"
          >
            ⚡ Nuevos ingresos
          </Link>
          <Link
            href="/catalog?sale=1"
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12px] font-medium text-orange-300 hover:bg-white/10 transition-colors flex-shrink-0"
          >
            🔥 Ofertas
          </Link>
        </div>
      </nav>

    </header>
  );
}
