import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

const filePath = path.join(process.cwd(), "data", "inventory.xlsx");
if (!fs.existsSync(filePath)) {
  console.error("Missing data/inventory.xlsx");
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);
const wb = XLSX.read(buffer, { type: "buffer" });
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

let ok = 0, bad = 0;
for (const [i, r] of rows.entries()) {
  const name = (r.name ?? "").toString().trim();
  const price = (r.price ?? "").toString().trim();
  const image = (r.image ?? "").toString().trim();
  if (!name || !price || !image) {
    bad++;
    console.log(`Row ${i+2}: missing required fields (name/price/image)`);
  } else ok++;
}
console.log(`✅ Valid rows: ${ok}`);
if (bad) {
  console.log(`⚠️ Invalid rows: ${bad}`);
  process.exit(1);
}
