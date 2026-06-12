import Image from "next/image";
import Link from "next/link";

/* ── Casca das paginas legais ──
   Privacidade e termos: header com logo, miolo em prosa e rodape curto.
   Paginas publicas exigidas pela revisao da Meta e pela LGPD. */

export function LegalShell({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-[#E4E4E7] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/home">
            <Image
              src="/automaweb_logo_preta_horizontal.png"
              alt="AutomaWeb"
              width={1067}
              height={148}
              className="h-6 w-auto"
            />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#09090B]">
          {titulo}
        </h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Ultima atualizacao: {atualizadoEm}
        </p>
        <div className="mt-10 space-y-10">{children}</div>
      </main>

      <footer className="border-t border-[#E4E4E7] bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6">
          <p className="text-xs text-[#A1A1AA]">
            &copy; {new Date().getFullYear()} AutomaWeb &middot; Todos os
            direitos reservados.
          </p>
          <nav className="flex gap-5">
            <Link
              href="/privacidade"
              className="text-xs text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
            >
              Privacidade
            </Link>
            <Link
              href="/termos"
              className="text-xs text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
            >
              Termos
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  id,
  titulo,
  children,
}: {
  id?: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-[#09090B]">{titulo}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#52525B]">
        {children}
      </div>
    </section>
  );
}
