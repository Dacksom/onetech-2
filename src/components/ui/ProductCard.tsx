"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { type Product, totalStock } from "@/data/products";
import { useSaved } from "@/store/saved";
import { formatUSD, cn } from "@/lib/cn";

export function ProductCard({
  product,
  size = "md",
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
}) {
  const saved = useSaved((s) => s.ids.includes(product.id));
  const toggle = useSaved((s) => s.toggle);
  const stock = totalStock(product);
  const outOfStock = stock === 0;

  const widths = {
    sm: "w-[150px]",
    md: "w-full",
    lg: "w-[220px]",
  }[size];

  return (
    <Link href={`/product/${product.id}`} className={cn("block", widths)}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-surface-card rounded-2xl overflow-hidden border-hairline border-black/8 shadow-soft"
      >
        <div className="relative aspect-square bg-surface-base flex items-center justify-center overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain scale-[1.15] mix-blend-multiply transition-transform duration-500 hover:scale-[1.25]"
              sizes="(max-width: 768px) 50vw, 200px"
            />
          ) : (
            <span
              className="text-[72px] leading-none select-none"
              role="img"
              aria-label={product.name}
            >
              {product.emoji}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center tap border-hairline border-black/8"
          >
            <Heart
              size={15}
              className={saved ? "fill-brand-deep text-brand-deep" : "text-ink-muted"}
            />
          </button>
          {product.priceOriginal && !outOfStock && (
            <span className="absolute top-2 left-2 h-6 px-2 rounded-full bg-brand-gradient text-white text-[10px] font-medium flex items-center tracking-tight">
              -{Math.round(
                ((product.priceOriginal - product.price) / product.priceOriginal) *
                  100
              )}
              %
            </span>
          )}
          {outOfStock && (
            <span className="absolute bottom-2 left-2 h-6 px-2 rounded-full bg-surface-night text-white text-[10px] font-medium flex items-center">
              Agotado
            </span>
          )}
        </div>
        <div className="p-3">
          <span className="brand-label">{product.brand}</span>
          <h3 className="mt-1 text-[13px] leading-tight font-medium tracking-tight line-clamp-2 min-h-[32px]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="price text-[15px]">
              ${formatUSD(product.price)}
            </span>
            {product.priceOriginal && (
              <span className="text-[11px] text-danger line-through font-mono">
                ${formatUSD(product.priceOriginal)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
