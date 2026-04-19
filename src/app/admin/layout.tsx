"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Boxes, ArrowLeftRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Inventario", Icon: Boxes },
  { href: "/admin/transfers", label: "Transferencias", Icon: ArrowLeftRight },
  { href: "/admin/quotes", label: "Cotizaciones", Icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-full pb-24">
      <header className="bg-surface-night text-white px-5 pt-5 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="h-9 w-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center tap"
          >
            <ChevronLeft size={17} strokeWidth={1.6} />
          </button>
          <span className="brand-label !text-white/60">Panel staff</span>
          <div className="h-9 w-9" />
        </div>
        <h1 className="mt-3 text-[24px] font-medium tracking-tight leading-tight">
          Gestión ONETECH
        </h1>
        <p className="text-[12px] text-white/65 max-w-[260px]">
          Inventario, transferencias entre sedes y cotizaciones — todo en un
          solo lugar.
        </p>
      </header>

      <nav className="-mt-3 px-5">
        <div className="bg-white rounded-2xl border-hairline border-black/8 shadow-soft p-1 grid grid-cols-3 relative">
          {TABS.map((t) => {
            const active =
              t.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className="relative h-10 flex items-center justify-center gap-1.5 rounded-xl tap"
              >
                {active && (
                  <motion.span
                    layoutId="admin-pill"
                    className="absolute inset-0 bg-brand-gradient rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span
                  className={cn(
                    "relative flex items-center gap-1.5 text-[11.5px] font-medium tracking-tight",
                    active ? "text-white" : "text-ink-muted"
                  )}
                >
                  <t.Icon size={13} strokeWidth={1.7} />
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4">{children}</div>
    </div>
  );
}
