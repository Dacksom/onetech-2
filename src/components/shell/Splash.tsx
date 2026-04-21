"use client";

import { useEffect, useState } from "react";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";

/**
 * Splash — pantalla de bienvenida con logo animado.
 * Se muestra solo una vez por sesión (sessionStorage).
 * Duración total ~2.2s + fade-out de 400ms.
 */
export function Splash() {
  // Visible desde SSR para que aparezca en el primer pintado (sin esperar a hidratar).
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #1a3cb5 0%, #2563eb 55%, #4db8ff 100%)",
        opacity: leaving ? 0 : 1,
        transition: "opacity 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      {/* Halo suave */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative w-[72%] max-w-[320px]">
        <AnimatedLogo variant="light" />

        <div
          className="mt-6 text-center text-white/85"
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: 0,
            animation:
              "onetech-tag-in 600ms 1400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
          }}
        >
          Tecnología · Venezuela
        </div>
      </div>

      <style jsx>{`
        @keyframes onetech-tag-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
