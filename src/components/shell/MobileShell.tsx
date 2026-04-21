"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { BottomNav } from "./BottomNav";
import { DesktopHeader } from "./DesktopHeader";
import { StoreHydrator } from "./StoreHydrator";
import { Splash } from "./Splash";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { cn } from "@/lib/cn";

const NO_NAV_ROUTES = [
  /^\/checkout/,
  /^\/order\//,
  /^\/product\//,
  /^\/admin/,
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = NO_NAV_ROUTES.some((rx) => rx.test(pathname));

  return (
    <>
      <StoreHydrator />
      <Splash />
      <SearchOverlay />

      {/* ── MOBILE (< lg) ── phone frame, unchanged ─────────────────── */}
      <div
        className={cn(
          "lg:hidden w-full flex justify-center bg-[#e7ecf7]",
          "min-h-[100svh]"
        )}
      >
        <div
          className={cn(
            "relative w-full bg-surface-base overflow-hidden",
            "h-[100svh] flex flex-col"
          )}
        >
          <div
            key={pathname}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative animate-fade-in"
            style={{
              paddingBottom: hideNav
                ? undefined
                : `calc(100px + max(18px, env(safe-area-inset-bottom, 18px)))`,
            }}
          >
            {children}
          </div>

          {!hideNav && <BottomNav />}
        </div>
      </div>

      {/* ── DESKTOP (≥ lg) ── top header + full-width content ──────── */}
      <div className="hidden lg:flex flex-col min-h-screen bg-[#eef2fb]">
        <Suspense fallback={<div className="h-[120px] bg-white" />}>
          <DesktopHeader />
        </Suspense>

        <main
          key={pathname}
          className="flex-1 animate-fade-in"
        >
          <div className="max-w-[1440px] mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
      <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="#0a0a0a" />
      <rect x="4" y="5" width="2.5" height="5" rx="0.5" fill="#0a0a0a" />
      <rect x="8" y="3" width="2.5" height="7" rx="0.5" fill="#0a0a0a" />
      <rect x="12" y="0" width="2.5" height="10" rx="0.5" fill="#0a0a0a" />
    </svg>
  );
}
