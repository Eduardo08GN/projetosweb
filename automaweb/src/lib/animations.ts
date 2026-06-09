export const transitions = {
  micro: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  smooth: { type: "spring" as const, stiffness: 400, damping: 30 },
  page: { type: "spring" as const, stiffness: 300, damping: 35 },
  modal: {
    enter: { type: "spring" as const, stiffness: 500, damping: 30 },
    exit: { duration: 0.15, ease: "easeOut" },
  },
};

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  },
  fadeUpSmall: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleOut: {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.97 },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.03 },
    },
  },
};
