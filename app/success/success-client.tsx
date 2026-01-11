"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function SuccessClient() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") ?? "RJ-XXXX-XXXX";
  const pay = sp.get("pay") ?? "PAY_QR";
  const isQR = pay === "PAY_QR";

  const waLink = sp.get("wa");
    if (v) setWaLink(v);
  }, [orderId]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
        <p className="text-xs tracking-[0.22em] text-black/60 uppercase">Pedido creado</p>
        <h2 className="mt-2 font-display text-3xl">¡Gracias! ✨</h2>

        <p className="mt-2 text-sm text-black/70">
          Tu código de pedido es{" "}
          <span className="ml-2 rounded bg-black/5 px-2 py-1 font-mono text-xs">{orderId}</span>
        </p>

        <div className="mt-6 rounded-3xl border border-black/10 bg-parchment p-6">
          <div className="text-sm font-medium">Paso 1: Enviar el pedido por WhatsApp</div>
          <p className="mt-2 text-sm text-black/70">
            Presiona el botón para abrir WhatsApp con el <b>mensaje completo</b> (productos, entrega y pago).
          </p>

          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer" className="mt-4 block">
              <Button className="w-full">Enviar pedido por WhatsApp</Button>
            </a>
          ) : (
            <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4 text-sm text-black/70">
              No pude recuperar el link del pedido. Vuelve al checkout y crea el pedido de nuevo.
            </div>
          )}

          <div className="mt-6 border-t border-black/10 pt-5">
            <div className="text-sm font-medium">Paso 2: Enviar comprobante</div>
            <p className="mt-2 text-sm text-black/70">
              {isQR
                ? "Paga con QR y envía la captura del comprobante en el mismo chat."
                : "Pago en el sitio: coordinamos por el mismo chat."}
            </p>

            {isQR ? (
              <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
                <div className="text-sm font-medium">QR de pago</div>
                <div className="mt-3 relative aspect-square w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
                  <Image src="/pay/qr-pago.png" alt="QR de pago" fill className="object-contain p-4" />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/catalog">
            <Button variant="secondary" className="w-full">Seguir comprando</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
