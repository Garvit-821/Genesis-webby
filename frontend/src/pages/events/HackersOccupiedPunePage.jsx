import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@widgets/layout";
import HackersOccupiedPuneSchedule from "@features/events-showcase/HackersOccupiedPuneSchedule";
import { EVENT_DETAILS, PUNE_FACTS, PUNE_SCHEDULE_DATA } from "@shared/data/puneEventScheduleData";
import { PUNE_STORY, PUNE_GROUP_PHOTO } from "@shared/data/mediaAssets";
import { BRAND, DELHI, PUNE, SITE_URL } from "@shared/config/site";
import { EASE_OUT, Magnetic, Reveal, ScrambleText, SplitText, useMediaQuery } from "@shared/motion";
import "./events.css";

const find = (activity) => PUNE_SCHEDULE_DATA.find((i) => i.activity === activity);
const startsOf = (pred) => PUNE_SCHEDULE_DATA.filter(pred).map((i) => i.startTime);
const listTimes = (times) =>
  times.length > 1 ? `${times.slice(0, -1).join(", ")} and ${times[times.length - 1]}` : times[0];

/** Highlights written from the schedule rows, so the page cannot drift from the data (audit C11). */
function buildHighlights() {
  const mentoring = PUNE_SCHEDULE_DATA.filter((i) => i.type === "Mentoring");
  const logitech = startsOf((i) => /^Logitech Activity \d/.test(i.activity));
  const creatorStart = find("Creator Challenge Release");
  const creatorEnd = find("Creator Track Submission Deadline");
  const salesforce = find("Salesforce Speaker Session");
  const problem = find("Problem Statement Release");
  return [
    {
      title: "Two tracks",
      body: `${EVENT_DETAILS.tracks.join(" and ")}. Problem statements went out at ${problem?.startTime} on 22 Aug.`,
    },
    {
      title: `${PUNE_FACTS.mentoringRounds} mentoring rounds`,
      body: `At ${listTimes(mentoring.map((m) => `${m.startTime} (${m.date.slice(0, 6)})`))}. Two mentors visited every team, about 5 minutes each.`,
    },
    {
      title: `${PUNE_FACTS.logitechActivities} Logitech activities`,
      body: `Overnight at ${listTimes(logitech)}. One person per team took part while the rest kept building.`,
    },
    {
      title: "Creator challenges",
      body: `10 to 15 challenges released at ${creatorStart?.startTime} on 22 Aug. Submissions closed at ${creatorEnd?.startTime} on 23 Aug.`,
    },
    {
      title: "Salesforce session",
      body: `Optional session with Salesforce engineers on 23 Aug, ${salesforce?.startTime} to ${salesforce?.endTime}. E-certificates for those who attended.`,
    },
    {
      title: "Food at the desks",
      body: "Cornitos snacks and Red Bull at 17:00, dinner at 20:00, midnight snacks, then tea and breakfast at 08:00, all served at team tables.",
    },
  ];
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: PUNE.name,
  description: `${PUNE.name} took place on ${PUNE.when} at ${PUNE.where}.`,
  startDate: EVENT_DETAILS.startDate,
  endDate: EVENT_DETAILS.endDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Vishwakarma Institute of Technology (VIT)",
    address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  },
  image: [`${SITE_URL}${PUNE_GROUP_PHOTO?.src}`],
  organizer: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
};

function ConcludedStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      transition={{ duration: 0.7, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
      className="pixel-corners inline-flex flex-col items-center border-2 border-[var(--heading)] px-5 py-3 text-[var(--heading)]"
    >
      <span className="font-mono text-[12px] uppercase tracking-[0.2em]">Concluded</span>
      <span className="whitespace-nowrap font-display text-2xl leading-none">22–23.08.26</span>
    </motion.div>
  );
}

