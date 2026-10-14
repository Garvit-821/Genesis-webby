import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { DELHI, PUNE } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal, ScrambleText } from "@shared/motion";
import SectionLabel from "./SectionLabel";

const PUNE_PHOTOS = [
  ["dsc09998", "Participants and organisers of Hackers Occupied Pune seated together in the VIT auditorium"],
  ["dsc09246", "Teams coding on the lab floor at Hackers Occupied Pune"],
  ["dsc09252", "A mentor talking a team through their project"],
  ["dsc09631", "A team still building at 4 AM"],
  ["dsc09188", "Participants cheering during an energy check"],
  ["dsc09267", "A team huddled around one laptop"],
  ["dsc09243", "Two builders reviewing code together"],
  ["dsc00001", "The closing group photo at Hackers Occupied Pune"],
].map(([file, alt]) => ({ src: `/gallery/hackers-occupied-pune/${file}.webp`, alt }));

/** Airport-style board: each track decodes in as the board scrolls in. */
function TrackBoard() {
  return (
    <div className="border-2 border-[#181818] bg-[#181818] p-1">
      <div className="flex items-center justify-between bg-[#181818] px-4 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--heading)]">
        <span>Tracks</span>
        <span>{DELHI.tracks.length} open</span>
      </div>
      <ul className="divide-y divide-white/10">
        {DELHI.tracks.map((t, i) => (
          <li key={t} className="flex items-center justify-between gap-4 bg-[#121212] px-4 py-3.5">
            <span className="font-mono text-[12px] tracking-[0.18em] text-white/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <ScrambleText
              text={t.toUpperCase()}
              delay={i * 140}
              duration={1100}
              className="flex-1 font-display text-[clamp(1.25rem,2.2vw,1.9rem)] leading-none text-[var(--heading)]"
            />
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/60">Delhi</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DelhiSpotlight() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"], layoutEffect: false });
  const xA = useTransform(scrollYProgress, [0, 1], ["4%", "-28%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-22%", "6%"]);
  const scriptRotate = useTransform(scrollYProgress, [0, 0.5], [-14, -6]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-[var(--heading)] py-20 text-[#181818] md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{
        backgroundImage:
          "linear-gradient(to right, #181818 1px, transparent 1px), linear-gradient(to bottom, #181818 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />

      <div className="relative mx-auto max-w-[90rem] px-5 md:px-10">
        <SectionLabel id="series" tone="dark" />
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 bg-[#181818] px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--heading)]">
            <span className="h-1.5 w-1.5 animate-pulse bg-[var(--heading)]" aria-hidden />
            Upcoming
          </span>
          <span className="inline-flex items-center border border-[#181818]/40 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em]">
            Sponsor slots open
          </span>
          <span className="inline-flex items-center border border-[#181818]/40 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em]">
            Our own series
          </span>
        </div>
      </div>

      {/* Kinetic title: two rows drifting in opposite directions */}
      <h2 className="relative mt-10 select-none md:mt-14">
        <span className="sr-only">{`${DELHI.name} ${DELHI.edition}`}</span>
        <motion.span
          aria-hidden
          style={{ x: xA, WebkitTextStroke: "2px #181818" }}
          className="block whitespace-nowrap font-display text-[clamp(4rem,15vw,15rem)] leading-[0.85] text-transparent"
        >
          Hackers Occupied · Hackers Occupied
        </motion.span>
        <span aria-hidden className="relative block">
          <motion.span
            style={{ x: xB }}
            className="block whitespace-nowrap font-display text-[clamp(5rem,22vw,22rem)] leading-[0.82] text-[#181818]"
          >
            Delhi {DELHI.edition} · Delhi
          </motion.span>
          <motion.span
            style={{ rotate: scriptRotate, fontFamily: '"Leirtag Aquelli", cursive' }}
            className="pointer-events-none absolute left-[8%] top-[-8%] text-[clamp(2.5rem,7vw,7rem)] leading-none text-[#6d28d9]"
          >
            next stop
          </motion.span>
        </span>
      </h2>

      <div className="relative mx-auto mt-16 grid max-w-[90rem] gap-12 px-5 md:mt-24 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="max-w-[40ch] text-xl leading-snug md:text-2xl">
            Our next flagship. {DELHI.teams} teams of {DELHI.teamSize} building across {DELHI.tracks.length} tracks in {DELHI.where}.
            Sponsor a track, judge the finals or bring your hiring team.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[#181818]/25 pt-8">
            <div>
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#181818]/70">When</dt>
              <dd className="mt-2 text-xl leading-tight">{DELHI.when}</dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#181818]/70">Where</dt>
              <dd className="mt-2 text-xl leading-tight">{DELHI.where}. {DELHI.venue}.</dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#181818]/70">Format</dt>
              <dd className="mt-2 text-xl leading-tight">{DELHI.teams} teams of {DELHI.teamSize}</dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#181818]/70">
                Registrations <span className="ml-1 border border-[#181818]/40 px-1.5 py-0.5 text-[12px]">projection</span>
              </dt>
              <dd className="mt-2 font-display text-4xl leading-none text-[#181818]">{DELHI.projectedRegistrations}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.3}>
              <Link
                to={`/partner?event=${DELHI.slug}`}
                className="btn-cinema btn-cinema--ink w-full justify-center sm:w-auto"
                data-cursor
                data-cursor-label="Sponsor"
              >
                Sponsor Delhi {DELHI.edition} <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link to={`${DELHI.path}#register`} className="btn-ghost btn-ghost--ink w-full justify-center sm:w-auto">
              Register interest
            </Link>
          </div>
          <Link
            to={DELHI.path}
            className="link-draw mt-6 inline-flex min-h-[44px] items-center gap-2 font-mono text-[13px] uppercase tracking-[0.16em]"
          >
            Full event details <span aria-hidden>→</span>
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <TrackBoard />
        </Reveal>
      </div>
    </div>
  );
}

function PuneRecap() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"], layoutEffect: false });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-38%"]);

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#181818] py-20 md:py-28">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Previously</span>
          <h3 className="mt-3 font-display text-[clamp(2.25rem,5.5vw,4.75rem)] leading-[0.92] text-[var(--heading)]">
            {PUNE.name}
          </h3>
          <p className="mt-3 text-lg text-[var(--text-dim)]">
            {PUNE.when} · {PUNE.shortWhere} · Concluded
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={PUNE.path} className="btn-ghost">Recap and schedule</Link>
          <Link to="/gallery" className="btn-ghost">Gallery</Link>
          <Link to={PUNE.certificatePath} className="btn-ghost">Get your certificate</Link>
        </div>
      </div>

      <motion.ul style={{ x }} className="mt-12 flex w-max gap-4 pl-5 md:mt-16 md:gap-6 md:pl-10">
        {PUNE_PHOTOS.map((p, i) => (
          <motion.li
            key={p.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: (i % 4) * 0.06, ease: EASE_OUT }}
            className={`frame relative shrink-0 overflow-hidden ${i % 2 ? "mt-10 h-[38vw] max-h-[340px] w-[56vw] max-w-[480px]" : "h-[44vw] max-h-[400px] w-[62vw] max-w-[540px]"}`}
          >
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="gallery-img h-full w-full object-cover" />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function SeriesSection() {
  return (
    <section id="series" aria-label="Hackers Occupied" className="relative z-[3]">
      <DelhiSpotlight />
      <PuneRecap />
    </section>
  );
}
