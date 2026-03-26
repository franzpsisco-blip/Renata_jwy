"use client";

import { useMemo } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  getDiscountCaption,
  getDiscountedPrice,
  isGlobalDiscountEnabled,
} from "@/lib/discount";

export default function CheckoutPage() {
  const {
    items,
    remove,
    increment,
    decrement,
    clear,
  } = useCart();

  const currencySymbol = "Bs";

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const total = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + getDiscountedPrice(item.price) * item.quantity,
      0
    );
  }, [items]);

  const discountActive = isGlobalDiscountEnabled();

  const handleSendToWhatsApp = () => {
    if (!items.length) return;

    const whatsappUrl = buildWhatsAppUrl({
      items,
      currencySymbol,
      total,
    });

    clear();
    window.location.href = whatsappUrl;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl">Finalizar pedido</h1>
        <p className="mt-2 text-sm text-black/65">
          Revisa tu carrito y envía tu pedido directo por WhatsApp.
        </p>
      </div>

      {!items.length ? (
        <div className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-soft">
          <p className="text-base text-black/70">Tu carrito está vacío.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft">
            <div className="space-y-4">
              {items.map((item) => {
                const discountedUnit = getDiscountedPrice(item.price);
                const hasDiscount = discountActive && discountedUnit < item.price;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-ink">{item.name}</div>

                      {item.category ? (
                        <div className="mt-1 text-xs text-black/50">{item.category}</div>
                      ) : null}

                      {hasDiscount ? (
                        <div className="mt-2">
                          <div className="text-xs text-black/45 line-through">
                            {formatMoney(item.price, currencySymbol)}
                          </div>
                          <div className="text-sm font-semibold">
                            {formatMoney(discountedUnit, currencySymbol)}
                          </div>
                          <div className="text-[11px] text-black/60">
                            {getDiscountCaption()}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-sm font-semibold">
                          {formatMoney(item.price, currencySymbol)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => decrement(item.id)}
                      >
                        -
                      </Button>

                      <span className="min-w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => increment(item.id)}
                      >
                        +
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => remove(item.id)}
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={clear}>
                Vaciar carrito
              </Button>
            </div>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-5 shadow-soft">
            <h2 className="font-display text-2xl">Resumen</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-black/65">Subtotal</span>
                <span>{formatMoney(subtotal, currencySymbol)}</span>
              </div>

              {discountActive ? (
                <div className="flex items-center justify-between">
                  <span className="text-black/65">Total con descuento</span>
                  <span className="font-semibold">
                    {formatMoney(total, currencySymbol)}
                  </span>
                </div>
              ) : null}

              {!discountActive ? (
                <div className="flex items-center justify-between">
                  <span className="text-black/65">Total</span>
                  <span className="font-semibold">
                    {formatMoney(total, currencySymbol)}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <Button type="button" className="w-full" onClick={handleSendToWhatsApp}>
                Enviar pedido por WhatsApp
              </Button>
            </div>

            <p className="mt-3 text-xs text-black/50">
              Al hacer clic, se abrirá WhatsApp directamente con tu pedido.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
