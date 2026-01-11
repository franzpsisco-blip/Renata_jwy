import type { OrderDraft } from "./types";
import { env } from "./env";
import { formatMoney } from "./money";
import { PICKUP_INFO } from "./order";

function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppLink(orderId: string, order: OrderDraft) {
  const lines: string[] = [];
  lines.push(`✨ Renata Jewelry — Nuevo pedido`);
  lines.push(`🧾 Pedido: ${orderId}`);
  lines.push(``);
  lines.push(`👤 Cliente: ${order.customerName}`);
  lines.push(`📞 Tel: ${order.customerPhone}`);

  if (order.deliveryMethod === "DELIVERY") {
    lines.push(`🚚 Entrega: A domicilio (Bolivia)`);
    lines.push(`📍 Dirección: ${order.address}`);
    lines.push(`📅 Fecha: ${order.deliveryDate}`);
    lines.push(`⏰ Hora: ${order.deliveryTime}`);
  } else if (order.deliveryMethod === "INTERDEPT") {
    lines.push(`📦 Envío interdepartamental (Bolivia)`);
    lines.push(`🏷️ Departamento: ${order.interdeptDepartment}`);
    lines.push(`📍 Dirección: ${order.address}`);
  } else {
    lines.push(`🤝 Entrega presencial (Bolivia)`);
    lines.push(`📍 ${PICKUP_INFO.location}`);
    lines.push(`🕒 ${PICKUP_INFO.schedule}`);
  }

  lines.push(``);
  lines.push(`💳 Pago: ${order.paymentMethod === "PAY_QR" ? "QR" : "En el sitio"}`);

  if (order.notes) lines.push(`📝 Notas: ${order.notes}`);

  lines.push(``);
  lines.push(`🛍️ Items:`);
  for (const it of order.items) {
    lines.push(`- ${it.qty} × ${it.name} (${formatMoney(it.unitPrice)})`);
  }

  lines.push(``);
  lines.push(`💰 Subtotal: ${formatMoney(order.subtotal)}`);
  lines.push(``);
  lines.push(`✅ Enviar comprobante en este chat`);

  return waLink(env.WHATSAPP_NUMBER_PRIMARY, lines.join("\n"));
}
