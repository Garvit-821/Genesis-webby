import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "@shared/ui/CountUp";
import { BRAND, DELHI, PARTNER_STEPS, SPONSOR_OUTCOMES, STATS } from "@shared/config/site";
import { EVENT_CITIES } from "@shared/data/events";
import { EASE_OUT, Magnetic, Reveal, ScrollHighlight, SplitText, useMediaQuery } from "@shared/motion";
import SectionLabel from "./SectionLabel";

const CARD_TONES = [
  { bg: "#181818", ink: "var(--heading)", sub: "rgba(226,239,186,0.78)", border: "rgba(255,255,255,0.9)", chip: "rgba(226,239,186,0.4)" },
  { bg: "#e2efba", ink: "#181818", sub: "rgba(24,24,24,0.78)", border: "#e2efba", chip: "rgba(24,24,24,0.35)" },
  { bg: "#c4b5fd", ink: "#181818", sub: "rgba(24,24,24,0.78)", border: "#c4b5fd", chip: "rgba(24,24,24,0.35)" },
];

/** Decorative pixel glyph that redraws itself on hover. */
function PixelGlyph({ seed, color }) {
  const cells = Array.from({ length: 36 }, (_, i) => ((i * 7 + seed * 13) % 5) < 2);
  return (
    <span aria-hidden className="grid h-20 w-20 grid-cols-6 gap-[3px] md:h-28 md:w-28">
      {cells.map((on, i) => (
        <span
          key={i}
          className="pixel-glyph-cell"
          style={{
            background: on ? color : "transparent",
            border: on ? "none" : `1px solid ${color}`,
            opacity: on ? 1 : 0.2,
            transitionDelay: `${(i % 6) * 30 + Math.floor(i / 6) * 20}ms`,
          }}
        />
      ))}
    </span>
  );
}

