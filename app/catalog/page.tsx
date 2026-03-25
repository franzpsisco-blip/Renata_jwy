"use client";

import React from "react";
import { ProductGrid } from "./product-grid";
import { fetchInventory } from "@/lib/inventory-client";
import {
  getDiscountCaption,
  getDiscountPercentLabel,
  isGlobalDiscountEnabled,
} from "@/lib/discount";

export default function CatalogPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "Bs";

  React.useEffect(() => {
    fetchInventory().then(setProducts);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-3xl">Catálogo</h2>
        <p className="text-sm text-black/70">
          Joyería vintage aesthetic en Bolivia — piezas seleccionadas para brillar.
        </p>
        {isGlobalDiscountEnabled() ? (
          <div className="mt-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-soft">
            <b>{getDiscountPercentLabel()}</b>{" "}
            <span className="font-semibold text-black/70">{getDiscountCaption()}</span>
          </div>
        ) : null}
      </div>
      <ProductGrid products={products} currencySymbol={currencySymbol} />
    </main>
  );
}
