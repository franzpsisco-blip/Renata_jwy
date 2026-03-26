"use client";

import { useMemo } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/money";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import {
  getDiscountCaption,
  getDiscountedPrice,
  isGlobalDiscountEnabled,
} from "@/lib/discount";

function getItemPrice(item: any): number {
  return Number(item?.price ?? item?.product?.price ?? item?.unitPrice ?? 0);
}

function getItemName(item: any): string {
  return String(item?.name ?? item?.product?.name ?? "Producto");
}

function getItemCategory(item: any): string {
  return String(item?.category ?? item?.product?.category ?? "");
}

function getItemImage(item: any, basePath: string): string {
  const raw = item?.image ?? item?.product?.image ?? "";

  if (!raw) return `${basePath}/products/placeholder.svg`;
  if (typeof raw !== "string") return `${basePath}/products/placeholder.svg`;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${basePath}${raw}`;
  return `${basePath}/products/${raw}`;
}

function getItemId(item: any): number | string {
  return item?.id ?? item?.product?.id ?? "";
}

function getItemQty(item: any): number {
  return Number(item?.quantity ?? 1);
}

export default function CheckoutPage() {
  const { items, remove, add, clear } = useCart();

  const currencySymbol = "Bs";
  const basePath = process.env.NODE_ENV === "production" ? "/Renata_jwy" : "";

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + getItemPrice(item) * getItemQty(item);
    }, 0);
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + getDiscountedPrice(getItemPrice(item)) * getItemQty(item);
    }, 0);
  }, [items]);

  const discountActive = isGlobalDiscountEnabled();

  const handleSendToWhatsApp = () => {
    if (!items.length) return;

    const whatsappUrl = buildWhatsAppLink({
      items,
      currencySymbol,
      total,
    } as any);

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
              {items.map((item: any, index: number) => {
                const price = getItemPrice(item);
                const quantity = getItemQty(item);
                const name = getItemName(item);
                const category = getItemCategory(item);
                const imageSrc = getItemImage(item, basePath);
                const discountedUnit = getDiscountedPrice(price);
                const hasDiscount = discountActive && discountedUnit < price;
                const itemId = getItemId(item);

                return (
                  <div
                    key={`${itemId}-${index}`}
                    className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/5">
                      <img
                        src={imageSrc}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-ink">{name}</div>

                      {category ? (
                        <div className="mt-1 text-xs text-black/50">{category}</div>
                      ) : null}

                      {hasDiscount ? (
                        <div className="mt-2">
                          <div className="text-xs text-black/45 line-through">
                            {formatMoney(price, currencySymbol)}
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
                          {formatMoney(price, currencySymbol)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="min-w-8 text-center text-sm font-medium">
                        {quantity}
                      </span>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => add(item as any, 1)}
                      >
                        +
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => remove(itemId)}
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
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-black/65">Total</span>
                  <span className="font-semibold">
                    {formatMoney(total, currencySymbol)}
                  </span>
                </div>
              )}
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
