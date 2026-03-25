import type { Product } from "./types";

export async function fetchInventory(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const res = await fetch(`${base}/data/inventory.json`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as Product[];
  return Array.isArray(data) ? data : [];
}
