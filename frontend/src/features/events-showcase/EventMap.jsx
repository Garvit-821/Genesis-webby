import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { PAST_EVENTS, UPCOMING_EVENTS } from "@shared/data/events";
import { DELHI } from "@shared/config/site";
import { EASE_OUT } from "@shared/motion";

/**
 * Pin positions in the 1000×1000 india.svg space, projected from each
 * city's latitude/longitude with a least-squares fit against known state
 * outlines (accurate to a few pixels at this scale).
 * NEEDS_CONFIRMATION: compare the outline with the Survey of India map.
 */
const REGIONS = [
  { id: "ncr", label: "Delhi NCR", cities: ["New Delhi", "Gurugram", "Noida", "Greater Noida", "Ghaziabad"], x: 349, y: 324, states: ["INDL", "INHR", "INUP"] },
  { id: "mohali", label: "Mohali", cities: ["Mohali"], x: 334, y: 262, states: ["INPB", "INCH"] },
  { id: "jaipur", label: "Jaipur", cities: ["Jaipur"], x: 309, y: 373, states: ["INRJ"] },
  { id: "lucknow", label: "Lucknow", cities: ["Lucknow"], x: 450, y: 374, states: ["INUP"] },
  { id: "ranchi", label: "Ranchi", cities: ["Ranchi"], x: 569, y: 477, states: ["INJH"] },
  { id: "mumbai", label: "Mumbai", cities: ["Mumbai"], x: 229, y: 602, states: ["INMH"] },
  { id: "pune", label: "Pune", cities: ["Pune"], x: 256, y: 620, states: ["INMH"] },
  { id: "goa", label: "Goa", cities: ["Goa"], x: 259, y: 716, states: ["INGA"] },
  { id: "bengaluru", label: "Bengaluru", cities: ["Bengaluru"], x: 358, y: 781, states: ["INKA"] },
  { id: "chennai", label: "Chennai", cities: ["Chennai"], x: 425, y: 785, states: ["INTN"] },
];

const HUB = REGIONS[0];

function arcPath(from, to) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Bow each arc to one side, proportional to its length.
  return `M${from.x} ${from.y} Q${mx - dy * 0.22} ${my + dx * 0.22} ${to.x} ${to.y}`;
}

