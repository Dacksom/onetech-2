"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "dark";
type Size = "sm" | "md" | "lg";

type Props = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-2xl select-none tap disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-[52px] px-6 text-[15px]",
};

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-brand-gradient shadow-[0_8px_24px_-8px_rgba(26,60,181,0.55)]",
  secondary:
    "text-brand-deep bg-surface-active border-hairline border-brand-deep/20",
  ghost: "text-ink bg-transparent border-hairline border-black/12",
  whatsapp:
    "text-white bg-whatsapp shadow-[0_8px_24px_-8px_rgba(37,211,102,0.55)]",
  dark: "text-white bg-surface-night",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    fullWidth,
    children,
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
