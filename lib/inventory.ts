import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { z } from "zod";
import type { Product } from "./types";

const RowSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  price: z.union([z.number(), z.string()]),
  image: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  inStock: z.union([z.number(), z.string()]).optional(),
});

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export function readInventoryFromXlsx(): Product[] {
  const filePath = path.join(process.cwd(), "data", "inventory.xlsx");
  const buffer = fs.readFileSync(filePath);

  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { defval: "" });

  const products: Product[] = [];
  raw.forEach((row: any, idx: number) => {
    const parsed = RowSchema.safeParse(row);
    if (!parsed.success) {
      // Skip invalid rows but keep running
      return;
    }
    const r = parsed.data;
    const price = toNumber(r.price);
    if (!Number.isFinite(price)) return;

    const inStock = r.inStock === undefined || r.inStock === "" ? undefined : toNumber(r.inStock);
    const id = (r.id ?? String(idx + 1)).toString();

    products.push({
      id,
      name: r.name.trim(),
      price,
      image: r.image.trim(),
      description: r.description?.trim() || undefined,
      category: r.category?.trim() || undefined,
      inStock: Number.isFinite(inStock as number) ? (inStock as number) : undefined,
    });
  });

  // deterministic ordering by category then name
  return products.sort((a, b) => {
    const ac = (a.category ?? "").localeCompare(b.category ?? "");
    if (ac !== 0) return ac;
    return a.name.localeCompare(b.name);
  });
}
