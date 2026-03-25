"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const basePath = process.env.NODE_ENV === "production" ? "/Renata_jwy" : "";

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${basePath}/data/inventory.json`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`No se pudo cargar inventory.json (${res.status})`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("El inventario no tiene formato de lista.");
        }

        const randomized = shuffleArray(data);
        setProducts(randomized);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("No se pudieron cargar los productos.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [basePath]);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl">Catálogo</h1>
        <p className="mt-2 text-sm text-black/65">
          Elige tus piezas favoritas y añádelas al carrito.
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-soft">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-soft">
          {error}
        </div>
      ) : !hasProducts ? (
        <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-soft">
          No hay productos disponibles.
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencySymbol="Bs"
            />
          ))}
        </section>
      )}
    </main>
  );
}
