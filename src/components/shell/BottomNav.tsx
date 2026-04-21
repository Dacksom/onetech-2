"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import { useSaved } from "@/store/saved";

const TABS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/catalog", label: "Catálogo", Icon: LayoutGrid },
  { href: "/cart", label: "Carrito", Icon: ShoppingBag },
  { href: "/account", label: "Cuenta", Icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const savedCount = useSaved((s) => s.ids.length);
  const cartCount = useCart((s) => s.items.reduce((n, it) => n + it.qty, 0));

  return (
    <div
      className={cn(
        // Móvil: fixed al viewport del navegador → siempre visible
        // sin importar si Chrome/Safari tiene barra arriba o abajo.
        // Desktop (md): absolute dentro del frame del teléfono.
        "pointer-events-none z-30 flex justify-center px-4",
        "fixed inset-x-0 bottom-0",
        "md:absolute md:inset-x-0 md:bottom-0",
      )}
      style={{ paddingBottom: `max(18px, env(safe-area-inset-bottom, 18px))` }}
    >
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
        className={cn(
          "pointer-events-auto w-full max-w-[360px]",
          "bg-white/85 backdrop-blur-xl",
          "border-hairline border-black/8",
          "rounded-full",
          "shadow-[0_18px_40px_-12px_rgba(26,60,181,0.28),0_4px_10px_-4px_rgba(0,0,0,0.08)]"
        )}
      >
        <ul className="relative grid grid-cols-4 h-[62px] px-1.5">
          {TABS.map(({ href, label, Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            const badge =
              href === "/cart"
                ? cartCount
                : href === "/"
                  ? cartCount
                  : 0;

            return (
              <li key={href} className="relative flex items-center justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  className="relative h-full w-full flex items-center justify-center tap"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill-bg"
                      className="absolute inset-y-1.5 inset-x-1.5 rounded-full bg-brand-gradient"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  )}

                  <motion.div
                    className="relative flex flex-col items-center justify-center gap-0.5"
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  >
                    <div className="relative">
                      <Icon
                        size={20}
                        strokeWidth={active ? 2 : 1.6}
                        className={cn(
                          "transition-colors relative z-10",
                          active ? "text-white" : "text-ink-muted"
                        )}
                      />

                      {/* Badge */}
                      {badge > 0 && (
                        <span
                          className={cn(
                            "absolute -top-1 -right-2 h-[14px] min-w-[14px] px-1 rounded-full text-[9px] font-medium flex items-center justify-center z-20 border-hairline border-white",
                            active
                              ? "bg-white text-brand-deep"
                              : "bg-brand-deep text-white"
                          )}
                        >
                          {badge}
                        </span>
                      )}
                    </div>

                    <span
                      className={cn(
                        "relative z-10 text-[9.5px] font-medium tracking-tight leading-none transition-colors",
                        active ? "text-white" : "text-ink-muted"
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}
