"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function TopBar({
  title,
  right,
  transparent,
}: {
  title?: string;
  right?: React.ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "h-14 px-5 flex items-center justify-between",
        transparent ? "absolute top-0 left-0 right-0 z-10" : "bg-surface-base"
      )}
    >
      <button
        onClick={() => router.back()}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center tap border-hairline",
          transparent
            ? "bg-white/80 backdrop-blur border-white/40"
            : "bg-white border-black/8 shadow-soft"
        )}
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      {title && (
        <h1 className="text-[15px] font-medium tracking-tight">{title}</h1>
      )}
      {right ? (
        <div>{right}</div>
      ) : (
        <div className="h-10 w-10" />
      )}
    </div>
  );
}
