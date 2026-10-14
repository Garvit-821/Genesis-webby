import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { STATS, SERIES } from "@shared/config/site";
import { PAST_EVENTS } from "@shared/data/events";
import { EASE_OUT, Magnetic, SplitText } from "@shared/motion";
import SectionLabel from "@features/home/SectionLabel";
import EventMap from "./EventMap";

const RECENT = PAST_EVENTS.filter((e) => e.iso).slice(0, 7);

function Row({ event, index }) {
  // On phones: date + role on one line, then title, then city · type.
  // From md up the wrappers dissolve (md:contents) into the 12-col grid.
  const content = (
    <>
      <span className="flex items-center justify-between gap-4 md:contents">
        <span className="font-mono text-[13px] tracking-[0.12em] text-[var(--text-faint)] md:col-span-2">
          {event.date}
        </span>
        <span className="w-fit border border-white/25 px-2.5 py-1 font-mono text-[12px] uppercase tracking-[0.14em] text-white/85 md:order-last md:col-span-1 md:justify-self-end">
          {event.role === "Organiser" ? "Ours" : "Partner"}
        </span>
      </span>
      <span className="font-display text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[0.95] text-[var(--heading)] md:col-span-5">
        {event.title}
      </span>
      <span className="flex flex-wrap gap-x-3 md:contents">
        <span className="text-base text-white/80 md:col-span-2">{event.city}</span>
        <span className="text-base text-[var(--text-dim)] md:col-span-2 md:text-sm">{event.category}</span>
      </span>
    </>
  );
  const cls =
    "event-row relative grid gap-2 border-b border-white/10 py-6 md:grid-cols-12 md:items-center md:gap-6";

  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: EASE_OUT }}
    >
      {event.path ? (
        <Link to={event.path} className={`${cls} group`}>
          {content}
        </Link>
      ) : (
        <div className={cls}>{content}</div>
      )}
    </motion.li>
  );
}

export default function Events() {
  return (
    <section id="events" aria-labelledby="events-title" className="relative z-[3] border-t border-white/10 bg-[#181818] py-24 md:py-36">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel id="events" />
            <SplitText
              as="h2"
              id="events-title"
              text="Events"
              className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] text-[var(--heading)]"
            />
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-[var(--text-dim)]">
            {STATS.eventsLabel} events. Our own series is {SERIES.name}. We also partner with
            hackathons run by student communities. &ldquo;Partner&rdquo; means Genesis was Event Partner, not the organiser.
          </p>
        </div>

        <div className="mt-14 hidden grid-cols-12 gap-6 border-b border-white/15 pb-3 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)] md:grid">
          <span className="col-span-2">Date</span>
          <span className="col-span-5">Event</span>
          <span className="col-span-2">City</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1 justify-self-end">Role</span>
        </div>
        <ol className="mt-4 md:mt-0">
          {RECENT.map((e, i) => (
            <Row key={e.id} event={e} index={i} />
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[var(--text-dim)]">Search all past events by city, year, type and role.</p>
          <Magnetic strength={0.25}>
            <Link to="/events" className="btn-cinema" data-cursor data-cursor-label="Archive">
              Browse {PAST_EVENTS.length} archived events <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>

        <EventMap />
      </div>
    </section>
  );
}
