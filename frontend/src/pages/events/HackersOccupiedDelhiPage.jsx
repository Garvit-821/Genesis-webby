import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { PageShell } from "@widgets/layout";
import CountUp from "@shared/ui/CountUp";
import DelhiInterestForm from "@features/forms/DelhiInterestForm";
import { BRAND, CONTACT, DELHI, PUNE, SITE_URL, SPONSOR_OUTCOMES } from "@shared/config/site";
import {
  EASE_OUT,
  Magnetic,
  Reveal,
  ScrambleText,
  ScrollHighlight,
  SplitText,
  VelocityMarquee,
} from "@shared/motion";

/**
 * One-line framing per track. These describe the theme of each track,
 * not prizes or partners. NEEDS_CONFIRMATION: final track briefs.
 */
const TRACK_LINES = {
  AI: "Models, agents and tools that do real work.",
  Web3: "Chains, wallets and on-chain apps people can use.",
  FinTech: "Payments, credit and money tools built for India.",
  Agro: "Tech for farms, supply chains and food.",
  Healthcare: "Care, diagnostics and access to health services.",
  CyberSecurity: "Defence, privacy and security tooling.",
};

const PUNE_STRIP = ["dsc09998", "dsc09229", "dsc09340", "dsc09397", "dsc09238", "dsc09999"].map((f) => ({
  src: `/gallery/hackers-occupied-pune/${f}.webp`,
}));

const FAQ = [
  {
    q: "When is it?",
    a: `${DELHI.when}. Dates are tentative and will be confirmed on this page first.`,
  },
  {
    q: "Where is it?",
    a: `${DELHI.where}. ${DELHI.venue}.`,
  },
  {
    q: "How big are teams?",
    a: `Teams of ${DELHI.teamSize}. We are planning for ${DELHI.teams} teams across ${DELHI.tracks.length} tracks.`,
  },
  {
    q: "How do I hear when registration opens?",
    a: "Register your interest below. We email registration details when they open. Registering interest does not guarantee a place.",
  },
  {
    q: "How do we sponsor it?",
    a: `Use the partner form or email ${CONTACT.email}. We reply ${CONTACT.replyTime}.`,
  },
];

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${DELHI.name} ${DELHI.edition}`,
  description: `Hackers Occupied Delhi is Genesis Hacks' own hackathon: ${DELHI.teams} teams of ${DELHI.teamSize} across ${DELHI.tracks.join(", ")} tracks in ${DELHI.where}. Dates are tentative.`,
  startDate: DELHI.startDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: DELHI.where,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
  },
  organizer: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
  url: `${SITE_URL}${DELHI.path}`,
  image: `${SITE_URL}/images/og-genesis.jpg`,
};

