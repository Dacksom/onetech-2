"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Heart,
  User,
  ShoppingBag,
  Bell,
  Shield,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";
import { Logo } from "@/components/ui/Logo";

const NAV = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/catalog", label: "Catálogo", Icon: LayoutGrid },
  { href: "/saved", label: "Guardados", Icon: Heart },
  { href: "/account", label: "Cuenta", Icon: User },
] as const;

export function DesktopNav() {
  const pathname = usePathname();
  const savedCount = useSaved((s) => s.ids.length);
  const cartCount = useCart((s) => s.items.reduce((n, it) => n + it.qty, 0));

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[240px] z-40 flex flex-col bg-white border-r border-black/6">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 flex-shrink-0">
        <Logo className="h-7" />
        <p className="mt-1.5 text-[11px] text-ink-subtle tracking-[0.14em] uppercase">
          Venezuela · Tecnología
        </p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const badge =
            href === "/saved" ? savedCount : href === "/" ? cartCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 h-11 px-3 rounded-xl transition-colors tap",
                active
                  ? "text-white"
                  : "text-ink-muted hover:text-ink hover:bg-surface-active"
              )}
            >
              {active && (
                <motion.span
                  layoutId="desktop-nav-pill"
                  className="absolute inset-0 rounded-xl bg-brand-gradient"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={active ? 2 : 1.6}
                className="relative z-10 flex-shrink-0"
              />
              <span className="relative z-10 text-[13.5px] font-medium tracking-tight flex-1">
                {label}
              </span>
              {badge > 0 && (
                <span
                  className={cn(
                    "relative z-10 h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-medium flex items-center justify-center",
                    active
                      ? "bg-white/25 text-white"
                      : "bg-brand-deep/10 text-brand-deep"
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="!mt-4 !mb-2 h-px bg-black/6 mx-1" />

        {/* Admin */}
        <Link
          href="/admin"
          className={cn(
            "relative flex items-center gap-3 h-11 px-3 rounded-xl transition-colors tap",
            pathname.startsWith("/admin")
              ? "text-white"
              : "text-ink-muted hover:text-ink hover:bg-surface-active"
          )}
        >
          {pathname.startsWith("/admin") && (
            <motion.span
              layoutId="desktop-nav-pill"
              className="absolute inset-0 rounded-xl bg-brand-gradient"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <Shield
            size={18}
            strokeWidth={pathname.startsWith("/admin") ? 2 : 1.6}
            className="relative z-10 flex-shrink-0"
          />
          <span className="relative z-10 text-[13.5px] font-medium tracking-tight">
            Panel staff
          </span>
        </Link>
      </nav>

      {/* Trust badges */}
      <div className="px-4 py-4 border-t border-black/6 space-y-2.5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-surface-active flex items-center justify-center flex-shrink-0">
            <Truck size={13} className="text-brand-deep" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-ink">Envío nacional</div>
            <div className="text-[10px] text-ink-subtle">Zoom · MRW · Tealca</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-surface-active flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={13} className="text-brand-deep" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-ink">Garantía 4 meses</div>
            <div className="text-[10px] text-ink-subtle">Soporte oficial</div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-6 pt-2 border-t border-black/6 flex items-center justify-between flex-shrink-0">
        <button className="h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center tap hover:bg-surface-active/80 transition-colors">
          <Bell size={16} className="text-ink-muted" strokeWidth={1.5} />
        </button>
        <Link
          href="/cart"
          className="relative h-9 w-9 rounded-xl bg-surface-active flex items-center justify-center tap hover:bg-surface-active/80 transition-colors"
        >
          <ShoppingBag size={16} className="text-ink-muted" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-[16px] min-w-[16px] px-1 rounded-full bg-brand-gradient text-white text-[9px] font-medium flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        <span className="text-[10px] text-ink-subtle tracking-[0.1em] uppercase font-medium">
          v1.0.0
        </span>
      </div>
    </aside>
  );
}
