"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/money";

function resolveImageSrc(image: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  // fallback (puedes cambiar placeholder.svg si quieres)
  if (!image) return `${base}/products/placeholder.svg`;

  // si viene una URL externa, úsala tal cual
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // si el excel/json trae "1.jpg", lo servimos desde /products/
  return `${base}/products/${image}`;
}

export function ProductCard({
  product,
  currencySymbol,
}: {
  product: Product;
  currencySymbol: string;
}) {
  const { add } = useCart();

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
            <div className="font-display text-base leading-tight">
              {product.name}
            </div>
            {product.category ? (
              <div className="mt-1">
                <Badge>{product.category}</Badge>
              </div>
            ) : null}
          </div>

          <div className="text-sm font-medium">
            {formatMoney(product.price, currencySymbol)}
          </div>
        </div>

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-black/70">
            {product.description}
          </p>
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
