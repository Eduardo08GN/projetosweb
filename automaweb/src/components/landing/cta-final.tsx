"use client";

import { motion } from "framer-motion";
import { landingViewport } from "@/lib/animations";
import { WHATSAPP_URL } from "./landing-config";

export function CtaFinal() {
  return (
    <section className="relative border-t border-[#E4E4E7] bg-[#F4F4F5] py-24 md:py-32">
      {/* Bleed de entrada: FAFAFA da seção anterior sangra pra cá */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAFAFA]/80 to-transparent"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="font-bold text-[#09090B]"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Pronto pra colocar seu negócio no piloto automático?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={landingViewport}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.08,
          }}
          className="mx-auto mt-4 max-w-[520px] text-lg leading-relaxed text-[#71717A]"
        >
          Agende uma reunião gratuita. A gente identifica o que falta pra você
          crescer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={landingViewport}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: 0.16,
          }}
          className="mt-9"
        >
          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#18181B] px-8 py-4 text-base font-medium text-[#FAFAFA] shadow-[0_8px_24px_-8px_rgba(9,9,11,0.4)] transition-colors duration-150 hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
          >
            Agendar reunião gratuita
          </motion.a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={landingViewport}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-5 text-sm text-[#71717A]"
        >
          Sem compromisso. Sem cartão. 30 minutos.
        </motion.p>
      </div>
    </section>
  );
}
