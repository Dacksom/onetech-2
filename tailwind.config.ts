import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#1a3cb5",
          mid: "#2563eb",
          sky: "#4db8ff",
        },
        surface: {
          base: "#f0f4ff",
          card: "#ffffff",
          active: "#eef2ff",
          night: "#0a0a14",
        },
        ink: {
          DEFAULT: "#0a0a0a",
          muted: "rgba(0,0,0,0.45)",
          subtle: "rgba(0,0,0,0.28)",
        },
        success: "#16a34a",
        danger: "#e53e3e",
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #1a3cb5 0%, #2563eb 55%, #4db8ff 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(26,60,181,0.08) 0%, rgba(77,184,255,0.08) 100%)",
      },
      borderWidth: {
        hairline: "0.5px",
      },
      letterSpacing: {
        price: "-0.02em",
        brand: "0.18em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,20,0.04), 0 0 0 0.5px rgba(10,10,20,0.06)",
        lift: "0 8px 28px rgba(26,60,181,0.18)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-up": "slide-up 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "fade-in": "fade-in 200ms ease-out",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
