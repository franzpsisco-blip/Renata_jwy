"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function SuccessClient() {
  const sp = useSearchParams();

  const orderId = sp.get("orderId") ?? "";
  const pay = sp.get("pay") ?? "";
  const waLink = sp.get("wa"); // viene ya listo desde /checkout

  const showQr = pay === "QR";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
        <h1 className="font-display text-3xl">¡Gracias por tu pedido! ✨</h1>

        <p className="mt-3 text-sm text-black/70">
          Tu pedido <span className="font-medium text-black">{orderId || "RJ-..."}</span> fue generado.
          Ahora confirma por WhatsApp para que lo atendamos más rápido.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Enviar pedido por WhatsApp</Button>
            </a>
          ) : (
            <Button disabled className="w-full sm:w-auto">
              Generando link…
            </Button>
          )}

          <Link href="/catalog" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Seguir viendo catálogo
            </Button>
          </Link>
        </div>

        {showQr ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-parchment p-6">
            <h2 className="font-display text-xl">Pago por QR</h2>
            <p className="mt-2 text-sm text-black/70">
              Escanea el QR y luego envía el comprobante por WhatsApp en el mismo chat del pedido.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white p-4">
              {/* Coloca tu imagen QR en: public/pay/qr-pago.png */}
              <img
                src="/pay/qr-pago.png"
                alt="QR de pago Renata Jewelry"
                className="mx-auto h-auto w-full max-w-xs"
              />
            </div>

            <p className="mt-3 text-xs text-black/60">
              ✅ Enviar comprobante en este chat
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
