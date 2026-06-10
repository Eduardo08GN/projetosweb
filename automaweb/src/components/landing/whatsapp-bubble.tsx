"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siWhatsapp } from "simple-icons";
import { WHATSAPP_URL } from "./landing-config";

export function WhatsAppBubble() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: [1, 1, 1.08, 1] }
      }
      transition={
        reduced
          ? { duration: 0.3 }
          : {
              opacity: { duration: 0.3, delay: 1.2 },
              scale: {
                duration: 1.2,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 10,
                times: [0, 0.4, 0.7, 1],
              },
            }
      }
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-[76px] right-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_12px_rgba(37,211,102,0.3)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(37,211,102,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-[#FAFAFA]"
        role="img"
        aria-hidden
      >
        <path d={siWhatsapp.path} />
      </svg>
    </motion.a>
  );
}
