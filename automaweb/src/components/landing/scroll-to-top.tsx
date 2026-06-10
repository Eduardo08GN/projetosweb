"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 400));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#18181B] text-[#FAFAFA] shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-150 hover:scale-105 hover:bg-[#27272A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18181B]"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
