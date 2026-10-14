import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { DELHI } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal } from "@shared/motion";

/** Lime band: inverts the theme tokens so the shared buttons read dark-on-lime. */
const BAND_VARS = {
  "--text": "#181818",
  "--bg": "#e2efba",
  "--heading": "#181818",
  "--border": "rgba(24,24,24,0.18)",
  "--border-strong": "rgba(24,24,24,0.45)",
  "--text-dim": "rgba(24,24,24,0.78)",
  "--text-faint": "rgba(24,24,24,0.66)",
};

function Fact({ label, children, note }) {
  return (
    <div className="border-t border-[#181818]/20 pt-4">
      <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#181818]/70">{label}</dt>
      <dd className="mt-2 text-lg leading-snug text-[#181818] md:text-xl">
        {children}
        {note ? (
          <span className="mt-1 block font-mono text-[12px] uppercase tracking-[0.12em] text-[#181818]/70">{note}</span>
        ) : null}
      </dd>
    </div>
  );
}

/**
 * The event sponsors are being sold right now. Giant scroll-scrubbed
 * wordmark, the facts, and a CTA that preselects Delhi in the form.
 */
export default function DelhiSpotlight({ sponsorHref = `/partner?event=${DELHI.slug}#partner-form`, showEventLink = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"], layoutEffect: false });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"]);
  const xBack = useTransform(scrollYProgress, [0, 1], ["-30%", "4%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="delhi-spotlight-title"
      style={BAND_VARS}
      className="relative overflow-hidden bg-[#e2efba] py-20 text-[#181818] md:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap md:top-10">
        <motion.div style={{ x }} className="font-display text-[22vw] leading-[0.8] text-[#181818]/[0.07]">
          OCCUPIED · OCCUPIED · OCCUPIED
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 md:px-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.18em]">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping bg-[#181818] opacity-50" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-[#181818]" />
          </span>
          Next up · Sponsor slots open
        </div>

        <h2 id="delhi-spotlight-title" className="mt-6">
          <span className="sr-only">
            {DELHI.name} {DELHI.edition}
          </span>
          <span aria-hidden className="block font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-none">
            Hackers Occupied
          </span>
          <span aria-hidden className="relative block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
              className="block font-display text-[clamp(5rem,19vw,17rem)] leading-[0.82] tracking-[-0.02em]"
            >
              Delhi
            </motion.span>
            <span
              className="absolute bottom-[12%] right-[2%] rotate-[-8deg] text-[clamp(2rem,5vw,4.5rem)] leading-none text-[#7a2d8f]"
              style={{ fontFamily: '"Leirtag Aquelli", cursive' }}
            >
              {DELHI.edition}
            </span>
          </span>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            <Fact label="When" note="Dates to be confirmed">
              {DELHI.when.replace(" (tentative)", "")}
            </Fact>
            <Fact label="Where" note={DELHI.venue}>
              {DELHI.where}
            </Fact>
            <Fact label="Format">
              {DELHI.teams} teams of {DELHI.teamSize}
            </Fact>
            <Fact label="Registrations" note="Projection, not a result">
              {DELHI.projectedRegistrations} expected
            </Fact>
            <div className="border-t border-[#181818]/20 pt-4 sm:col-span-2">
              <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#181818]/70">Tracks</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {DELHI.tracks.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.6, ease: EASE_OUT }}
                    className="border border-[#181818] px-3 py-2 font-mono text-[13px] uppercase tracking-[0.1em]"
                  >
                    {t}
                  </motion.span>
                ))}
              </dd>
            </div>
          </dl>

          <Reveal delay={0.15} className="flex flex-col justify-end gap-4 lg:col-span-4">
            <p className="text-lg leading-relaxed text-[#181818]/80">
              Put your API, hiring team or brand in front of {DELHI.teams} student teams for a weekend in {DELHI.where}.
            </p>
            <Magnetic strength={0.25}>
              <Link to={sponsorHref} className="btn-cinema w-full justify-center" data-cursor data-cursor-label="Sponsor">
                Sponsor Delhi {DELHI.edition} <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            {showEventLink ? (
              <Link to={DELHI.path} className="btn-ghost w-full justify-center">
                See the event page
              </Link>
            ) : null}
          </Reveal>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none relative mt-16 select-none whitespace-nowrap">
        <motion.div style={{ x: xBack }} className="font-display text-[9vw] leading-none text-[#181818]/[0.08]">
          AI · WEB3 · FINTECH · AGRO · HEALTHCARE · CYBERSECURITY · AI · WEB3 · FINTECH
        </motion.div>
      </div>
    </section>
  );
}
