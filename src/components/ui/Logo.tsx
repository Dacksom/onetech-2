import { cn } from "@/lib/cn";
import Image from "next/image";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo-onetech.svg"
        alt="OneTech"
        width={120}
        height={26}
        className={cn(
          "h-[26px] w-auto",
          variant === "light" && "brightness-0 invert"
        )}
        priority
      />
    </div>
  );
}
