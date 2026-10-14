import React from "react";

/** Who ran the event: Genesis (Organiser) or another community (Event Partner). Audit C07. */
export default function RoleBadge({ role, className = "" }) {
  const organiser = role === "Organiser";
  return (
    <span
      className={`archive-role inline-flex min-h-[28px] items-center gap-2 border px-2.5 font-mono text-[12px] uppercase tracking-[0.14em] ${
        organiser ? "border-[var(--heading)]/60 text-[var(--heading)]" : "border-white/30 text-white/80"
      } ${className}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 ${organiser ? "bg-[var(--heading)]" : "border border-current"}`} />
      {organiser ? "Organiser" : "Event Partner"}
    </span>
  );
}
