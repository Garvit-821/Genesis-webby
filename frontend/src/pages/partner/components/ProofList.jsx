import React from "react";
import { motion } from "framer-motion";
import { PROOF_EVENTS } from "@shared/config/site";
import { EASE_OUT } from "@shared/motion";

/**
 * The four strongest proof points, each with Genesis's role shown
 * (audit C07, C08). Rows flood with lime on hover.
 */
export default function ProofList({ id = "proof", eyebrow = "Proof", title = "Event Partner at", intro }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
              <span className="overline">{eyebrow}</span>
            </div>
            <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)]">
              {title}
            </h2>
          </div>
          {intro ? (
            <p className="max-w-[44ch] text-lg leading-relaxed text-[var(--text-dim)] md:col-span-5">{intro}</p>
          ) : null}
        </div>

        <ul className="mt-14 border-t border-[var(--border-strong)]">
          {PROOF_EVENTS.map((e, i) => (
            <motion.li
              key={e.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_OUT }}
              className="group relative overflow-hidden border-b border-[var(--border-strong)]"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-[#e2efba] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <div className="relative grid gap-3 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-9">
                <span className="font-mono text-[12px] text-[var(--text-faint)] transition-colors duration-500 group-hover:text-[#181818] md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.92] text-[var(--heading)] transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-[#181818] md:col-span-5">
                  {e.name}
                </h3>
                <p className="text-base text-[var(--text-dim)] transition-colors duration-500 group-hover:text-[#181818] md:col-span-3">
                  {e.venue}
                  <span className="block text-[15px] text-[var(--text-faint)] transition-colors duration-500 group-hover:text-[#181818]/80">{e.fact}</span>
                </p>
                <span className="w-fit border border-[var(--border-strong)] px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--text)] transition-colors duration-500 group-hover:border-[#181818] group-hover:text-[#181818] md:col-span-3 md:justify-self-end">
                  {e.role}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
