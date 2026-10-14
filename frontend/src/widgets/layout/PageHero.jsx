import React from "react";
import { motion } from "framer-motion";
import { SplitText, ScrambleText, EASE_OUT } from "@shared/motion";

/**
 * Standard top of an inner page: scrambled eyebrow, split-reveal H1,
 * a drawn rule and an optional intro. One H1 per page lives here.
 */
export default function PageHero({
  eyebrow,
  title,
  lines,
  intro,
  children,
  align = "left",
  className = "",
}) {
  return (
    <header
      className={`relative overflow-hidden px-5 pb-14 pt-40 md:px-12 md:pb-20 md:pt-52 ${className}`}
    >
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className={`relative mx-auto max-w-[90rem] ${align === "center" ? "text-center" : ""}`}>
        {eyebrow ? (
          <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
            <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
            <ScrambleText text={eyebrow} className="overline" />
          </div>
        ) : null}
        <SplitText
          as="h1"
          text={title}
          lines={lines}
          trigger="mount"
          delay={0.15}
          className="mt-6 font-display text-[clamp(2.75rem,8.5vw,8rem)] leading-[0.9] text-[var(--heading)]"
        />
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: EASE_OUT }}
          className="mt-10 block h-px origin-left bg-[var(--border-strong)] md:mt-14"
        />
        {intro ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE_OUT }}
            className={`mt-8 max-w-[60ch] text-lg leading-relaxed text-[var(--text-dim)] md:text-xl ${align === "center" ? "mx-auto" : ""}`}
          >
            {intro}
          </motion.p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
