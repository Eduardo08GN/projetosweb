"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { landingViewport } from "@/lib/animations";
import { WHATSAPP_URL } from "./landing-config";

type Plan = {
  name: string;
  price: string;
  audience: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Presença",
    price: "197",
    audience: "Pra quem precisa de presença digital de verdade",
    features: [
      "Site premium (landing page)",
      "SEO básico com dados estruturados",
      "4 carrosséis por mês no Instagram",
      "Suporte por email",
    ],
    cta: "Começar",
  },
  {
    name: "Automação",
    price: "497",
    audience: "Pra quem quer crescer no piloto automático",
    features: [
      "Tudo do plano Presença",
      "Esteira de conteúdo com 12 carrosséis por mês",
      "CRM sob medida com a identidade da marca",
      "Dashboard de métricas",
      "Suporte prioritário",
    ],
    cta: "Escolher Automação",
    highlighted: true,
  },
  {
    name: "Sistema Total",
    price: "997",
    audience: "Pra quem quer a operação inteira num só sistema",
    features: [
      "Tudo do plano Automação",
      "Sistemas sob medida (agendamento, retenção)",
      "Automação de DM no Instagram",
      "Relatórios semanais",
      "Reunião mensal de estratégia",
    ],
    cta: "Falar com especialista",
  },
];

export function Pricing() {
  return (
    <section id="precos" className="border-t border-[#E4E4E7] bg-[#FAFAFA] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#71717A]">
            Investimento
          </p>
          <h2
            className="mt-3 font-bold text-[#09090B]"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Planos que crescem com o seu negócio.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#71717A]">
            Sem contrato anual. Cancele quando quiser.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mt-14 flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:items-stretch"
        >
          {PLANS.map((plan) => (
            <motion.article
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 300, damping: 30 },
                },
              }}
              className={cn(
                "relative flex flex-col rounded-2xl bg-white p-6 md:p-8",
                plan.highlighted
                  ? "order-first border-2 border-[#18181B] shadow-[0_12px_40px_-12px_rgba(9,9,11,0.18)] lg:order-none lg:scale-[1.03]"
                  : "border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#18181B] px-3 py-1 text-xs font-semibold text-[#FAFAFA]">
                  Recomendado
                </span>
              )}

              <h3 className="text-base font-semibold text-[#09090B]">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-[#71717A]">{plan.audience}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-[40px] font-bold tracking-[-0.02em] text-[#09090B]">
                  R$ {plan.price}
                </span>
                <span className="text-base text-[#71717A]">/mês</span>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]"
                      strokeWidth={2}
                    />
                    <span className="text-sm leading-relaxed text-[#09090B]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]",
                  plan.highlighted
                    ? "bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A]"
                    : "bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7]"
                )}
              >
                {plan.cta}
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
