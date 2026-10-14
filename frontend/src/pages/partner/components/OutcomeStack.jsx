import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SPONSOR_OUTCOMES } from "@shared/config/site";
import { ScrollHighlight } from "@shared/motion";

const ACCENTS = ["#e2efba", "#c4b5fd", "hsl(285 85% 80%)"];

function StackCard({ outcome, index, total, progress }) {
  const reduce = useReducedMotion();
  // Earlier cards shrink and dim as later ones slide over them.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.05]);
  const dim = useTransform(progress, [start, 1], [0, (total - index - 1) * 0.18]);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="sticky flex min-h-[70vh] items-start justify-center md:min-h-[78vh]" style={{ top: `calc(7.5rem + ${index} * 2.25rem)` }}>
      <motion.article
        style={reduce ? undefined : { scale }}
        className="relative w-full origin-top overflow-hidden border border-white/15 bg-[#1b1b1e] p-6 shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-10 md:p-14"
      >
        <motion.span aria-hidden style={reduce ? undefined : { opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
        <span aria-hidden className="absolute left-0 top-0 h-full w-1.5" style={{ background: accent }} />
        <div className="relative grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.18em] text-white/65">
              <span style={{ color: accent }}>{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-10 bg-white/25" aria-hidden />
              What sponsors get
            </div>
            <h3 className="mt-6 font-display text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.85]" style={{ color: accent }}>
              {outcome.title}
            </h3>
            <p className="mt-6 max-w-[34ch] text-xl leading-snug text-white/85 md:text-2xl">{outcome.line}</p>
          </div>
          <div className="md:col-span-5 md:pt-4">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/60">Formats</p>
            <ul className="mt-4 border-t border-white/15">
              {outcome.formats.map((f) => (
                <li key={f} className="flex items-center justify-between gap-4 border-b border-white/15 py-4 text-lg text-white/90">
                  {f}
                  <span aria-hidden className="h-2 w-2 shrink-0" style={{ background: accent }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/**
 * Sticky stacking cards: each sponsor outcome pins and the next slides
 * over it. Pure CSS sticky with a scroll-linked scale, so nothing hijacks
 * the scroll wheel.
 */
export default function OutcomeStack({ id = "what-you-get" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"], layoutEffect: false });

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
              <span className="overline">For sponsors</span>
            </div>
            <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[var(--heading)]">
              What you get
            </h2>
          </div>
          <ScrollHighlight
            className="text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.25] tracking-[-0.01em] text-[var(--text)] md:col-span-8"
            text="Three reasons companies sponsor student hackathons. Pick the one that matters to you and we build the sponsorship around it."
          />
        </div>

        <div ref={ref} className="relative mt-16">
          {SPONSOR_OUTCOMES.map((o, i) => (
            <StackCard key={o.key} outcome={o} index={i} total={SPONSOR_OUTCOMES.length} progress={scrollYProgress} />
          ))}
        </div>
        <p className="mt-6 text-[15px] text-[var(--text-dim)]">Packages and pricing are shared on request.</p>
      </div>
    </section>
  );
}