/** Photo strip that slides sideways as the page scrolls (sticky, no scroll hijack). */
function RecapStrip() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const scrub = wide && !reduce;
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!scrub) return undefined;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scrub]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"], layoutEffect: false });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["10%", "-45%"]);

  const frames = PUNE_STORY.map((p, i) => (
    <figure key={p.src} className="w-[80vw] shrink-0 snap-start sm:w-[56vw] lg:w-[min(46vw,720px)]">
      <div className="relative aspect-[3/2] overflow-hidden bg-[#121214]">
        <img
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          loading={i < 2 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-mono text-[12px] tracking-[0.14em] text-white">
          {String(i + 1).padStart(2, "0")} / {String(PUNE_STORY.length).padStart(2, "0")}
        </span>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="font-display text-xl text-[var(--heading)]">{p.caption}</span>
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">{p.meta}</span>
      </figcaption>
    </figure>
  ));

  if (!scrub) {
    return (
      <section aria-label="Photos from Hackers Occupied Pune" className="py-16">
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-12">{frames}</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Photos from Hackers Occupied Pune" className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.span
          aria-hidden
          style={{ x: wordX }}
          className="text-outline pointer-events-none absolute bottom-[4vh] left-0 whitespace-nowrap font-display text-[32vw] leading-none opacity-40"
        >
          Pune Pune
        </motion.span>
        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max gap-10 pl-12 pr-24 will-change-transform">
          {frames}
        </motion.div>
      </div>
    </section>
  );
}

export default function HackersOccupiedPunePage() {
  const highlights = buildHighlights();

  return (
    <PageShell seo={{ jsonLd: JSON_LD }}>
      {/* Hero */}
      <header className="relative overflow-hidden px-5 pb-16 pt-40 md:px-12 md:pt-52">
        <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-[90rem]">
          <div className="flex items-center gap-3">
            <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
            <ScrambleText text="Hackers Occupied · Recap" className="overline" />
          </div>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SplitText
              as="h1"
              lines={["Hackers", "Occupied Pune"]}
              trigger="mount"
              delay={0.15}
              className="font-display text-[clamp(3rem,10vw,9.5rem)] leading-[0.86] text-[var(--heading)]"
            />
            <ConcludedStamp />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE_OUT }}
            className="mt-10 max-w-[56ch] text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {PUNE.name} took place on {PUNE.when} at {PUNE.where}. The next Hackers Occupied is in Delhi.
          </motion.p>

          <dl className="mt-10 grid grid-cols-2 border-l border-t border-white/10 lg:grid-cols-4">
            {[
              { label: "When", value: PUNE.when },
              { label: "Where", value: EVENT_DETAILS.venueShort },
              { label: "Format", value: `${EVENT_DETAILS.format}, ${PUNE_FACTS.hackingHours} hours of hacking` },
              { label: "Prize pool", value: EVENT_DETAILS.prizePool },
            ].map((f, i) => (
              <Reveal key={f.label} delay={0.2 + i * 0.06} className="border-b border-r border-white/10 p-5">
                <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/65">{f.label}</dt>
                <dd className="mt-2 text-lg text-white">{f.value}</dd>
              </Reveal>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic strength={0.25}>
              <Link to={PUNE.certificatePath} className="btn-cinema w-full justify-center sm:w-auto" data-cursor data-cursor-label="Certificate">
                Download your certificate <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link to="/gallery" className="btn-ghost w-full justify-center sm:w-auto">
              See all photos
            </Link>
            <a href="#schedule" className="inline-flex min-h-[44px] items-center px-2 text-[15px] text-white/80 underline-offset-4 hover:text-white hover:underline">
              Jump to the schedule ↓
            </a>
          </div>
        </div>
      </header>

      <RecapStrip />

      {/* Highlights */}
      <section aria-labelledby="pune-highlights" className="mx-auto max-w-[90rem] px-5 py-20 md:px-12 md:py-28">
        <p className="overline">What happened</p>
        <SplitText
          as="h2"
          id="pune-highlights"
          text="Two days at VIT Pune"
          className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] text-[var(--heading)]"
        />
        <ol className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal as="li" key={h.title} delay={(i % 3) * 0.08} className="group relative bg-[var(--bg)] p-6 md:p-8">
              <span className="font-mono text-[12px] tracking-[0.14em] text-white/55">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 font-display text-2xl leading-none text-white transition-colors group-hover:text-[var(--heading)]">
                {h.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/75">{h.body}</p>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--heading)] transition-transform duration-700 group-hover:scale-x-100" />
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Schedule */}
      <section id="schedule" aria-labelledby="pune-schedule" className="scroll-mt-28 border-t border-white/10">
        <div className="mx-auto max-w-[90rem] px-5 py-20 md:px-12 md:py-28">
          <p className="overline">Schedule</p>
          <SplitText
            as="h2"
            id="pune-schedule"
            lines={["How the", `${PUNE_FACTS.eventHours} hours ran`]}
            className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] text-[var(--heading)]"
          />
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-white/75 md:text-lg">
            From arrivals at 11:00 on 22 August to the close at 15:00 on 23 August. All {PUNE_FACTS.activityCount} activities, as scheduled.
          </p>
          <div className="mt-12">
            <HackersOccupiedPuneSchedule />
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section aria-labelledby="pune-certs" className="border-t border-white/10">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 id="pune-certs" className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-none text-white">
              Took part? Get your certificate.
            </h2>
            <p className="mt-3 text-base text-white/75">Use the email and phone number you registered with.</p>
          </div>
          <Link to={PUNE.certificatePath} className="btn-ghost">
            Download certificate <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Next up */}
      <section aria-label="Next event" className="px-5 pb-24 md:px-12 md:pb-32">
        <Link
          to={DELHI.path}
          className="group pixel-corners relative mx-auto block max-w-[90rem] overflow-hidden bg-[var(--heading)] p-8 text-[#181818] md:p-14"
          data-cursor
          data-cursor-label="Delhi"
        >
          <span className="font-mono text-[12px] uppercase tracking-[0.18em]">Next up</span>
          <span className="mt-4 block font-display text-[clamp(2.6rem,8vw,7.5rem)] leading-[0.86]">
            {DELHI.name} {DELHI.edition}
          </span>
          <span className="mt-6 flex flex-wrap items-center justify-between gap-4 text-lg">
            <span>
              {DELHI.where} · {DELHI.when} · {DELHI.teams} teams
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.14em]">
              See the event
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
          </span>
        </Link>
      </section>
    </PageShell>
  );
}
