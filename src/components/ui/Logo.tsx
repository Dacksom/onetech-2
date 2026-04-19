import { cn } from "@/lib/cn";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const color = variant === "light" ? "#ffffff" : "#0a0a0a";
  return (
    <div className={cn("inline-flex items-center gap-0", className)}>
      <span
        className="relative inline-flex items-center justify-center mr-[2px]"
        style={{ width: "1em", height: "1em" }}
      >
        <svg
          viewBox="0 0 32 32"
          className="absolute inset-0"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id="o-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3cb5" />
              <stop offset="55%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4db8ff" />
            </linearGradient>
          </defs>
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="url(#o-grad)"
            strokeWidth="3.2"
            fill="none"
          />
          <path d="M13 10.5 L23 16 L13 21.5 Z" fill="url(#o-grad)" />
        </svg>
      </span>
      <span
        style={{ color, letterSpacing: "0.04em" }}
        className="font-medium tracking-tight"
      >
        NETECH
      </span>
    </div>
  );
}
