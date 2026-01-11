import { Suspense } from "react";
import SuccessClient from "./success-client";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
            <p className="text-xs tracking-[0.22em] text-black/60 uppercase">Cargando…</p>
            <h2 className="mt-2 font-display text-3xl">Preparando tu pedido</h2>
            <p className="mt-2 text-sm text-black/70">Un momento…</p>
          </div>
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
