"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { OrderDraftSchema, createOrderId, PICKUP_INFO } from "@/lib/order";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getDiscountedPrice } from "@/lib/discount";

type DeliveryMethod = "PICKUP" | "DELIVERY" | "INTERDEPT";
type PaymentMethod = "PAY_ON_SITE" | "PAY_QR";
type Department =
  | "Beni"
  | "Chuquisaca"
  | "Cochabamba"
  | "La Paz"
  | "Oruro"
  | "Pando"
  | "Potosí"
  | "Santa Cruz"
  | "Tarija";

function formatBs(value: number) {
  return `Bs ${value.toFixed(2).replace(".", ",")}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear, remove, setQty } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAY_ON_SITE");
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [interdeptDepartment, setInterdeptDepartment] = useState<Department | "">("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => {
      return acc + getDiscountedPrice(Number(it.product.price || 0)) * Number(it.qty || 0);
    }, 0);
  }, [items]);

  function handleDecrease(productId: string, currentQty: number) {
    setQty(productId, currentQty - 1);
  }

  function handleIncrease(productId: string, currentQty: number) {
    setQty(productId, currentQty + 1);
  }

  function handleClearCart() {
    clear();
    setError(null);
  }

  async function placeOrder() {
    setError(null);

    const payload = {
      items: items.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        unitPrice: getDiscountedPrice(Number(it.product.price || 0)),
        qty: Number(it.qty || 1),
      })),
      subtotal,
      deliveryMethod: deliveryMethod || undefined,
      address: address.trim() || undefined,
      deliveryDate: deliveryDate.trim() || undefined,
      deliveryTime: deliveryTime.trim() || undefined,
      interdeptDepartment: interdeptDepartment || undefined,
      paymentMethod: paymentMethod || undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: notes.trim() || undefined,
    };

    const parsed = OrderDraftSchema.safeParse(payload);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message;
      setError(firstIssue || "Solo nombre y teléfono son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const orderId = createOrderId();
      const waCustomer = buildWhatsAppLink(orderId, parsed.data);

      clear();

      router.push(
        `/success?orderId=${encodeURIComponent(orderId)}&pay=${encodeURIComponent(
          parsed.data.paymentMethod || ""
        )}&wa=${encodeURIComponent(waCustomer)}`
      );
    } catch (e: any) {
      setError(e?.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Finalizar pedido</h1>

        {items.length > 0 ? (
          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
          >
            Vaciar carrito
          </button>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-neutral-300 bg-[#f4efe7] p-6">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Nombre *</label>
              <input
                className="w-full rounded-[22px] border border-neutral-300 bg-white px-5 py-4 text-lg outline-none"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Teléfono *</label>
              <input
                className="w-full rounded-[22px] border border-neutral-300 bg-white px-5 py-4 text-lg outline-none"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Tu teléfono"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Tipo de entrega</p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("PICKUP")}
                  className={`w-full rounded-full px-5 py-4 text-lg transition ${
                    deliveryMethod === "PICKUP"
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-black"
                  }`}
                >
                  Entrega presencial
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("DELIVERY")}
                  className={`w-full rounded-full px-5 py-4 text-lg transition ${
                    deliveryMethod === "DELIVERY"
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-black"
                  }`}
                >
                  A domicilio (misma ciudad)
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("INTERDEPT")}
                  className={`w-full rounded-full px-5 py-4 text-lg transition ${
                    deliveryMethod === "INTERDEPT"
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-black"
                  }`}
                >
                  Entregas interdepartamentales
                </button>
              </div>
            </div>

            {deliveryMethod === "PICKUP" && (
              <div className="rounded-[28px] border border-[#ddd3c6] bg-[#efe9df] p-6">
                <h3 className="mb-3 text-2xl font-semibold">Horario y lugar</h3>
                <p className="text-xl font-semibold">{PICKUP_INFO.schedule}</p>
                <p className="mt-1 text-xl text-neutral-700">{PICKUP_INFO.location}</p>
              </div>
            )}

            {deliveryMethod === "DELIVERY" && (
              <div className="space-y-4 rounded-[28px] border border-neutral-300 bg-[#efe9df] p-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">Dirección</label>
                  <input
                    className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-3 outline-none"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Fecha</label>
                    <input
                      type="date"
                      className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-3 outline-none"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Hora</label>
                    <input
                      type="time"
                      className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-3 outline-none"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {deliveryMethod === "INTERDEPT" && (
              <div className="space-y-4 rounded-[28px] border border-neutral-300 bg-[#efe9df] p-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">Departamento</label>
                  <select
                    className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-3 outline-none"
                    value={interdeptDepartment}
                    onChange={(e) => setInterdeptDepartment(e.target.value as Department | "")}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Beni">Beni</option>
                    <option value="Chuquisaca">Chuquisaca</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="La Paz">La Paz</option>
                    <option value="Oruro">Oruro</option>
                    <option value="Pando">Pando</option>
                    <option value="Potosí">Potosí</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Tarija">Tarija</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Dirección</label>
                  <input
                    className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-3 outline-none"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-sm font-medium">Pago</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAY_QR")}
                  className={`rounded-full px-5 py-4 text-lg transition ${
                    paymentMethod === "PAY_QR"
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-black"
                  }`}
                >
                  QR
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAY_ON_SITE")}
                  className={`rounded-full px-5 py-4 text-lg transition ${
                    paymentMethod === "PAY_ON_SITE"
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-black"
                  }`}
                >
                  En el sitio
                </button>
              </div>

              {paymentMethod === "PAY_ON_SITE" && (
                <p className="mt-3 text-base text-neutral-600">
                  Pagas al momento de la entrega/encuentro.
                </p>
              )}

              {paymentMethod === "PAY_QR" && (
                <p className="mt-3 text-base text-neutral-600">
                  Te enviaremos el QR al confirmar el pedido.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Notas</label>
              <textarea
                className="min-h-[160px] w-full rounded-[22px] border border-neutral-300 bg-white px-5 py-4 outline-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opcional"
              />
            </div>

            {error && (
              <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={placeOrder}
              disabled={loading}
              className="w-full rounded-full bg-black px-6 py-5 text-2xl font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Creando pedido..." : "Crear pedido"}
            </button>
          </div>
        </section>

        <aside className="rounded-[28px] border border-neutral-300 bg-[#f4efe7] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Resumen</h2>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-sm font-medium text-black/70 underline-offset-4 hover:underline"
              >
                Vaciar
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="space-y-3">
                <p className="text-neutral-600">No hay productos en el carrito.</p>
                <Link
                  href="/catalog"
                  className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                >
                  Volver al catálogo
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const unit = getDiscountedPrice(item.product.price);
                const total = unit * item.qty;

                return (
                  <div
                    key={item.product.id}
                    className="rounded-2xl border border-neutral-300 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="mt-1 text-sm text-neutral-600">{formatBs(unit)} c/u</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(item.product.id)}
                        className="text-sm font-medium text-black/60 transition hover:text-black"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-neutral-300 bg-[#f8f3ec]">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.product.id, item.qty)}
                          className="px-4 py-2 text-lg leading-none"
                          aria-label={`Disminuir cantidad de ${item.product.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-10 text-center text-base font-medium">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item.product.id, item.qty)}
                          className="px-4 py-2 text-lg leading-none"
                          aria-label={`Aumentar cantidad de ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold">{formatBs(total)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 border-t border-neutral-300 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-semibold">{formatBs(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
