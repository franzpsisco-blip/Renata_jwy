import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const xlsxPath = path.join(process.cwd(), "data", "inventory.xlsx");
const outPath = path.join(process.cwd(), "public", "data", "inventory.json");

if (!fs.existsSync(xlsxPath)) {
  console.error("No existe data/inventory.xlsx. Crea o copia tu Excel ahí.");
  process.exit(1);
}

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

function normalizeCategory(v) {
  const s = String(v || "").trim();
  const map = { anillos:"Anillos", collares:"Collares", manillas:"Manillas", carteras:"Carteras", otros:"Otros" };
  const k = s.toLowerCase();
  return map[k] ?? (s || "Otros");
}

const products = rows.map((r) => ({
  id: String(r.id || "").trim(),
  name: String(r.name || "").trim(),
  price: Number(r.price || 0),
  image: String(r.image || "").trim(),
  description: String(r.description || "").trim() || undefined,
  category: normalizeCategory(r.category),
  inStock: r.inStock === "" ? undefined : Number(r.inStock),
})).filter((p) => p.id && p.name);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(products, null, 2), "utf-8");
console.log("OK:", outPath, "productos:", products.length);
