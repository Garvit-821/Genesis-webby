import React from "react";
import { HOME_CHAPTERS } from "@shared/config/site";
import { ScrambleText } from "@shared/motion";

/**
 * "01 · For sponsors" style label. The number and text come from
 * HOME_CHAPTERS, the same list the chapter rail reads (audit C14).
 */
export default function SectionLabel({ id, tone = "light", className = "" }) {
  const chapter = HOME_CHAPTERS.find((c) => c.id === id);
  if (!chapter) return null;
  const ink = tone === "dark" ? "text-[#181818]" : "text-[var(--text-dim)]";
  const rule = tone === "dark" ? "bg-[#181818]/50" : "bg-[var(--heading)]/50";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`block h-px w-10 ${rule}`} aria-hidden />
      <ScrambleText
        text={`${chapter.n} · ${chapter.label}`}
        className={`font-mono text-[12px] uppercase tracking-[0.22em] ${ink}`}
      />
    </div>
  );
}
