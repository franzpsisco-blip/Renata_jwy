"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

type Props = { products: Product[]; currencySymbol: string };

const CATEGORY_LABELS: { key: string; label: string }[] = [
  { key: "Anillos", label: "Anillos" },
  { key: "Collares", label: "Collares" },
  { key: "Manillas", label: "Manillas" },
  { key: "Carteras", label: "Carteras" },
  { key: "Otros", label: "Otros" },
];

function normalize(s: string) {
  return (s ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ProductGrid({ products, currencySymbol }: Props) {
  const [q, setQ] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("Todos");
  const [seed, setSeed] = React.useState(0);

  React.useEffect(() => {
    setSeed((s) => s + 1);
  }, [q, activeCategory]);

  const filtered = React.useMemo(() => {
    const nq = normalize(q.trim());
    return products.filter((p) => {
      const cat = (p.category ?? "Otros").trim() || "Otros";
      const catOk = activeCategory === "Todos" ? true : cat === activeCategory;
      if (!catOk) return false;
      if (!nq) return true;
      const hay = normalize(`${p.name} ${p.description ?? ""} ${cat}`);
      return hay.includes(nq);
    });
  }, [products, q, activeCategory]);

  const randomized = React.useMemo(() => shuffle(filtered), [filtered, seed]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("Todos")}
            className={`rounded-full border px-4 py-2 text-sm shadow-soft ${
              activeCategory === "Todos" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
            }`}
          >
            Todos
          </button>
          {CATEGORY_LABELS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCategory(c.key)}
              className={`rounded-full border px-4 py-2 text-sm shadow-soft ${
                activeCategory === c.key ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="w-full md:max-w-sm">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar… (ej: anillo, perlas, dorado)" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {randomized.map((p) => (
          <ProductCard key={p.id} product={p} currencySymbol={currencySymbol} />
        ))}
      </div>

      {randomized.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 text-sm text-black/70 shadow-soft">
          No encontramos productos con esos filtros.
        </div>
      ) : null}
    </div>
  );
}
