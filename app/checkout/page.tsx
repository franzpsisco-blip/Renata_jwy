"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatMoney } from "@/lib/money";
import { OrderDraftSchema, PICKUP_INFO } from "@/lib/order";
import type { DeliveryMethod, InterdeptDepartment } from "@/lib/types";

function resolveImageSrc(image: string) {
  if (!image) return "/products/placeholder.svg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/products/${image}`;
}

const INTERDEPT_OPTIONS: InterdeptDepartment[] = ["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, setQty, remove, clear } = useCart();

  const [deliveryMethod, setDeliveryMethod] = React.useState<DeliveryMethod>("DELIVERY");
  const [paymentMethod, setPaymentMethod] = React.useState<"PAY_ON_SITE" | "PAY_QR">("PAY_QR");

  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");

  const [address, setAddress] = React.useState("");
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [deliveryTime, setDeliveryTime] = React.useState("");
  const [interdeptDepartment, setInterdeptDepartment] = React.useState<InterdeptDepartment>("Oruro");

  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (deliveryMethod === "PICKUP") {
      setAddress(PICKUP_INFO.location);
      setDeliveryDate("");
      setDeliveryTime("");
    }
  }, [deliveryMethod]);

  async function placeOrder() {
  setError(null);

  const payload = {
    items: items.map((it) => ({
      id: it.product.id,
      name: it.product.name,
      unitPrice: it.product.price,
      qty: it.qty,
    })),
    subtotal,
    deliveryMethod,
    address: deliveryMethod === "PICKUP" ? PICKUP_INFO.location : address,
    deliveryDate: deliveryMethod === "DELIVERY" ? deliveryDate : undefined,
    deliveryTime: deliveryMethod === "DELIVERY" ? deliveryTime : undefined,
    interdeptDepartment: deliveryMethod === "INTERDEPT" ? interdeptDepartment : undefined,
    paymentMethod,
    customerName,
    customerPhone,
    notes: notes || undefined,
  };

  const parsed = OrderDraftSchema.safeParse(payload);
  if (!parsed.success) {
    setError("Completa: nombre y teléfono. Para entrega a domicilio: dirección, fecha y hora. Para interdepartamental: departamento y dirección.");
    return;
  }

  setLoading(true);
  try {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderId = `RJ-${yyyy}-${mm}${dd}-${suffix}`;

    const { buildWhatsAppLink } = await import("@/lib/whatsapp");
    const waCustomer = buildWhatsAppLink(orderId, payload as any);

    clear();
    router.push(`/success?orderId=${encodeURIComponent(orderId)}&pay=${encodeURIComponent(paymentMethod)}&wa=${encodeURIComponent(waCustomer)}`);
  } catch (e: any) {
    setError(e?.message ?? "Error desconocido");
  } finally {
    setLoading(false);
  }
}


  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="font-display text-3xl">Finalizar pedido</h2>
      <p className="mt-2 text-sm text-black/70">
        Joyería vintage en Bolivia. Completa los datos y envía tu pedido por WhatsApp.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <div className="text-lg font-medium">Tu carrito está vacío</div>
          <p className="mt-2 text-sm text-black/70">Explora el catálogo y agrega tus piezas favoritas.</p>
          <div className="mt-6">
            <Link href="/catalog"><Button>Ir al catálogo</Button></Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3 rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="text-base font-medium">Tu pedido</div>
            <div className="mt-4 space-y-4">
              {items.map((it) => (
                <div key={it.product.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-16 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                    <Image src={resolveImageSrc(it.product.image)} alt={it.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{it.product.name}</div>
                    <div className="text-sm text-black/60">{formatMoney(it.product.price)} c/u</div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-black/60">Cantidad</label>
                      <input
                        className="w-20 rounded-2xl border border-black/10 px-3 py-1 text-sm outline-none shadow-soft focus:ring-2 focus:ring-black/15"
                        type="number"
                        min={1}
                        max={99}
                        value={it.qty}
                        onChange={(e) => setQty(it.product.id, Number(e.target.value))}
                      />
                      <button className="text-xs text-black/60 hover:underline" onClick={() => remove(it.product.id)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatMoney(it.product.price * it.qty)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
              <div className="text-sm text-black/70">Subtotal</div>
              <div className="text-lg font-medium">{formatMoney(subtotal)}</div>
            </div>
          </section>

          <section className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="text-base font-medium">Datos del cliente</div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-black/60">Nombre *</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Tu nombre" />
              </div>

              <div>
                <label className="text-xs text-black/60">Teléfono *</label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="WhatsApp / contacto" />
              </div>

              <div className="pt-2">
                <label className="text-xs text-black/60">Tipo de entrega</label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <button
                    className={`rounded-2xl border px-3 py-2 text-sm shadow-soft ${
                      deliveryMethod === "PICKUP" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setDeliveryMethod("PICKUP")}
                    type="button"
                  >
                    Entrega presencial
                  </button>

                  <button
                    className={`rounded-2xl border px-3 py-2 text-sm shadow-soft ${
                      deliveryMethod === "DELIVERY" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setDeliveryMethod("DELIVERY")}
                    type="button"
                  >
                    A domicilio (misma ciudad)
                  </button>

                  <button
                    className={`rounded-2xl border px-3 py-2 text-sm shadow-soft ${
                      deliveryMethod === "INTERDEPT" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setDeliveryMethod("INTERDEPT")}
                    type="button"
                  >
                    Entregas interdepartamentales
                  </button>
                </div>
              </div>

              {deliveryMethod === "PICKUP" ? (
                <div className="rounded-3xl border border-black/10 bg-parchment p-4">
                  <div className="text-sm font-medium">Horario y lugar</div>
                  <p className="mt-2 text-sm text-black/70">
                    <b>{PICKUP_INFO.schedule}</b>
                    <br />
                    {PICKUP_INFO.location}
                  </p>
                </div>
              ) : null}

              {deliveryMethod === "DELIVERY" ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-black/60">Dirección exacta *</label>
                    <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, zona, referencias..." />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-black/60">Fecha *</label>
                      <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-black/60">Hora *</label>
                      <Input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                    </div>
                  </div>
                </div>
              ) : null}

              {deliveryMethod === "INTERDEPT" ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-black/60">Departamento *</label>
                    <select
                      className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-soft outline-none focus:ring-2 focus:ring-black/15"
                      value={interdeptDepartment}
                      onChange={(e) => setInterdeptDepartment(e.target.value as InterdeptDepartment)}
                    >
                      {INTERDEPT_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-black/60">Dirección exacta *</label>
                    <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección de envío, zona, referencias..." />
                  </div>
                </div>
              ) : null}

              <div className="pt-2">
                <label className="text-xs text-black/60">Pago</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    className={`rounded-2xl border px-3 py-2 text-sm shadow-soft ${
                      paymentMethod === "PAY_QR" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setPaymentMethod("PAY_QR")}
                    type="button"
                  >
                    QR
                  </button>
                  <button
                    className={`rounded-2xl border px-3 py-2 text-sm shadow-soft ${
                      paymentMethod === "PAY_ON_SITE" ? "border-ink bg-ink text-parchment" : "border-black/10 bg-white"
                    }`}
                    onClick={() => setPaymentMethod("PAY_ON_SITE")}
                    type="button"
                  >
                    En el sitio
                  </button>
                </div>

                {paymentMethod === "PAY_QR" ? (
                  <div className="mt-3 rounded-3xl border border-black/10 bg-parchment p-4">
                    <div className="text-sm font-medium">Paga con QR</div>
                    <p className="mt-1 text-xs text-black/60">
                      Después del pedido, envía la captura del comprobante en el mismo chat.
                    </p>
                    <div className="mt-3 relative aspect-square w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
                      <Image src="/pay/qr-pago.png" alt="QR de pago" fill className="object-contain p-4" />
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-black/60">
                    Pagas al momento de la entrega/encuentro.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs text-black/60">Notas</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Color, talla, indicaciones..." />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              ) : null}

              <Button onClick={placeOrder} disabled={loading} className="w-full">
                {loading ? "Creando pedido..." : "Crear pedido"}
              </Button>

              <p className="text-xs text-black/50">
                WhatsApp se abre con el mensaje listo (solo toca “Enviar”).
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
