import { z } from "zod";
import type { OrderDraft } from "./types";

export const InterdeptDepartmentSchema = z.union([
  z.literal("Beni"),
  z.literal("Chuquisaca"),
  z.literal("Cochabamba"),
  z.literal("La Paz"),
  z.literal("Oruro"),
  z.literal("Pando"),
  z.literal("Potosí"),
  z.literal("Santa Cruz"),
  z.literal("Tarija"),
]);

export const OrderDraftSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          unitPrice: z.number().nonnegative(),
          qty: z.number().int().positive(),
        })
      )
      .min(1),
    subtotal: z.number().nonnegative(),

    deliveryMethod: z.union([
      z.literal("PICKUP"),
      z.literal("DELIVERY"),
      z.literal("INTERDEPT"),
    ]),
    address: z.string().optional(),
    deliveryDate: z.string().optional(),
    deliveryTime: z.string().optional(),
    interdeptDepartment: InterdeptDepartmentSchema.optional(),

    paymentMethod: z.union([z.literal("PAY_ON_SITE"), z.literal("PAY_QR")]),

    customerName: z.string().min(2),
    customerPhone: z.string().min(6),
    notes: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.deliveryMethod === "DELIVERY") {
      if (!val.address || val.address.trim().length < 3) {
        ctx.addIssue({ code: "custom", path: ["address"], message: "Dirección requerida" });
      }
      if (!val.deliveryDate) ctx.addIssue({ code: "custom", path: ["deliveryDate"], message: "Fecha requerida" });
      if (!val.deliveryTime) ctx.addIssue({ code: "custom", path: ["deliveryTime"], message: "Hora requerida" });
    }

    if (val.deliveryMethod === "INTERDEPT") {
      if (!val.interdeptDepartment) {
        ctx.addIssue({ code: "custom", path: ["interdeptDepartment"], message: "Departamento requerido" });
      }
      if (!val.address || val.address.trim().length < 3) {
        ctx.addIssue({ code: "custom", path: ["address"], message: "Dirección requerida" });
      }
    }
  }) satisfies z.ZodType<OrderDraft>;

export function createOrderId() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RJ-${yyyy}-${mm}${dd}-${suffix}`;
}

export const PICKUP_INFO = {
  schedule: "Lun–Vie 08:00 a 18:00",
  location: "Mercado 10 de Febrero (frente a BOA)",
};
