import { z } from "zod";

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

export const OrderItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => String(v)),
  name: z.string().min(1, "Nombre del producto requerido"),
  unitPrice: z.number().nonnegative("Precio inválido"),
  qty: z.number().int().positive("Cantidad inválida"),
});

export const OrderDraftSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Debes añadir al menos un producto"),
  subtotal: z.number().nonnegative("Subtotal inválido"),

  deliveryMethod: z
    .union([z.literal("PICKUP"), z.literal("DELIVERY"), z.literal("INTERDEPT")])
    .optional(),

  address: z.string().trim().optional(),
  deliveryDate: z.string().trim().optional(),
  deliveryTime: z.string().trim().optional(),
  interdeptDepartment: InterdeptDepartmentSchema.optional(),

  paymentMethod: z
    .union([z.literal("PAY_ON_SITE"), z.literal("PAY_QR")])
    .optional(),

  customerName: z.string().trim().min(2, "Nombre requerido"),
  customerPhone: z.string().trim().min(6, "Teléfono requerido"),

  notes: z.string().trim().optional(),
});

export type OrderDraft = z.infer<typeof OrderDraftSchema>;

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
