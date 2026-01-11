import type { Product } from "./types";

export async function fetchInventory(): Promise<Product[]> {
  const res = await fetch("data/inventory.json", { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as Product[];
  return Array.isArray(data) ? data : [];
}
