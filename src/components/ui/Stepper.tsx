"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-1 rounded-full bg-black/8 overflow-hidden">
              <motion.div
                initial={false}
                animate={{
                  width: done ? "100%" : active ? "50%" : "0%",
                }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className={cn(
                  "h-full",
                  done || active ? "bg-brand-gradient" : "bg-transparent"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[9.5px] tracking-[0.16em] uppercase font-medium",
                active
                  ? "text-brand-deep"
                  : done
                  ? "text-ink-muted"
                  : "text-ink-subtle"
              )}
            >
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}
