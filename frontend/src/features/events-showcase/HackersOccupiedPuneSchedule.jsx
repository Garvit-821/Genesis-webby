import React, { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from "framer-motion";
import { ACTIVITY_CATEGORIES, PUNE_FACTS, PUNE_SCHEDULE_DATA } from "@shared/data/puneEventScheduleData";
import { EASE_OUT } from "@shared/motion";

const DAYS = [
  { id: "all", label: "Both days" },
  { id: 1, label: "Day 1 · 22 Aug" },
  { id: 2, label: "Day 2 · 23 Aug" },
];

function timeRange(item) {
  return item.endTime && item.endTime !== item.startTime ? `${item.startTime}–${item.endTime}` : item.startTime;
}

function Segmented({ value, onChange, options, label }) {
  const id = useId();
  return (
    <div role="group" aria-label={label} className="relative flex flex-wrap border border-white/20 p-1">
      <LayoutGroup id={id}>
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.id)}
              className={`relative min-h-[44px] px-4 text-[14px] transition-colors ${active ? "text-[#181818]" : "text-white/75 hover:text-white"}`}
            >
              {active ? (
                <motion.span
                  layoutId="seg-pill"
                  className="absolute inset-0 bg-[var(--heading)]"
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                />
              ) : null}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

function TimelineItem({ item, index }) {
  const meta = ACTIVITY_CATEGORIES[item.type] || { color: "#c4b5fd" };
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.55, delay: Math.min((index % 8) * 0.04, 0.3), ease: EASE_OUT }}
      className="relative grid grid-cols-[4.75rem_1fr] gap-4 pb-6 sm:grid-cols-[7.5rem_1fr] sm:gap-8"
    >
      <div className="pt-1 text-right font-mono text-[13px] leading-tight text-white/80 sm:text-[14px]">
        <span className="block text-white">{item.startTime}</span>
        {item.endTime !== item.startTime ? <span className="block text-white/55">{item.endTime}</span> : null}
      </div>
      <div className="relative border-l border-white/15 pb-2 pl-6 sm:pl-8">
        <span
          aria-hidden
          className={`absolute top-2 -translate-x-1/2 ${item.milestone ? "-left-px h-3.5 w-3.5" : "-left-px h-2.5 w-2.5"}`}
          style={{ background: item.milestone ? "var(--heading)" : meta.color }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex min-h-[24px] items-center border px-2 font-mono text-[12px] uppercase tracking-[0.12em]"
            style={{ color: meta.color, borderColor: `${meta.color}66` }}
          >
            {item.type}
          </span>
          {item.milestone ? (
            <span className="inline-flex min-h-[24px] items-center bg-[var(--heading)] px-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[#181818]">
              Milestone
            </span>
          ) : null}
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-white/55">{item.date}</span>
        </div>
        <h4 className="mt-2 text-lg font-medium leading-snug text-white sm:text-xl">{item.activity}</h4>
        <p className="mt-1 text-[15px] leading-relaxed text-white/70">{item.notes}</p>
        <p className="mt-1 text-[14px] text-white/55">
          {item.participantImpact} · {item.duration}
        </p>
      </div>
    </motion.li>
  );
}

/**
 * The Pune programme as it ran. A record of a finished event, so there is no
 * countdown or sign-up prompt (audit C01). Every number is computed from
 * the schedule data (C11).
 */
