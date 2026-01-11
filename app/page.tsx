import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-vintage-radial" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 md:items-center">
          <div className="relative z-10">
            <p className="text-xs tracking-[0.22em] text-black/60 uppercase">Bolivia · Joyería Vintage Aesthetic</p>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
              Piezas vintage con <span className="italic text-rose">alma</span>, listas para enamorar.
            </h1>
            <p className="mt-4 max-w-xl text-base text-black/70">
              Anillos, collares, manillas y accesorios elegidos para un brillo clásico y elegante.
              Compra fácil, confirma por WhatsApp y recibe tu pedido con cariño.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog">
                <Button>Ver catálogo</Button>
              </Link>
              <Link href="/checkout">
                <Button variant="secondary">Finalizar pedido</Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-black/70 md:grid-cols-3">
              <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-soft">
                <div className="font-medium text-ink">Entrega en Bolivia</div>
                <div className="mt-1">A domicilio, presencial e interdepartamental</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-soft">
                <div className="font-medium text-ink">Compra segura</div>
                <div className="mt-1">Pago QR o en el sitio</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-soft">
                <div className="font-medium text-ink">Atención rápida</div>
                <div className="mt-1">Confirmación por WhatsApp</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero.jpg`}
                alt="Renata Jewelry — estética vintage"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-black/50">
              Renata Jewelry — joyería vintage aesthetic en Bolivia.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="font-display text-xl">Aesthetic vintage</div>
            <p className="mt-2 text-sm text-black/70">
              Detalles finos, tonos suaves y un brillo que se siente eterno.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="font-display text-xl">Ediciones limitadas</div>
            <p className="mt-2 text-sm text-black/70">
              Piezas seleccionadas: cuando te enamoras, es el momento.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="font-display text-xl">Regala intención</div>
            <p className="mt-2 text-sm text-black/70">
              Ideal para sorprender (o darte el gusto que mereces).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
