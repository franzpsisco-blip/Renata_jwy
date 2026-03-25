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
            <Button
              variant="secondary"
              className="gap-3 rounded-full border-black/10 px-5 py-3 text-base font-semibold shadow-md hover:bg-black hover:text-white"
            >
              <span>Carrito</span>
              <span className="rounded-full bg-black px-3 py-1 text-sm font-bold text-white min-w-9 text-center">
                {count}
              </span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
