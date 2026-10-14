import React, { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE_OUT, useFinePointer } from "@shared/motion";
import EventPoster from "./EventPoster";
import RoleBadge from "./RoleBadge";

const UNDATED = "Partner highlights";

function groupByYear(events) {
  const groups = [];
  events.forEach((e) => {
    const key = e.year || UNDATED;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, items: [] };
      groups.push(g);
    }
    g.items.push(e);
  });
  return groups;
}

/** Big outline year that fills in as its group scrolls past. */
function YearMarker({ label, count, targetRef }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 75%", "end 40%"],
    layoutEffect: false,
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const isYear = /^\d{4}$/.test(label);

  return (
    <div className="lg:sticky lg:top-40">
      <div className="relative inline-block">
        <span
          className={`archive-year block font-display leading-none ${isYear ? "text-[clamp(3rem,6.4vw,6.25rem)]" : "text-[clamp(1.9rem,3.6vw,3rem)]"}`}
          aria-hidden
        >
          {label}
        </span>
        <motion.span
          aria-hidden
          style={{ clipPath: fill }}
          className={`absolute inset-0 block font-display leading-none text-[var(--heading)] ${isYear ? "text-[clamp(3rem,6.4vw,6.25rem)]" : "text-[clamp(1.9rem,3.6vw,3rem)]"}`}
        >
          {label}
        </motion.span>
      </div>
      <h2 className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-white/65">
        <span className="sr-only">{label}: </span>
        {count} {count === 1 ? "event" : "events"}
      </h2>
    </div>
  );
}

function YearGroup({ group, onSelect, onHover, startIndex }) {
  const ref = useRef(null);
  return (
    <section ref={ref} className="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
      <div className="lg:col-span-3">
        <YearMarker label={group.key} count={group.items.length} targetRef={ref} />
      </div>
      <ul className="lg:col-span-9">
        <AnimatePresence initial={false}>
          {group.items.map((e, i) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, delay: Math.min((startIndex + i) * 0.025, 0.4), ease: EASE_OUT }}
              className="border-b border-white/10"
            >
              <button
                type="button"
                onClick={(ev) => onSelect(e, ev.currentTarget)}
                onMouseEnter={() => onHover(e)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(null)}
                className="archive-row event-poster-host grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-2 py-5 text-left md:grid-cols-[8.5rem_1fr_auto] md:px-4"
                data-cursor
                data-cursor-label="Open"
              >
                <span className="archive-row__muted order-2 font-mono text-[12px] uppercase tracking-[0.12em] text-white/65 transition-colors md:order-none">
                  {e.date || ""}
                </span>
                <span className="order-1 col-span-2 min-w-0 md:order-none md:col-span-1">
                  <span className="archive-row__ink block font-display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1] text-[var(--heading)] transition-colors">
                    {e.title}
                  </span>
                  <span className="archive-row__muted mt-2 block text-[15px] text-white/70 transition-colors">
                    {e.venue}
                    {e.cities.length === 1 && e.venue !== e.city ? ` · ${e.city}` : ""}
                    {" · "}
                    {e.category}
                    {e.attendees ? ` · ${e.attendees.toLocaleString("en-IN")} attended` : ""}
                  </span>
                </span>
                <span className="order-3 flex items-center justify-end gap-4">
                  <RoleBadge role={e.role} />
                  <span aria-hidden className="archive-row__arrow archive-row__ink hidden text-xl text-white md:inline">
                    →
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

/** Poster that trails the cursor over the index (desktop, fine pointer only). */
function HoverPreview({ event, x, y }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
      style={{ x, y }}
    >
      <AnimatePresence mode="popLayout">
        {event ? (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: "inset(50% 50% 50% 50%)" }}
            animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="-translate-x-1/2 -translate-y-1/2"
          >
            <EventPoster event={event} className="aspect-[4/5] w-[260px] shadow-[0_30px_80px_rgba(0,0,0,0.6)]" size="thumb" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function PosterGrid({ events, onSelect }) {
  return (
    <LayoutGroup>
      <motion.ul layout className="grid grid-cols-1 gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {events.map((e, i) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.6, delay: Math.min(i * 0.03, 0.45), ease: EASE_OUT }}
            >
              <button
                type="button"
                onClick={(ev) => onSelect(e, ev.currentTarget)}
                className="event-poster-host group block w-full text-left"
                data-cursor
                data-cursor-label="Open"
              >
                <EventPoster event={e} className="aspect-[4/5] w-full" />
                <span className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[15px] text-white/80">{e.date || e.venue}</span>
                  <RoleBadge role={e.role} />
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}

export function ArchiveGrid({ events, view, onSelect, onReset }) {
  const fine = useFinePointer();
  const [hovered, setHovered] = useState(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 });
  const groups = useMemo(() => groupByYear(events), [events]);

  const onPointerMove = (e) => {
    if (!fine) return;
    // Sit to the right of the cursor, but never past the viewport edge.
    mx.set(Math.min(e.clientX + 170, window.innerWidth - 150));
    my.set(Math.min(Math.max(e.clientY, 170), window.innerHeight - 170));
  };

  if (!events.length) {
    return (
      <div className="mx-auto max-w-[90rem] px-5 py-24 text-center md:px-12">
        <p className="font-display text-3xl text-[var(--heading)]">No events match these filters.</p>
        <button type="button" onClick={onReset} className="btn-ghost mt-8">
          Clear filters
        </button>
      </div>
    );
  }

  let running = 0;

  return (
    <div className="mx-auto max-w-[90rem] px-5 md:px-12" onPointerMove={onPointerMove} onPointerLeave={() => setHovered(null)}>
      {view === "posters" ? (
        <PosterGrid events={events} onSelect={onSelect} />
      ) : (
        <>
          {groups.map((g) => {
            const start = running;
            running += g.items.length;
            return <YearGroup key={g.key} group={g} onSelect={onSelect} onHover={fine ? setHovered : () => {}} startIndex={start} />;
          })}
          {fine ? <HoverPreview event={hovered} x={x} y={y} /> : null}
        </>
      )}
    </div>
  );
}

export default ArchiveGrid;
