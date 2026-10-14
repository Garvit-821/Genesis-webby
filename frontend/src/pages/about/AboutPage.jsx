import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { BRAND, DELHI, PUNE, SERIES } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal, ScrollHighlight } from "@shared/motion";
import StatStrip from "@pages/partner/components/StatStrip";
import ProofList from "@pages/partner/components/ProofList";

/** What Genesis does, by audience. Facts only; the origin story is still to be written. */
const WHAT_WE_DO = [
  {
    who: "For companies",
    title: "Sponsorships that fit",
    line: "We find hackathons that match your audience, city and budget, then set up the sponsorship: tracks, judging, booths or workshops.",
    link: { to: "/partner", label: "Sponsor an event" },
  },
  {
    who: "For organisers",
    title: "Partners for your event",
    line: "Student teams running independent hackathons get sponsors and support through Genesis. You keep running your event.",
    link: { to: "/collaborate", label: "Collaborate with us" },
  },
  {
    who: "Our own series",
    title: SERIES.name,
    line: `${PUNE.name} ran on ${PUNE.when} at ${PUNE.shortWhere}. ${DELHI.name} is next: ${DELHI.where}, ${DELHI.when}.`,
    link: { to: DELHI.path, label: `See ${DELHI.name} ${DELHI.edition}` },
  },
];

function WhatCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: index * 0.12, ease: EASE_OUT }}
      className="group relative flex min-h-[22rem] flex-col justify-between border border-[var(--border)] bg-white/[0.02] p-6 transition-colors duration-500 hover:bg-white/[0.04] md:p-8"
    >
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{item.who}</p>
        <h3 className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[0.95] text-[var(--heading)]">{item.title}</h3>
        <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-[var(--text-dim)]">{item.line}</p>
      </div>
      <Link to={item.link.to} className="mt-8 inline-flex min-h-[44px] w-fit items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text)] hover:text-[var(--heading)]">
        {item.link.label}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </motion.article>
  );
}

/** Pune done, Delhi next: a scroll-scrubbed hand-off between the two editions. */
function SeriesBand() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"], layoutEffect: false });
  const puneX = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const delhiX = useTransform(scrollYProgress, [0, 1], ["-18%", "0%"]);

  return (
    <section ref={ref} aria-labelledby="series-title" className="relative overflow-hidden border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 md:px-12">
        <div className="flex items-center gap-3">
          <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
          <span className="overline">Our own series</span>
        </div>
        <h2 id="series-title" className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-[var(--heading)]">
          {SERIES.name}
        </h2>
      </div>

      <div className="mt-14 space-y-2" aria-hidden>
        <motion.div style={{ x: puneX }} className="whitespace-nowrap font-display text-[16vw] leading-[0.85] text-outline opacity-60">
          Pune · Pune · Pune · Pune
        </motion.div>
        <motion.div style={{ x: delhiX }} className="whitespace-nowrap font-display text-[16vw] leading-[0.85] text-[var(--heading)]">
          Delhi · Delhi · Delhi · Delhi
        </motion.div>
      </div>

      <div className="mx-auto mt-14 grid max-w-[90rem] gap-6 px-5 md:grid-cols-2 md:px-12">
        <Reveal className="border border-[var(--border)] p-6 md:p-8">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Concluded</p>
          <h3 className="mt-4 font-display text-3xl text-[var(--heading)]">{PUNE.name}</h3>
          <p className="mt-3 text-base text-[var(--text-dim)]">
            {PUNE.when} at {PUNE.where}.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link to={PUNE.path} className="link-draw inline-flex min-h-[44px] items-center text-[var(--text)]">Recap and schedule</Link>
            <Link to="/gallery" className="link-draw inline-flex min-h-[44px] items-center text-[var(--text)]">Photos</Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative overflow-hidden border border-[var(--heading)]/60 bg-[var(--heading)] p-6 text-[#181818] md:p-8">
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em]">
            <span className="h-2 w-2 animate-pulse bg-[#181818]" aria-hidden />
            Upcoming
          </p>
          <h3 className="mt-4 font-display text-3xl">
            {DELHI.name} {DELHI.edition}
          </h3>
          <p className="mt-3 text-base text-[#181818]/80">
            {DELHI.where} · {DELHI.when} · {DELHI.teams} teams · {DELHI.tracks.length} tracks
          </p>
          <Link to={DELHI.path} className="mt-6 inline-flex min-h-[44px] items-center gap-2 border-b border-[#181818] font-mono text-[12px] uppercase tracking-[0.16em]">
            Upcoming events <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero eyebrow="About" title="About Genesis" lines={["About", "Genesis."]} intro={BRAND.description}>
        <StatStrip className="mt-16" />
      </PageHero>

      <section aria-labelledby="what-title" className="border-t border-[var(--border)] px-5 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3">
                <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
                <span className="overline">What we do</span>
              </div>
              <h2 id="what-title" className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-[var(--heading)]">
                What we do
              </h2>
            </div>
            <ScrollHighlight
              className="text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.25] tracking-[-0.01em] text-[var(--text)] md:col-span-8"
              text="Companies want to meet student developers. Student hackathons need sponsors. Genesis sits between the two, and runs its own hackathons too."
            />
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {WHAT_WE_DO.map((item, i) => (
              <WhatCard key={item.who} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ProofList
        intro="Hackathons where Genesis was Event Partner. Each was run by its own organising team."
      />

      <SeriesBand />

      <section aria-labelledby="more-title" className="border-t border-[var(--border)] px-5 py-20 md:px-12">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="more-title" className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] text-[var(--heading)]">
            More about Genesis
          </h2>
          <nav aria-label="About Genesis" className="flex flex-wrap gap-3">
            <Magnetic strength={0.2}>
              <Link to="/team" className="btn-cinema">Meet the team</Link>
            </Magnetic>
            <Link to="/values" className="btn-ghost">How we run events</Link>
            <Link to="/events" className="btn-ghost">Events archive</Link>
            <Link to="/gallery" className="btn-ghost">Gallery</Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