/** Concentric pixel rings pulsing out from Delhi NCR. Pure CSS. */
function Signal() {
  return (
    <div aria-hidden className="delhi-signal pointer-events-none absolute right-[-12%] top-1/2 hidden h-[70vmin] w-[70vmin] -translate-y-1/2 md:block">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="delhi-signal__ring" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
      <span className="delhi-signal__core" />
      <span className="delhi-signal__label font-mono">Delhi NCR · 28.61°N 77.21°E</span>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"], layoutEffect: false });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const facts = [
    ["When", DELHI.when],
    ["Where", `${DELHI.where}, ${DELHI.venue.toLowerCase()}`],
    ["Teams", `${DELHI.teams} teams of ${DELHI.teamSize}`],
    ["Tracks", `${DELHI.tracks.length} tracks`],
  ];

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-44 md:pb-20">
      <div aria-hidden className="hero-grid absolute inset-0 opacity-[0.1]" />
      <Signal />
      <motion.div style={{ y, opacity: fade }} className="relative z-[2] mx-auto w-full max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 bg-[var(--heading)] px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-[#181818]">
            <span className="h-1.5 w-1.5 animate-pulse bg-[#181818]" aria-hidden />
            Upcoming
          </span>
          <ScrambleText
            text="Hackers Occupied · Edition 02"
            className="border border-white/25 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-white/85"
          />
        </div>

        <SplitText
          as="h1"
          lines={["Hackers Occupied", `Delhi ${DELHI.edition}`]}
          trigger="mount"
          delay={0.2}
          stagger={0.08}
          className="mt-8 font-display text-[clamp(3rem,11vw,11.5rem)] leading-[0.84] text-[var(--heading)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE_OUT }}
          className="mt-8 max-w-[52ch] text-lg leading-relaxed text-[var(--text-dim)] md:text-xl"
        >
          Genesis&apos;s own hackathon series comes to {DELHI.where}. {DELHI.teams} teams build across
          {" "}{DELHI.tracks.join(", ")}. Sponsor slots are open now. Student registration has not opened yet,
          so register interest to hear first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Magnetic strength={0.3}>
            <Link
              to={`/partner?event=${DELHI.slug}`}
              className="btn-cinema w-full justify-center sm:w-auto"
              data-cursor
              data-cursor-label="Sponsor"
            >
              Sponsor Delhi {DELHI.edition} <span aria-hidden>→</span>
            </Link>
          </Magnetic>
          <a href="#register" className="btn-ghost w-full justify-center sm:w-auto">
            Register interest
          </a>
        </motion.div>

        <motion.dl
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { staggerChildren: 0.08, delayChildren: 1 } } }}
          className="mt-14 grid grid-cols-2 border-l border-t border-white/15 md:grid-cols-4"
        >
          {facts.map(([k, v]) => (
            <motion.div
              key={k}
              variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="border-b border-r border-white/15 p-4 md:p-6"
            >
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{k}</dt>
              <dd className="mt-2 text-base leading-snug text-white md:text-lg">{v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}

function TrackGrid() {
  return (
    <section aria-labelledby="tracks-title" className="relative border-t border-white/10 py-24 md:py-36">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitText
            as="h2"
            id="tracks-title"
            text="Six tracks"
            className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.88] text-[var(--heading)]"
          />
          <p className="max-w-[40ch] text-lg text-[var(--text-dim)]">
            Sponsors can own a track: set the problem, judge the finalists and meet the teams who built for it.
          </p>
        </div>
        <ul className="mt-14 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {DELHI.tracks.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE_OUT }}
              className="track-card group relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-[#181818] p-6 md:min-h-[320px] md:p-8"
            >
              <span aria-hidden className="track-card__fill" />
              <span className="relative flex items-center justify-between font-mono text-[13px] tracking-[0.2em] text-[var(--text-faint)] transition-colors duration-500 group-hover:text-[#181818]/70">
                <span>Track {String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="transition-transform duration-500 group-hover:rotate-90">+</span>
              </span>
              <span className="relative">
                <h3 className="font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[0.9] text-[var(--heading)] transition-colors duration-500 group-hover:text-[#181818]">
                  {t}
                </h3>
                <p className="mt-3 max-w-[30ch] text-base text-[var(--text-dim)] transition-colors duration-500 group-hover:text-[#181818]/80">
                  {TRACK_LINES[t]}
                </p>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Numbers() {
  const items = [
    { value: DELHI.teams, label: "Teams", note: "planned for this edition" },
    { value: 5, prefix: "3–", label: "Builders per team", note: "bring your own or find one" },
    { value: DELHI.tracks.length, label: "Tracks", note: DELHI.tracks.join(" · ") },
    { value: 4000, suffix: "+", label: "Registrations", note: "projection, not a result", projection: true },
  ];
  return (
    <section aria-label="Format" className="relative border-t border-white/10 bg-[var(--heading)] py-20 text-[#181818] md:py-28">
      <div className="mx-auto grid max-w-[90rem] gap-px bg-[#181818]/20 px-0 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.08} className="bg-[var(--heading)] p-6 md:p-10">
            <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-[#181818]/75">
              {it.label}
              {it.projection ? <span className="border border-[#181818]/40 px-1.5 py-0.5 text-[12px]">projection</span> : null}
            </div>
            <div className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] leading-none text-[#181818]">
              {it.prefix || ""}
              <CountUp value={it.value} suffix={it.suffix || ""} duration={2} />
            </div>
            <p className="mt-3 text-sm leading-snug text-[#181818]/80">{it.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Sponsors() {
  return (
    <section aria-labelledby="delhi-sponsors-title" className="relative border-t border-white/10 py-24 md:py-36">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <ScrollHighlight
          as="p"
          text={`Hackers Occupied is where Genesis puts brands in the room with the builders. Delhi ${DELHI.edition} is the next one.`}
          className="max-w-[24ch] text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.06] tracking-[-0.03em] text-white"
        />
        <h2 id="delhi-sponsors-title" className="mt-20 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.95] text-[var(--heading)]">
          Sponsor Delhi {DELHI.edition}
        </h2>
        <div className="mt-10 grid gap-px bg-white/15 lg:grid-cols-3">
          {SPONSOR_OUTCOMES.map((o, i) => (
            <Reveal key={o.key} delay={i * 0.08} className="flex flex-col justify-between gap-8 bg-[#181818] p-6 md:p-10">
              <div>
                <span className="font-mono text-[13px] tracking-[0.2em] text-[var(--text-faint)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[clamp(2.5rem,5vw,4.25rem)] uppercase leading-[0.85] tracking-[-0.05em] text-[var(--heading)]" style={{ fontFamily: '"Aeonik", sans-serif' }}>
                  {o.title}
                </h3>
                <p className="mt-4 text-lg leading-snug text-white/85">{o.line}</p>
              </div>
              <ul className="border-t border-white/15">
                {o.formats.map((f) => (
                  <li key={f} className="border-b border-white/15 py-3 text-[15px] text-[var(--text-dim)]">{f}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-lg text-[var(--text-dim)]">
            Packages are sized on the first call. Email{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-white underline underline-offset-4">{CONTACT.email}</a> or call{" "}
            <a href={CONTACT.phoneHref} className="text-white underline underline-offset-4">{CONTACT.phone}</a>.
          </p>
          <Magnetic strength={0.3}>
            <Link to={`/partner?event=${DELHI.slug}`} className="btn-cinema" data-cursor data-cursor-label="Sponsor">
              Start a sponsorship <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

function Previously() {
  return (
    <section aria-labelledby="previously-title" className="relative overflow-hidden border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Previously</span>
          <h2 id="previously-title" className="mt-3 font-display text-[clamp(2rem,5vw,4.25rem)] leading-[0.92] text-[var(--heading)]">
            {PUNE.name}
          </h2>
          <p className="mt-3 text-lg text-[var(--text-dim)]">{PUNE.when} · {PUNE.shortWhere} · Concluded</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={PUNE.path} className="btn-ghost">Pune recap</Link>
          <Link to="/gallery" className="btn-ghost">Photos</Link>
        </div>
      </div>
      <div className="mt-12">
        <VelocityMarquee baseVelocity={-1.2} copies={2} itemClassName="gap-4 pr-4 md:gap-6 md:pr-6" skew={false}>
          {PUNE_STRIP.map((p, i) => (
            <img
              key={p.src}
              src={p.src}
              alt={i === 0 ? "Photos from Hackers Occupied Pune, August 2026" : ""}
              loading="lazy"
              decoding="async"
              className="gallery-img h-[240px] w-auto shrink-0 object-cover md:h-[340px]"
            />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-labelledby="faq-title" className="relative border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 md:px-10 lg:grid-cols-12">
        <h2 id="faq-title" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.92] text-[var(--heading)] lg:col-span-4">
          Questions
        </h2>
        <ul className="border-t border-white/15 lg:col-span-8">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <li key={item.q} className="border-b border-white/15">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left text-xl text-white md:text-2xl"
                >
                  {item.q}
                  <span aria-hidden className={`font-mono text-2xl text-[var(--heading)] transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-6 text-lg leading-relaxed text-[var(--text-dim)]">{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Register() {
  return (
    <section id="register" aria-labelledby="register-title" className="relative scroll-mt-28 border-t border-white/10 py-24 md:py-36">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Students and builders</span>
          <h2 id="register-title" className="mt-4 font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.9] text-[var(--heading)]">
            Register interest
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-[var(--text-dim)]">
            Leave your details and we will email you when registration opens, with dates, venue and how team selection works.
          </p>
          <p className="mt-6 text-base text-[var(--text-dim)]">
            Sponsoring instead?{" "}
            <Link to={`/partner?event=${DELHI.slug}`} className="text-white underline underline-offset-4">
              Use the partner form
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-7">
          <DelhiInterestForm />
        </div>
      </div>
    </section>
  );
}

export default function HackersOccupiedDelhiPage() {
  return (
    <PageShell seo={{ jsonLd: EVENT_JSONLD }}>
      <Hero />
      <TrackGrid />
      <Numbers />
      <Sponsors />
      <Previously />
      <Faq />
      <Register />
    </PageShell>
  );
}
