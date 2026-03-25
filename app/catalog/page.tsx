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

function normalizeCategory(category?: string) {
  if (!category || !category.trim()) return "Otros";
  return category.trim();
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
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

        const cleaned: Product[] = data.map((item: Product) => ({
          ...item,
          category: normalizeCategory(item.category),
        }));

        setProducts(cleaned);
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

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => normalizeCategory(p.category)))
    ).sort((a, b) => a.localeCompare(b));

    return ["Todos", ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === "Todos"
        ? products
        : products.filter(
            (product) => normalizeCategory(product.category) === activeCategory
          );

    return shuffleArray(filtered);
  }, [products, activeCategory]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl">Catálogo</h1>
        <p className="mt-2 text-sm text-black/65">
          Explora por categoría y descubre piezas únicas en cada visita.
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
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:bg-black/5"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-soft">
              No hay productos en esta categoría.
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencySymbol="Bs"
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}