export default function HackersOccupiedPuneSchedule() {
  const [day, setDay] = useState("all");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("timeline");
  const listRef = useRef(null);
  const searchId = useId();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"], layoutEffect: false });
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PUNE_SCHEDULE_DATA.filter((item) => {
      if (day !== "all" && item.dayNum !== day) return false;
      if (category !== "All" && item.type !== category) return false;
      if (!q) return true;
      return `${item.activity} ${item.type} ${item.notes} ${item.participantImpact} ${item.startTime}`.toLowerCase().includes(q);
    });
  }, [day, category, query]);

  const usedTypes = useMemo(() => Array.from(new Set(PUNE_SCHEDULE_DATA.map((i) => i.type))), []);
  const filtered = day !== "all" || category !== "All" || query;
  const reset = () => {
    setDay("all");
    setCategory("All");
    setQuery("");
  };

  const facts = [
    { label: "Scheduled activities", value: PUNE_FACTS.activityCount },
    { label: "Hours of hacking", value: PUNE_FACTS.hackingHours },
    { label: "Mentoring rounds", value: PUNE_FACTS.mentoringRounds },
    { label: "Logitech activities", value: PUNE_FACTS.logitechActivities },
  ];

  return (
    <div className="w-full text-white">
      <dl className="grid grid-cols-2 border-l border-t border-white/10 md:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="border-b border-r border-white/10 p-5">
            <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/65">{f.label}</dt>
            <dd className="mt-2 font-display text-4xl leading-none text-white">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Segmented label="Day" value={day} onChange={setDay} options={DAYS} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor={searchId} className="sr-only">
            Search the schedule
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: mentoring, dinner, Logitech"
            className="h-12 w-full border border-white/20 bg-black/40 px-4 text-base text-white placeholder:text-white/50 focus:border-[var(--heading)] focus:outline-none sm:w-80"
          />
          <Segmented
            label="View"
            value={view}
            onChange={setView}
            options={[
              { id: "timeline", label: "Timeline" },
              { id: "table", label: "Table" },
            ]}
          />
        </div>
      </div>

      <div role="group" aria-label="Activity type" className="mt-5 flex flex-wrap gap-2">
        {["All", ...usedTypes].map((t) => {
          const meta = ACTIVITY_CATEGORIES[t];
          const active = category === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active && t !== "All" ? "All" : t)}
              className="min-h-[44px] border px-3 text-[14px] transition-colors"
              style={{
                borderColor: active ? meta?.color || "var(--heading)" : "rgba(255,255,255,0.2)",
                background: active ? meta?.bg || "rgba(226,239,186,0.15)" : "transparent",
                color: active ? meta?.color || "var(--heading)" : "rgba(255,255,255,0.78)",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-[15px] text-white/70">
        <p aria-live="polite">
          Showing {items.length} of {PUNE_SCHEDULE_DATA.length} activities
        </p>
        {filtered ? (
          <button type="button" onClick={reset} className="min-h-[44px] text-[var(--heading)] underline-offset-4 hover:underline">
            Clear filters
          </button>
        ) : null}
      </div>

      {view === "timeline" ? (
        <div ref={listRef} className="relative mt-8">
          <motion.span
            aria-hidden
            style={{ scaleY: rail, background: "linear-gradient(to bottom, var(--heading), rgba(196,181,253,0.6))" }}
            className="absolute bottom-0 left-[calc(4.75rem+1rem)] top-0 w-px origin-top sm:left-[calc(7.5rem+2rem)]"
          />
          <ol>
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <TimelineItem key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </ol>
          {!items.length ? (
            <p className="py-16 text-center text-lg text-white/75">Nothing in the schedule matches that.</p>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-white/15">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Hackers Occupied Pune schedule, 22 and 23 August 2026</caption>
            <thead>
              <tr className="border-b border-white/15 bg-white/[0.04] font-mono text-[12px] uppercase tracking-[0.12em] text-white/70">
                <th scope="col" className="px-4 py-3 font-normal">Date</th>
                <th scope="col" className="px-4 py-3 font-normal">Time</th>
                <th scope="col" className="px-4 py-3 font-normal">Activity</th>
                <th scope="col" className="px-4 py-3 font-normal">Type</th>
                <th scope="col" className="px-4 py-3 font-normal">Who</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/10 align-top text-[15px] hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap px-4 py-3 text-white/70">{item.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-white">{timeRange(item)}</td>
                  <td className="px-4 py-3 text-white">
                    {item.activity}
                    {item.milestone ? <span className="ml-2 text-[var(--heading)]">· Milestone</span> : null}
                    <span className="mt-1 block text-[14px] text-white/60">{item.notes}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3" style={{ color: ACTIVITY_CATEGORIES[item.type]?.color }}>
                    {item.type}
                  </td>
                  <td className="px-4 py-3 text-white/75">{item.participantImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
