import Image from "next/image";
import { CONTACT_EMAIL, WHATSAPP_URL } from "./landing-config";

const SOLUTION_LINKS = [
  { label: "Sites", href: "#solucoes" },
  { label: "Conteúdo Toda Semana", href: "#solucoes" },
  { label: "Painel do Negócio", href: "#solucoes" },
  { label: "Preços", href: "#precos" },
];

const PLATFORM_LINKS = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Resultados", href: "#resultados" },
  { label: "Perguntas frequentes", href: "#faq" },
  { label: "Entrar na plataforma", href: "/login" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E4E4E7] bg-[#F4F4F5] pb-8 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Image
              src="/automaweb_logo_preta_horizontal.png"
              alt="AutomaWeb"
              width={1067}
              height={148}
              className="h-6 w-auto"
            />
            <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-[#71717A]">
              Automação digital para negócios locais e criadores de conteúdo.
            </p>
          </div>

          <nav aria-label="Soluções">
            <h3 className="text-sm font-semibold text-[#09090B]">Soluções</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SOLUTION_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Plataforma">
            <h3 className="text-sm font-semibold text-[#09090B]">Plataforma</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Contato">
            <h3 className="text-sm font-semibold text-[#09090B]">Contato</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#71717A] transition-colors duration-150 hover:text-[#09090B]"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <span className="text-sm text-[#71717A]">Brasil</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-[#E4E4E7] pt-6">
          <p className="text-[13px] text-[#A1A1AA]">
            © 2026 AutomaWeb. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}