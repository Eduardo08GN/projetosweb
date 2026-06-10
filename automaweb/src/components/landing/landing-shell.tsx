"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user" desliga transforms e mantém só opacity quando o
// sistema operacional pede menos movimento.
export function LandingShell({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
