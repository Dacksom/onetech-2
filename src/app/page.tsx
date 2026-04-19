"use client";

import Link from "next/link";
import { Search, Bell, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, BRANDS } from "@/data/products";
import { useCart } from "@/store/cart";

export default function HomePage() {
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const featured = PRODUCTS.filter((p) => p.highlighted);
  const newArrivals = PRODUCTS.filter((p) => p.estado === "Nuevo").slice(0, 6);

  return (
    <div className="pb-8">
      {/* Top bar */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between">
        <Logo className="text-[19px]" />
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-full bg-white border-hairline border-black/8 flex items-center justify-center tap shadow-soft">
            <Bell size={17} className="text-ink" strokeWidth={1.5} />
          </button>
          <Link
            href="/cart"
            className="relative h-10 w-10 rounded-full bg-white border-hairline border-black/8 flex items-center justify-center tap shadow-soft"
          >
            <ShoppingBag size={17} className="text-ink" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-brand-gradient text-white text-[10px] font-medium flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="px-5">
        <div className="flex items-center h-11 px-4 gap-2.5 rounded-2xl bg-white border-hairline border-black/8 shadow-soft">
          <Search size={16} className="text-ink-muted" strokeWidth={1.5} />
          <span className="text-[13px] text-ink-muted">
            Buscar laptops, monitores…
          </span>
        </div>
      </div>

      {/* Hero with brand gradient */}
      <section className="px-5 mt-5">
        <div className="relative rounded-3xl p-5 overflow-hidden bg-brand-gradient text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="relative">
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/15 backdrop-blur text-[10px] tracking-[0.18em] uppercase font-medium">
              Abril · Semana Tech
            </span>
            <h1 className="mt-3 text-[26px] leading-[1.1] font-medium tracking-tight max-w-[230px]">
              Equipa tu setup con tecnología de verdad.
            </h1>
            <p className="mt-2 text-[12.5px] text-white/80 max-w-[240px] leading-relaxed">
              Precios en USD · Zelle, Pago Móvil y Crypto.
              Envío a toda Venezuela.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="/catalog"
                className="h-10 px-4 rounded-xl bg-white text-brand-deep text-[13px] font-medium flex items-center tap"
              >
                Ver catálogo
              </Link>
              <Link
                href="/product/PC-GAMER-5600"
                className="h-10 px-4 rounded-xl bg-white/15 text-white text-[13px] font-medium flex items-center backdrop-blur tap"
              >
                Combo Gamer
              </Link>
            </div>
          </div>
          <div className="absolute right-2 bottom-2 text-[72px] opacity-90 select-none">
            🎮
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="mt-6">
        <div className="px-5 flex items-end justify-between">
          <h2 className="text-[15px] font-medium tracking-tight">
            Marcas
          </h2>
          <Link
            href="/catalog"
            className="text-[12px] text-brand-deep font-medium"
          >
            Ver todas
          </Link>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar snap-x-rail px-5">
          {BRANDS.map((b) => (
            <button
              key={b}
              className="flex-shrink-0 h-9 px-4 rounded-full border-hairline border-black/10 bg-white brand-label tap"
            >
              {b}
            </button>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6 px-5">
        <h2 className="text-[15px] font-medium tracking-tight">Categorías</h2>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?cat=${c.id}`}
              className="h-[88px] rounded-2xl bg-white border-hairline border-black/8 flex flex-col items-center justify-center gap-1 shadow-soft tap"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[11px] text-ink font-medium tracking-tight">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-7">
        <div className="px-5 flex items-end justify-between">
          <div>
            <span className="brand-label">Destacados</span>
            <h2 className="text-[17px] font-medium tracking-tight">
              Seleccionados para ti
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-[12px] text-brand-deep font-medium"
          >
            Ver todo
          </Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar snap-x-rail px-5">
          {featured.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[170px]">
              <ProductCard product={p} size="sm" />
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mt-6 px-5">
        <div className="rounded-2xl bg-white border-hairline border-black/8 p-3 grid grid-cols-2 gap-3 shadow-soft">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center">
              <Truck size={16} className="text-brand-deep" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[12px] font-medium">Envío nacional</div>
              <div className="text-[10.5px] text-ink-muted">
                Zoom, MRW, Tealca
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center">
              <ShieldCheck size={16} className="text-brand-deep" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[12px] font-medium">Garantía 4 meses</div>
              <div className="text-[10.5px] text-ink-muted">
                Soporte oficial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals grid */}
      <section className="mt-7 px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-[17px] font-medium tracking-tight">
            Nuevos ingresos
          </h2>
          <span className="brand-label">{newArrivals.length} equipos</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Dark banner */}
      <section className="mt-7 px-5">
        <div className="relative rounded-3xl bg-surface-night text-white p-5 overflow-hidden">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 85% 20%, rgba(77,184,255,0.35), transparent 55%)",
            }}
          />
          <div className="relative">
            <span className="brand-label !text-white/60">Envío gratis</span>
            <h3 className="mt-1 text-[20px] font-medium tracking-tight leading-tight max-w-[220px]">
              En compras superiores a $300 dentro del país.
            </h3>
            <Link
              href="/catalog"
              className="mt-4 inline-flex h-10 px-4 rounded-xl bg-white text-brand-deep text-[13px] font-medium items-center tap"
            >
              Aprovechar ahora
            </Link>
          </div>
          <div className="absolute right-4 bottom-3 text-[60px] opacity-90">
            🚚
          </div>
        </div>
      </section>

      {/* Admin shortcut */}
      <section className="mt-6 px-5">
        <Link
          href="/admin"
          className="flex items-center justify-between rounded-2xl bg-white border-hairline border-black/8 p-4 shadow-soft tap"
        >
          <div>
            <span className="brand-label">Staff</span>
            <div className="text-[13px] font-medium mt-0.5">
              Panel de gestión
            </div>
            <div className="text-[11px] text-ink-muted">
              Inventario · Transferencias · Cotizaciones
            </div>
          </div>
          <span className="text-brand-deep text-[13px] font-medium">
            Abrir →
          </span>
        </Link>
      </section>
    </div>
  );
}
