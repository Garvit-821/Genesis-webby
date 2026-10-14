import React from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "./ease";

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  left: { hidden: { opacity: 0, x: -40 }, shown: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, shown: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, shown: { opacity: 1, scale: 1 } },
  /** Wipes in from the bottom edge like a shutter. */
  mask: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    shown: { clipPath: "inset(0% 0% 0% 0%)" },
  },
};

/** One-shot reveal when the element scrolls into view. */
export default function Reveal({
  as = "div",
  variant = "up",
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  className = "",
  children,
  ...rest
}) {
  const Component = motion[as] || motion.div;
  const v = VARIANTS[variant] || VARIANTS.up;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={v}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Component>
  );
}
