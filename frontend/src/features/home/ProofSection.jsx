import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PROOF_EVENTS, SERIES } from "@shared/config/site";
import { PAST_EVENTS } from "@shared/data/events";
import { EASE_OUT, SplitText } from "@shared/motion";
import SectionLabel from "./SectionLabel";

function ProofRow({ event, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: EASE_OUT }}
      className="proof-row group relative border-b border-white/15"
    >
      <span aria-hidden className="proof-row__fill" />
      <div className="relative grid gap-3 px-1 py-7 md:grid-cols-12 md:items-center md:gap-6 md:py-10">
        <span className="font-mono text-[13px] tracking-[0.2em] text-[var(--text-faint)] transition-colors duration-300 md:col-span-1 group-hover:text-[#181818]/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)] transition-colors duration-300 md:col-span-6 group-hover:text-[#181818]">
          {event.name}
        </h3>
        <div className="md:col-span-3">
          <p className="text-base text-white/85 transition-colors duration-300 group-hover:text-[#181818]">{event.venue}</p>
          <p className="mt-1 text-sm text-[var(--text-dim)] transition-colors duration-300 group-hover:text-[#181818]/75">{event.fact}</p>
        </div>
        <span className="w-fit border border-white/30 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-white/85 transition-colors duration-300 md:col-span-2 md:justify-self-end group-hover:border-[#181818]/40 group-hover:text-[#181818]">
          {event.role}
        </span>
      </div>
    </motion.li>
  );
}

export default function ProofSection() {
  return (
    <section id="proof" aria-labelledby="proof-title" className="relative z-[3] border-t border-white/10 bg-[#181818] py-24 md:py-36">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel id="proof" />
            <SplitText
              as="h2"
              id="proof-title"
              lines={["Event Partner at"]}
              className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] text-[var(--heading)]"
            />
          </div>
          <p className="max-w-[40ch] text-lg leading-relaxed text-[var(--text-dim)]">
            Independent hackathons where Genesis brought the brands in. Our own series is {SERIES.name}.
          </p>
        </div>

        <ol className="mt-14 border-t border-white/15 md:mt-20">
          {PROOF_EVENTS.map((e, i) => (
            <ProofRow key={e.name} event={e} index={i} />
          ))}
        </ol>

        <div className="mt-10 flex justify-end">
          <Link to="/events" className="link-draw inline-flex min-h-[44px] items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em] text-white/85 hover:text-white">
            All {PAST_EVENTS.length} archived events <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
