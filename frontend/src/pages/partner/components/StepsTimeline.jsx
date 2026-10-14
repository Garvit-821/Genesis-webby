import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PARTNER_STEPS } from "@shared/config/site";
import { EASE_OUT } from "@shared/motion";

/**
 * How a partnership runs. The rail draws itself as the section scrolls
 * through the viewport: across on desktop, down on mobile.
 */
export default function StepsTimeline({ id = "how-it-works", title = "How it works" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"], layoutEffect: false });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="flex items-center gap-3">
          <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
          <span className="overline">From first call to event day</span>
        </div>
        <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)]">
          {title}
        </h2>

        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* Desktop rail */}
          <div aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-white/15 md:block" />
          <motion.div aria-hidden style={{ scaleX: draw }} className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-[var(--heading)] md:block" />
          {/* Mobile rail */}
          <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-white/15 md:hidden" />
          <motion.div aria-hidden style={{ scaleY: draw }} className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-[var(--heading)] md:hidden" />

          <ol className="relative grid gap-12 md:grid-cols-4 md:gap-8">
            {PARTNER_STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_OUT }}
                className="relative pl-12 md:pl-0 md:pt-12"
              >
                <span aria-hidden className="absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center border border-[var(--heading)] bg-[var(--bg)]">
                  <span className="h-2 w-2 bg-[var(--heading)]" />
                </span>
                <span className="font-mono text-[12px] tracking-[0.18em] text-[var(--text-faint)]">Step {step.n}</span>
                <h3 className="mt-3 font-display text-[1.75rem] leading-[0.95] text-[var(--heading)] md:text-[2rem]">{step.title}</h3>
                <p className="mt-4 max-w-[30ch] text-base leading-relaxed text-[var(--text-dim)]">{step.line}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
