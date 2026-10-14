import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ALL_EVENTS, eventSummary } from "@shared/data/events";
import { PROOF_EVENTS } from "@shared/config/site";
import { SplitText, useMediaQuery } from "@shared/motion";
import EventPoster from "./EventPoster";
import RoleBadge from "./RoleBadge";

const FACTS = Object.fromEntries(PROOF_EVENTS.map((p) => [p.name, p.fact]));

function statusLabel(e) {
  if (e.status === "upcoming") return "Upcoming";
  if (e.series) return "Recap";
  return null;
}

function ReelCard({ event, index, onSelect }) {
  const label = statusLabel(event);
  const fact = FACTS[event.title] || eventSummary(event);
  const body = (
    <>
      <div className="relative">
        <EventPoster event={event} className="aspect-[4/5] w-full lg:aspect-[5/4]" size="large" loading={index < 2 ? "eager" : "lazy"} />
        <span className="absolute left-4 top-4 font-mono text-[12px] tracking-[0.14em] text-white/85">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {label ? (
          <span
            className={`inline-flex min-h-[28px] items-center px-2.5 font-mono text-[12px] uppercase tracking-[0.14em] ${
              event.status === "upcoming" ? "bg-[var(--heading)] text-[#181818]" : "border border-white/30 text-white/85"
            }`}
          >
            {label}
          </span>
        ) : null}
        <RoleBadge role={event.role} />
      </div>
      <p className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[0.95] text-[var(--heading)]">{event.title}</p>
      <p className="mt-2 text-[15px] text-white/75">
        {[event.date, event.venue].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-white/70">{fact}</p>
      {event.path ? (
        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-white">
          {event.status === "upcoming" ? "See the event" : "Read the recap"}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      ) : null}
    </>
  );

  const cls = "event-poster-host group block w-[78vw] shrink-0 snap-start text-left sm:w-[46vw] lg:w-[min(30vw,460px)]";
  if (event.path) {
    return (
      <Link to={event.path} className={cls} data-cursor data-cursor-label={label || "Open"}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={(ev) => onSelect(event, ev.currentTarget)} className={cls} data-cursor data-cursor-label="Open">
      {body}
    </button>
  );
}

/**
 * Featured strip: Hackers Occupied plus the partner events confirmed in the
 * reference facts. Desktop scrubs it sideways with page scroll (sticky, no
 * scroll hijacking); touch screens and reduced motion get a swipe row.
 */
export function HorizontalScrollReel({ onSelect }) {
  const featured = useMemo(() => {
    const series = ALL_EVENTS.filter((e) => e.series);
    const partners = ALL_EVENTS.filter((e) => e.confirmed && !e.series && e.role === "Event Partner");
    return [...series, ...partners];
  }, []);

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
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scrub, featured.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const heading = (
    <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 md:flex-row md:items-end md:justify-between md:px-12">
      <div>
        <p className="overline">Featured</p>
        <SplitText
          as="h2"
          lines={["Hackers Occupied", "and partner proof"]}
          className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] text-[var(--heading)]"
        />
      </div>
      <p className="max-w-[42ch] text-base leading-relaxed text-white/75 md:text-lg">
        Our own series, Hackers Occupied, and {featured.length - 2} events where Genesis was Event Partner.
      </p>
    </div>
  );

  if (!scrub) {
    return (
      <section aria-label="Featured events" className="py-20 md:py-28">
        {heading}
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-12">
          {featured.map((e, i) => (
            <ReelCard key={e.id} event={e} index={i} onSelect={onSelect} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Featured events" className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        {heading}
        <motion.div ref={trackRef} style={{ x }} className="mt-12 flex w-max gap-8 pl-12 pr-24 will-change-transform">
          {featured.map((e, i) => (
            <ReelCard key={e.id} event={e} index={i} onSelect={onSelect} />
          ))}
        </motion.div>
        <div className="mx-auto mt-10 w-full max-w-[90rem] px-12">
          <div className="h-px w-full bg-white/15">
            <motion.div style={{ width: bar }} className="h-px bg-[var(--heading)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HorizontalScrollReel;
