"use client";

import Link from "next/link";
import { useCart } from "./cart/CartProvider";
import { Button } from "./ui/Button";

export function Nav() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-parchment/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg tracking-wide">
          Renata Jewelry
        </Link>

        <nav className="flex flex-wrap items-center gap-3">
          <Link href="/catalog" className="text-sm hover:underline">
            Catálogo
          </Link>

          <a
            href="https://instagram.com/ren_renata.co"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:underline"
          >
            Instagram
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61579069297224"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:underline"
          >
            Facebook
          </a>

          <a
            href="https://wa.me/59176498138"
            target="_blank"
            rel="noreferrer"
            className="text-sm hover:underline"
            aria-label="WhatsApp Renata Jewelry"
          >
            WhatsApp: +591 76498138
          </a>

          <Link href="/checkout">
            <Button variant="secondary" className="gap-2 border-black/10">
              Carrito{" "}
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
                {count}
              </span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
