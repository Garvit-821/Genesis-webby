import React from "react";
import CountUp from "@shared/ui/CountUp";
import { STATS } from "@shared/config/site";

/** Deck figures, from the one shared constant (audit C03). */
export const STAT_ITEMS = [
  { label: "Attendees across our events", value: STATS.attendees, suffix: "" },
  { label: "Events run or partnered on", value: STATS.events, suffix: "+" },
  { label: `Women builders (${STATS.women.toLocaleString("en-IN")})`, value: 35, suffix: "%" },
];

export default function StatStrip({ className = "" }) {
  return (
    <dl className={`grid gap-8 border-t border-[var(--border)] pt-8 sm:grid-cols-3 ${className}`}>
      {STAT_ITEMS.map((s) => (
        <div key={s.label}>
          <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{s.label}</dt>
          <dd className="mt-2 font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none text-[var(--heading)]">
            {/* The counter animates from zero; assistive tech gets the real figure. */}
            <span className="sr-only">
              {s.value.toLocaleString("en-IN")}
              {s.suffix}
            </span>
            <span aria-hidden="true">
              <CountUp value={s.value} suffix={s.suffix} duration={2.2} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
