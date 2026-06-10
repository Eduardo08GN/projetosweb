import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/landing-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://automaweb.pro"),
  title: "AutomaWeb | Sites premium, conteúdo com IA e sistemas para o seu negócio",
  description:
    "A AutomaWeb constrói sites premium, automatiza seu conteúdo com IA e entrega sistemas sob medida para o seu negócio crescer no piloto automático.",
  keywords: [
    "automação digital",
    "sites premium",
    "conteúdo automatizado",
    "carrossel instagram",
    "CRM para negócios",
    "landing page profissional",
  ],
  alternates: { canonical: "/home" },
  icons: { icon: "/AutomaWeb_favicon.png" },
  openGraph: {
    title: "AutomaWeb | Automação digital para negócios",
    description:
      "Sites premium, conteúdo automatizado com IA e sistemas sob medida. Assinatura mensal, sem contrato anual.",
    url: "https://automaweb.pro/home",
    siteName: "AutomaWeb",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/automaweb_logo_preta_horizontal.png",
        width: 1067,
        height: 148,
        alt: "AutomaWeb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutomaWeb | Automação digital para negócios",
    description:
      "Sites premium, conteúdo automatizado com IA e sistemas sob medida.",
  },
  robots: { index: true, follow: true },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-landing className="bg-[#FAFAFA] text-[#09090B]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[#18181B] focus:px-4 focus:py-2 focus:text-sm focus:text-[#FAFAFA]"
      >
        Pular para o conteúdo
      </a>
      <LandingShell>{children}</LandingShell>
    </div>
  );
}