export default function EventMap() {
  const rootRef = useRef(null);
  const near = useInView(rootRef, { once: true, margin: "400px 0px" });
  const inView = useInView(rootRef, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const [paths, setPaths] = useState([]);
  const [selectedId, setSelectedId] = useState(HUB.id);
  const [hoverId, setHoverId] = useState(null);

  // The outline is 200 KB, so fetch it only when the map is close.
  useEffect(() => {
    if (!near || paths.length) return undefined;
    let cancelled = false;
    fetch("/india.svg")
      .then((res) => res.text())
      .then((svg) => {
        if (cancelled) return;
        const re = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)"/g;
        const out = [];
        let m;
        while ((m = re.exec(svg)) !== null) out.push({ d: m[1], id: m[2], name: m[3] });
        setPaths(out);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [near, paths.length]);

  const regions = useMemo(
    () =>
      REGIONS.map((r) => {
        const events = PAST_EVENTS.filter((e) => e.cities.some((c) => r.cities.includes(c)));
        const upcoming = UPCOMING_EVENTS.filter((e) => e.cities.some((c) => r.cities.includes(c)));
        const byCity = r.cities
          .map((c) => ({ city: c, count: PAST_EVENTS.filter((e) => e.cities.includes(c)).length }))
          .filter((c) => c.count > 0);
        return { ...r, events, upcoming, byCity };
      }).filter((r) => r.events.length || r.upcoming.length),
    [],
  );

  const totalCities = new Set(regions.flatMap((r) => r.byCity.map((c) => c.city))).size;
  const activeId = hoverId || selectedId;
  const active = regions.find((r) => r.id === activeId) || regions[0];
  const activeStates = new Set(active?.states || []);
  const statesWithEvents = new Set(regions.flatMap((r) => r.states));

  return (
    <div ref={rootRef} className="relative mt-24 border border-[var(--border)] bg-[var(--surface)] p-5 md:mt-32 md:p-12">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        {/* Copy + selected region */}
        <div className="lg:col-span-5">
          <div className="mb-6 flex items-center gap-3">
            <span className="block h-px w-10 bg-[var(--text-dim)]" />
            <span className="overline">Across India</span>
          </div>
          <h3 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.92] text-[var(--heading)]">
            {totalCities} cities so far
          </h3>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-[var(--text-dim)]">
            Cities where Genesis has run or partnered on events. Pick a pin or a city to see what happened there.
          </p>

          <div className="mt-8 min-h-[260px]" aria-live="polite">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="border border-[var(--border-strong)] bg-[var(--bg)] p-5 md:p-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-display text-3xl leading-none text-[var(--heading)]">{active.label}</h4>
                    <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
                      {active.events.length} {active.events.length === 1 ? "event" : "events"}
                    </span>
                  </div>
                  {active.upcoming.length ? (
                    <Link
                      to={DELHI.path}
                      className="mt-4 flex min-h-[44px] items-center justify-between gap-3 bg-[var(--heading)] px-4 py-2 text-[var(--bg)]"
                    >
                      <span className="font-mono text-[12px] uppercase tracking-[0.14em]">Next · {active.upcoming[0].title}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                  <ul className="mt-4 divide-y divide-[var(--border)]">
                    {active.events.slice(0, 4).map((e) => (
                      <li key={e.id} className="flex items-baseline justify-between gap-4 py-2.5">
                        <span className="text-[15px] text-[var(--text)]">{e.title}</span>
                        <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--text-dim)]">
                          {e.year || e.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.byCity.map((c) => (
                      <Link
                        key={c.city}
                        to={`/events?city=${encodeURIComponent(c.city)}`}
                        className="inline-flex min-h-[44px] items-center border border-[var(--border-strong)] px-3 text-[14px] text-[var(--text)] transition-colors hover:border-[var(--brand)]"
                      >
                        {c.city} · {c.count} in the archive
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-7">
          <div className="relative mx-auto aspect-square w-full max-w-[640px] select-none">
            {paths.length ? (
              <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <g>
                  {paths.map((p) => (
                    <path
                      key={p.id}
                      d={p.d}
                      style={{
                        fill: activeStates.has(p.id)
                          ? "var(--brand)"
                          : statesWithEvents.has(p.id)
                            ? "var(--surface-2)"
                            : "transparent",
                        fillOpacity: activeStates.has(p.id) ? 0.22 : 1,
                        stroke: activeStates.has(p.id) ? "var(--brand)" : "var(--border-strong)",
                        strokeWidth: activeStates.has(p.id) ? 1.4 : 0.7,
                        transition: "fill 300ms ease, stroke 300ms ease",
                      }}
                    />
                  ))}
                </g>
                <g fill="none" stroke="var(--brand)" strokeWidth="1.2" strokeDasharray="3 5">
                  {regions
                    .filter((r) => r.id !== HUB.id)
                    .map((r, i) => (
                      <motion.path
                        key={r.id}
                        d={arcPath(HUB, r)}
                        initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                        animate={inView ? { pathLength: 1, opacity: activeId === r.id ? 0.95 : 0.35 } : undefined}
                        transition={{ duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.3 + i * 0.08, ease: EASE_OUT }}
                      />
                    ))}
                </g>
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
                Loading map
              </div>
            )}

            {/* Pins are real buttons: keyboard, touch and screen reader friendly */}
            {regions.map((r, i) => {
              const isActive = r.id === activeId;
              const hasUpcoming = r.upcoming.length > 0;
              return (
                <motion.button
                  key={r.id}
                  type="button"
                  aria-label={`${r.label}: ${r.events.length} events${hasUpcoming ? `, next up ${r.upcoming[0].title}` : ""}`}
                  aria-pressed={selectedId === r.id}
                  onClick={() => setSelectedId(r.id)}
                  onMouseEnter={() => setHoverId(r.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(r.id)}
                  onBlur={() => setHoverId(null)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : undefined}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                  className="group absolute flex h-7 w-7 items-center justify-center"
                  style={{ left: `${r.x / 10}%`, top: `${r.y / 10}%`, x: "-50%", y: "-50%" }}
                  data-cursor
                  data-cursor-label={r.label}
                >
                  {hasUpcoming ? (
                    <span aria-hidden className="absolute h-7 w-7 animate-ping border border-[var(--brand)] opacity-70" />
                  ) : null}
                  <span
                    aria-hidden
                    className={`relative block transition-all duration-300 ${isActive ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`}
                    style={{ background: "var(--brand)", boxShadow: isActive ? "0 0 0 4px color-mix(in srgb, var(--brand) 30%, transparent)" : "none" }}
                  />
                  {hasUpcoming || isActive ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-full ml-2 whitespace-nowrap bg-[var(--heading)] px-2 py-1 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--bg)]"
                    >
                      {hasUpcoming && !isActive ? `Delhi ${DELHI.edition}` : r.label}
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          {/* The same places as a list, for touch, keyboard and screen readers */}
          <div className="mt-8">
            <h4 className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)]">All cities</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {regions.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    aria-pressed={selectedId === r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`inline-flex min-h-[44px] items-center gap-2 border px-3 text-[14px] transition-colors ${
                      selectedId === r.id
                        ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--bg)]"
                        : "border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--brand)]"
                    }`}
                  >
                    {r.label}
                    <span className="font-mono text-[12px] opacity-75">{r.events.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
