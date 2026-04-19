"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { StoreHydrator } from "./StoreHydrator";
import { cn } from "@/lib/cn";

const NO_NAV_ROUTES = [/^\/checkout/, /^\/order\//, /^\/product\//, /^\/admin/];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = NO_NAV_ROUTES.some((rx) => rx.test(pathname));

  return (
    <div
      className={cn(
        "w-full flex justify-center bg-[#e7ecf7]",
        // En desktop centramos verticalmente con padding;
        // en móvil ocupamos exactamente el viewport dinámico.
        "min-h-[100svh] md:min-h-screen md:items-center md:py-10"
      )}
    >
      <StoreHydrator />
      <div
        className={cn(
          "relative w-full md:max-w-[390px] md:rounded-[44px]",
          "md:shadow-[0_30px_80px_-20px_rgba(26,60,181,0.35)]",
          "bg-surface-base overflow-hidden md:border-hairline md:border-black/10",
          // Altura fija (viewport) — el scroll ocurre dentro, nav siempre visible.
          "h-[100svh] md:h-[820px] flex flex-col"
        )}
      >
        {/* Status bar simulada solo en desktop */}
        <div className="hidden md:flex h-11 items-center justify-between px-7 text-[13px] font-medium tracking-tight text-ink flex-shrink-0">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <SignalIcon /> <WifiIcon /> <BatteryIcon />
          </span>
        </div>

        <div
          key={pathname}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative animate-fade-in"
        >
          {children}
        </div>

        {!hideNav && <BottomNav />}
      </div>
    </div>
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
function WifiIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path
        d="M7.5 10.5a1 1 0 100-2 1 1 0 000 2zM1 4.2a9 9 0 0113 0l-1.4 1.4a7 7 0 00-10.2 0L1 4.2zm2.6 2.6a5 5 0 017.8 0L10 8.2a3 3 0 00-5 0L3.6 6.8z"
        fill="#0a0a0a"
      />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="#0a0a0a" strokeOpacity="0.4" />
      <rect x="2" y="2" width="19" height="8" rx="1.5" fill="#0a0a0a" />
      <rect x="23.5" y="4" width="2" height="4" rx="1" fill="#0a0a0a" fillOpacity="0.4" />
    </svg>
  );
}
