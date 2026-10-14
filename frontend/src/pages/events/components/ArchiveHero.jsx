import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "@shared/ui/CountUp";
import { DELHI, STATS } from "@shared/config/site";
import { EVENT_CITIES, EVENT_YEARS, PAST_EVENTS } from "@shared/data/events";
import { EASE_OUT, Magnetic, Reveal } from "@shared/motion";

/**
 * Archive numbers, all computed from the data (audit C03), and the event
 * we are selling now.
 */
export function ArchiveHero() {
  const organised = PAST_EVENTS.filter((e) => e.role === "Organiser").length;
  const partnered = PAST_EVENTS.length - organised;
  const years = [...EVENT_YEARS].sort();
  const stats = [
    { value: PAST_EVENTS.length, label: "Events listed here" },
    { value: EVENT_CITIES.length, label: "Cities" },
    { value: organised, label: "Run by Genesis" },
    { value: partnered, label: "As Event Partner" },
  ];

  return (
    <div className="mx-auto max-w-[90rem] px-5 md:px-12">
      <dl className="grid grid-cols-2 border-l border-t border-white/10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="border-b border-r border-white/10 p-5 md:p-7">
            <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/65">{s.label}</dt>
            <dd className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-none text-white">
              <CountUp value={s.value} duration={1.6} />
            </dd>
          </Reveal>
        ))}
      </dl>
      <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-white/70">
        {PAST_EVENTS.length} of our {STATS.eventsLabel} events are listed so far, from {years[0]} to {years[years.length - 1]}.
        Organiser means Genesis ran the event. Event Partner means another community organised it and Genesis partnered on it.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="pixel-corners relative mt-14 overflow-hidden bg-[var(--heading)] text-[#181818]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #181818 1px, transparent 1px), linear-gradient(to bottom, #181818 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping bg-[#181818] opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-[#181818]" />
              </span>
              Next up
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,4.6vw,3.8rem)] leading-[0.92]">
              {DELHI.name} {DELHI.edition}
            </p>
            <p className="mt-3 text-base md:text-lg">
              {DELHI.where} · {DELHI.when} · {DELHI.teams} teams · {DELHI.tracks.length} tracks
            </p>
          </div>
          <Magnetic strength={0.2}>
            <Link
              to={DELHI.path}
              className="inline-flex min-h-[52px] items-center gap-3 bg-[#181818] px-6 font-mono text-[13px] uppercase tracking-[0.12em] text-[var(--heading)] transition-transform hover:-translate-y-0.5"
            >
              See the event <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </div>
  );
}

export default ArchiveHero;
