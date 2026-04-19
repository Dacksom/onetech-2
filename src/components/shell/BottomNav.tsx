"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";

const TABS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/catalog", label: "Catálogo", Icon: LayoutGrid },
  { href: "/saved", label: "Guardados", Icon: Heart },
  { href: "/account", label: "Cuenta", Icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const savedCount = useSaved((s) => s.ids.length);
  const cartCount = useCart((s) => s.items.reduce((n, it) => n + it.qty, 0));

  return (
    <nav
      className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t-hairline border-black/10"
      style={{ paddingBottom: `max(8px, var(--safe-bottom))` }}
    >
      <div className="grid grid-cols-4 h-[64px]">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const badge =
            href === "/saved" ? savedCount : href === "/" ? cartCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 tap"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute top-1 h-[3px] w-8 rounded-full bg-brand-gradient"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.5}
                  className={cn(
                    "transition-colors",
                    active ? "text-brand-deep" : "text-ink-muted"
                  )}
                />
                {badge > 0 && href === "/saved" && (
                  <span className="absolute -top-1 -right-2 h-[14px] min-w-[14px] px-1 rounded-full bg-brand-deep text-white text-[9px] font-medium flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] tracking-tight",
                  active ? "text-brand-deep font-medium" : "text-ink-muted"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