function OutcomeCard({ item, index, total, progress, stacked }) {
  const tone = CARD_TONES[index % CARD_TONES.length];
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  const card = (
    <motion.article
      style={stacked ? { scale, transformOrigin: "top center", background: tone.bg, borderColor: tone.border } : { background: tone.bg, borderColor: tone.border }}
      className="group relative grid min-h-[420px] w-full gap-8 overflow-hidden border p-7 md:grid-cols-12 md:p-12"
    >
      <div className="flex flex-col justify-between md:col-span-7">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[13px] tracking-[0.2em]" style={{ color: tone.sub }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <h3
          className="mt-8 text-[clamp(3.25rem,9vw,8.5rem)] uppercase leading-[0.82] tracking-[-0.05em]"
          style={{ fontFamily: '"Aeonik", sans-serif', color: tone.ink }}
        >
          {item.title}
        </h3>
        <p className="mt-6 max-w-[34ch] text-lg leading-snug md:text-2xl" style={{ color: tone.ink }}>
          {item.line}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-8 md:col-span-5">
        <div className="self-start md:self-end">
          <PixelGlyph seed={index + 1} color={tone.ink} />
        </div>
        <div>
          <div className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: tone.sub }}>
            Ways in
          </div>
          <ul className="mt-3 border-t" style={{ borderColor: tone.chip }}>
            {item.formats.map((f) => (
              <li
                key={f}
                className="flex items-center justify-between gap-3 border-b py-3 text-base"
                style={{ borderColor: tone.chip, color: tone.ink }}
              >
                {f}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );

  if (!stacked) return <Reveal className="mb-4">{card}</Reveal>;

  return (
    <div className="sticky top-0 flex h-[100svh] items-center">
      <div className="w-full" style={{ paddingTop: `${index * 26}px` }}>
        {card}
      </div>
    </div>
  );
}

function Steps({ tight }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"], layoutEffect: false });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`relative ${tight ? "mt-0" : "mt-24 md:mt-32"}`}>
      <h3 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] text-[var(--heading)]">
        How a partnership runs
      </h3>
      <div className="relative mt-12">
        {/* Track + drawn progress */}
        <span aria-hidden className="absolute left-[11px] top-0 h-full w-px bg-white/15 md:left-0 md:top-[11px] md:h-px md:w-full" />
        <motion.span
          aria-hidden
          style={{ scaleY: line }}
          className="absolute left-[11px] top-0 h-full w-px origin-top bg-[var(--heading)] md:hidden"
        />
        <motion.span
          aria-hidden
          style={{ scaleX: line }}
          className="absolute left-0 top-[11px] hidden h-px w-full origin-left bg-[var(--heading)] md:block"
        />
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          {PARTNER_STEPS.map((s, i) => (
            <Step key={s.n} step={s} index={i} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function Step({ step, index, progress }) {
  const start = index / PARTNER_STEPS.length;
  const lit = useTransform(progress, [start, start + 0.12], [0, 1]);
  const bg = useTransform(lit, [0, 1], ["#181818", "#e2efba"]);
  return (
    <li className="relative pl-10 md:pl-0 md:pt-12">
      <motion.span
        aria-hidden
        style={{ backgroundColor: bg }}
        className="absolute left-0 top-0 h-[23px] w-[23px] border border-[var(--heading)]"
      />
      <span className="font-mono text-[13px] tracking-[0.2em] text-[var(--text-faint)]">{step.n}</span>
      <h4 className="mt-2 text-2xl leading-tight text-white">{step.title}</h4>
      <p className="mt-3 max-w-[32ch] text-base leading-relaxed text-[var(--text-dim)]">{step.line}</p>
    </li>
  );
}

export default function SponsorsSection() {
  const stackRef = useRef(null);
  const stacked = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"], layoutEffect: false });

  const stats = [
    { value: STATS.attendees, label: "Attendees", note: "across events Genesis has run or partnered on" },
    { value: STATS.events, suffix: "+", label: "Events", note: "hackathons, meetups and bootcamps" },
    { value: STATS.women, label: "Women builders", note: `${STATS.womenShareLabel} of all attendees` },
    { value: EVENT_CITIES.length, label: "Cities", note: "in our events archive" },
  ];

  return (
    <section id="sponsors" aria-labelledby="sponsors-title" className="relative z-[3] bg-[#181818] py-24 md:py-40">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <SectionLabel id="sponsors" />
        <ScrollHighlight
          text={BRAND.description}
          className="mt-8 max-w-[22ch] text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[1.06] tracking-[-0.03em] text-white md:max-w-[26ch]"
        />

        {/* Proof numbers: one source, site.js (audit C03) */}
        <dl className="mt-16 grid grid-cols-2 border-l border-t border-white/15 md:mt-24 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-b border-r border-white/15 p-5 md:p-8">
              <dt className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{s.label}</dt>
              <dd className="mt-4 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none text-[var(--heading)]">
                <CountUp value={s.value} suffix={s.suffix || ""} duration={2.2} />
              </dd>
              <dd className="mt-3 text-sm leading-snug text-[var(--text-dim)]">{s.note}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-24 flex flex-col gap-6 md:mt-36 md:flex-row md:items-end md:justify-between">
          <SplitText
            as="h2"
            id="sponsors-title"
            lines={["What you get", "as a sponsor"]}
            className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] text-[var(--heading)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
            className="max-w-[38ch] text-lg leading-relaxed text-[var(--text-dim)]"
          >
            Pick the outcome first. We match it to events and formats, at {DELHI.name} or at independent hackathons across India.
          </motion.p>
        </div>

        <div ref={stackRef} className={`relative ${stacked ? "mt-4" : "mt-12"}`}>
          {SPONSOR_OUTCOMES.map((item, i) => (
            <OutcomeCard
              key={item.key}
              item={item}
              index={i}
              total={SPONSOR_OUTCOMES.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>

        {/* The last sticky card leaves its own breathing room. */}
        <Steps tight={stacked} />

        <Reveal className="mt-20 flex flex-col gap-4 border-t border-white/15 pt-10 sm:flex-row sm:items-center sm:justify-between md:mt-28">
          <p className="max-w-[46ch] text-lg text-[var(--text-dim)]">
            Packages and pricing are shared on the first call, sized to your goal and budget.
          </p>
          <Magnetic strength={0.3}>
            <Link to="/partner" className="btn-cinema" data-cursor data-cursor-label="Partner">
              Partner with Genesis <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
