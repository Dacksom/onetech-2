"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, BRANDS } from "@/data/products";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";
import { useSearch } from "@/store/search";

export default function HomePage() {
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const savedCount = useSaved((s) => s.ids.length);
  const openSearch = useSearch((s) => s.openSearch);
  const featured = PRODUCTS.filter((p) => p.highlighted);
  const newArrivals = PRODUCTS.filter((p) => p.estado === "Nuevo").slice(0, 8);

  return (
    <div className="pb-8">

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden px-5 pt-5 pb-3 flex items-center justify-between">
        <Logo className="text-[19px]" />
        <div className="flex items-center gap-2">
          {/* Guardados — reemplaza la campana */}
          <Link
            href="/saved"
            className="relative h-10 w-10 rounded-full bg-white border-hairline border-black/8 flex items-center justify-center tap shadow-soft"
          >
            <Heart size={17} className="text-ink" strokeWidth={1.5} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 h-[16px] min-w-[16px] px-1 rounded-full bg-brand-gradient text-white text-[9px] font-medium flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>
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

      {/* ── Desktop hero — split banners ── */}
      <section className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mb-8 items-stretch">
        {/* Main hero — video background, ratio 16:9 */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0a0a14] aspect-video flex items-end col-span-1">
          {/* Video ocupa el contenedor exacto */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-8 flex-1">
            <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-medium">ONETECH Venezuela</span>
            <h1 className="text-white text-[28px] font-medium tracking-tight leading-tight mt-1 mb-2 drop-shadow-lg">
              Tu setup ideal,<br />al mejor precio.
            </h1>
            <p className="text-white/75 text-[13px] mb-4 drop-shadow">Entrega en todo el país.</p>
            <Link href="/catalog" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-brand-deep text-[12.5px] font-medium hover:bg-white/90 transition-colors">
              Ver catálogo <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Mini banner — Laptops */}
        <Link href="/catalog?cat=laptops" className="relative rounded-2xl overflow-hidden bg-[#0d1f5c] min-h-[200px] flex flex-col justify-end p-5 group hover:scale-[1.01] transition-transform">
          <div className="absolute inset-0 flex items-center justify-center opacity-25 text-[90px]">🖥️</div>
          <span className="relative z-10 text-white/60 text-[10px] tracking-[0.18em] uppercase font-medium">Categoría</span>
          <span className="relative z-10 text-white text-[18px] font-medium tracking-tight mt-0.5">Laptops</span>
          <span className="relative z-10 text-white/50 text-[11px] mt-0.5">Desde $180 USD</span>
        </Link>

        {/* Mini banner — PC Gamer */}
        <Link href="/catalog?cat=pc" className="relative rounded-2xl overflow-hidden bg-[#1a0533] min-h-[200px] flex flex-col justify-end p-5 group hover:scale-[1.01] transition-transform">
          <div className="absolute inset-0 flex items-center justify-center opacity-25 text-[90px]">🎮</div>
          <span className="relative z-10 text-white/60 text-[10px] tracking-[0.18em] uppercase font-medium">Gaming</span>
          <span className="relative z-10 text-white text-[18px] font-medium tracking-tight mt-0.5">PC Gamer</span>
          <span className="relative z-10 text-white/50 text-[11px] mt-0.5">Sets completos</span>
        </Link>
      </section>

      {/* ── Mobile Search ── */}
      <div className="lg:hidden px-5">
        <button
          onClick={() => openSearch()}
          className="w-full flex items-center h-11 px-4 gap-2.5 rounded-2xl bg-white border-hairline border-black/8 shadow-soft tap"
        >
          <Search size={16} className="text-ink-muted" strokeWidth={1.5} />
          <span className="text-[13px] text-ink-muted">Buscar laptops, monitores…</span>
        </button>
      </div>

      {/* ── Mobile video hero ── */}
      <div className="lg:hidden mt-4 mx-5 rounded-2xl overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>



      {/* ── Featured ── */}
      <section className="mt-7">
        <div className="px-5 lg:px-0 flex items-end justify-between">
          <div>
            <span className="brand-label">Destacados</span>
            <h2 className="text-[17px] lg:text-[20px] font-medium tracking-tight">
              Seleccionados para ti
            </h2>
          </div>
          <Link href="/catalog" className="text-[12px] text-brand-deep font-medium">
            Ver todo
          </Link>
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden mt-3 flex gap-3 overflow-x-auto no-scrollbar snap-x-rail px-5">
          {featured.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[170px]">
              <ProductCard product={p} size="sm" />
            </div>
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="hidden lg:grid mt-4 grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="mt-6 px-5 lg:px-0">
        <div className="rounded-2xl bg-white border-hairline border-black/8 p-3 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 shadow-soft">
          {[
            { icon: <Truck size={16} className="text-brand-deep" strokeWidth={1.5} />, title: "Envío nacional", sub: "Zoom, MRW, Tealca" },
            { icon: <ShieldCheck size={16} className="text-brand-deep" strokeWidth={1.5} />, title: "Garantía 4 meses", sub: "Soporte oficial" },
            { icon: <span className="text-base">💳</span>, title: "Zelle / Pago Móvil", sub: "Crypto · Visa · MC" },
            { icon: <span className="text-base">⚡</span>, title: "Entrega rápida", sub: "Sambil + La Chinita" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-[12px] lg:text-[13px] font-medium">{item.title}</div>
                <div className="text-[10.5px] text-ink-muted">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── New arrivals ── */}
      <section className="mt-7 px-5 lg:px-0">
        <div className="flex items-end justify-between">
          <h2 className="text-[17px] lg:text-[20px] font-medium tracking-tight">Nuevos ingresos</h2>
          <span className="brand-label">{newArrivals.length} equipos</span>
        </div>
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Banner ── */}
      <section className="mt-7 px-5 lg:px-0">
        <Link href="/catalog" className="block">
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="/banner-onetech.png"
              alt="Envío gratis en compras superiores a $300"
              width={1200}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </Link>
      </section>

      {/* ── Admin shortcut ── */}
      <section className="mt-6 px-5 lg:px-0">
        <Link
          href="/admin"
          className="flex items-center justify-between rounded-2xl bg-white border-hairline border-black/8 p-4 lg:p-5 shadow-soft tap hover:shadow-md transition-all"
        >
          <div>
            <span className="brand-label">Staff</span>
            <div className="text-[13px] lg:text-[14px] font-medium mt-0.5">Panel de gestión</div>
            <div className="text-[11px] text-ink-muted">Inventario · Transferencias · Cotizaciones</div>
          </div>
          <span className="text-brand-deep text-[13px] font-medium flex items-center gap-1">
            Abrir <ArrowRight size={14} />
          </span>
        </Link>
      </section>
    </div>
  );
}
