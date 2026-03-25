export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-parchment">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/70">
        <div className="font-display text-base text-ink">Renata Jewelry</div>
        <p className="mt-2 max-w-xl">
          Joyería vintage con detalles atemporales. Hecho para brillar sin prisa.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <a
            className="hover:underline"
            href="https://instagram.com/ren_renata.co"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            className="hover:underline"
            href="https://www.facebook.com/profile.php?id=61579069297224"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            className="hover:underline"
            href="https://wa.me/59176498138"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp: +591 76498138
          </a>
        </div>

        <p className="mt-6 text-xs text-black/50">© {new Date().getFullYear()} Renata Jewelry</p>
      </div>
    </footer>
  );
}
