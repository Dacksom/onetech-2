"use client";

import Link from "next/link";
import { useSaved } from "@/store/saved";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";

export default function SavedPage() {
  const ids = useSaved((s) => s.ids);
  const saved = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="pb-6">
      <header className="px-5 pt-6 pb-3">
        <span className="brand-label">Guardados</span>
        <h1 className="text-[22px] font-medium tracking-tight">
          Tu lista de deseos.
        </h1>
      </header>

      {saved.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <span className="text-6xl">🤍</span>
          <h2 className="mt-4 text-[17px] font-medium">Aún no has guardado nada</h2>
          <p className="mt-2 text-[12.5px] text-ink-muted">
            Toca el corazón en los productos que te gusten.
          </p>
          <Link href="/catalog">
            <Button variant="primary" className="mt-6">
              Explorar catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-3 px-5 grid grid-cols-2 gap-3">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
