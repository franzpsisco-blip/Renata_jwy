import type { OrderDraft } from "@/lib/order";

const RAW_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_PRIMARY ||
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
  "59176498138";

function cleanPhone(phone: string) {
  return String(phone || "").replace(/[^\d]/g, "");
}

function formatBs(value: number) {
  return `Bs ${value.toFixed(2)}`;
}

function getDeliveryLabel(method?: OrderDraft["deliveryMethod"]) {
  if (method === "PICKUP") return "Entrega presencial";
  if (method === "DELIVERY") return "A domicilio";
  if (method === "INTERDEPT") return "Interdepartamental";
  return "";
}

function getPaymentLabel(method?: OrderDraft["paymentMethod"]) {
  if (method === "PAY_ON_SITE") return "Pago en el sitio";
  if (method === "PAY_QR") return "Pago por QR";
  return "";
}

export function buildWhatsAppLink(orderId: string, data: OrderDraft) {
  const phone = cleanPhone(RAW_PHONE);

  const itemsText = data.items
    .map((item, index) => {
      const lineTotal = item.unitPrice * item.qty;
      return `${index + 1}. ${item.name} x${item.qty} — ${formatBs(lineTotal)}`;
    })
    .join("\n");

  const extra = [
    data.deliveryMethod ? `🚚 Entrega: ${getDeliveryLabel(data.deliveryMethod)}` : null,
    data.address ? `📍 Dirección: ${data.address}` : null,
    data.deliveryDate ? `📅 Fecha: ${data.deliveryDate}` : null,
    data.deliveryTime ? `⏰ Hora: ${data.deliveryTime}` : null,
    data.interdeptDepartment ? `🏙️ Departamento: ${data.interdeptDepartment}` : null,
    data.paymentMethod ? `💳 Pago: ${getPaymentLabel(data.paymentMethod)}` : null,
    data.notes ? `📝 Observaciones: ${data.notes}` : null,
  ].filter(Boolean);

  const message = [
    `🎀 Hola, quiero confirmar mi pedido`,
    ``,
    `✨ Pedido: ${orderId}`,
    `🙋 Nombre: ${data.customerName}`,
    `📱 Teléfono: ${data.customerPhone}`,
    ``,
    `🛍️ Productos:`,
    itemsText,
    ``,
    `💖 Subtotal: ${formatBs(data.subtotal)}`,
    ...(extra.length ? ["", ...extra] : []),
    ``,
    `Gracias ✨`,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
