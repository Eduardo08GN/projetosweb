import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import { Results } from "@/components/landing/results";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { CtaFinal } from "@/components/landing/cta-final";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/landing/scroll-to-top";
import { WhatsAppBubble } from "@/components/landing/whatsapp-bubble";
import { CONTACT_EMAIL, SITE_URL } from "@/components/landing/landing-config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AutomaWeb",
  url: SITE_URL,
  description:
    "Automação digital para negócios locais e criadores de conteúdo",
  logo: `${SITE_URL}/automaweb_logo_preta_horizontal.png`,
  email: CONTACT_EMAIL,
  offers: {
    "@type": "Offer",
    description: "Assinatura mensal de automação digital",
    priceCurrency: "BRL",
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Results />
        <Pricing />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppBubble />
    </>
  );
}
