"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/money";
import {
  getDiscountCaption,
  getDiscountedPrice,
  getDiscountPercentLabel,
  isGlobalDiscountEnabled,
} from "@/lib/discount";

function resolveImageSrc(image: string) {
  const basePath = process.env.NODE_ENV === "production" ? "/Renata_jwy" : "";

  if (!image) return `${basePath}/products/placeholder.svg`;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${basePath}${image}`;

  return `${basePath}/products/${image}`;
}

export function ProductCard({
  product,
  currencySymbol,
}: {
  product: Product;
  currencySymbol: string;
}) {
  const { add } = useCart();
  const discountedPrice = getDiscountedPrice(product.price);
  const showDiscount = isGlobalDiscountEnabled() && discountedPrice < product.price;

  return (
    <div className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-soft">
      <div className="relative aspect-[4/5] w-full bg-black/5">
        <img
          src={resolveImageSrc(product.image)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-display text-base leading-tight">{product.name}</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {product.category ? <Badge>{product.category}</Badge> : null}
              {showDiscount ? (
                <Badge className="border-ink bg-ink text-parchment">
                  {getDiscountPercentLabel()}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="min-w-[120px] text-right">
            {showDiscount ? (
              <div className="flex flex-col items-end">
                <div className="text-xs text-black/45 line-through">
                  {formatMoney(product.price, currencySymbol)}
                </div>
                <div className="mt-1 text-base font-bold leading-none">
                  {formatMoney(discountedPrice, currencySymbol)}
                </div>
                <div className="mt-1 text-[11px] font-semibold leading-tight text-black/65">
                  {getDiscountCaption()}
                </div>
              </div>
            ) : (
              <div className="text-sm font-medium">
                {formatMoney(product.price, currencySymbol)}
              </div>
            )}
          </div>
        </div>

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-black/70">{product.description}</p>
        ) : (
          <p className="mt-2 text-sm text-black/60">
            Pieza vintage seleccionada con cuidado.
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <Button onClick={() => add(product, 1)} className="w-full">
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
