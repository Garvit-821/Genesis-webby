import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@shared/motion";
import useNavVisible from "./useNavVisible";

function ChipGroup({ label, value, options, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-full font-mono text-[12px] uppercase tracking-[0.16em] text-white/60 sm:w-auto">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          disabled={opt.count === 0 && value !== opt.value}
          onClick={() => onChange(value === opt.value ? "All" : opt.value)}
          className="archive-chip"
        >
          {opt.label}
          {typeof opt.count === "number" ? (
            <span className="ml-2 font-mono text-[12px] opacity-70">{opt.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/**
 * Search, filters and view switch for the archive. Every count comes from
 * the data with the other filters applied, so numbers never disagree.
 */
export function ArchiveCommandBar({
  query,
  setQuery,
  facets,
  filters,
  setFilter,
  count,
  total,
  view,
  setView,
  hasFilters,
  resetFilters,
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const navVisible = useNavVisible();
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  // Only shift under the header once the bar is actually stuck to the top.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // "/" jumps to search, like most archives.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || "");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <div ref={sentinelRef} aria-hidden className="h-px" />
    <div
      className="sticky top-0 z-30 border-y border-white/10 bg-[#121214]/95 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: stuck && navVisible ? "translateY(72px)" : "translateY(0)" }}
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-5 py-4 md:px-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <label htmlFor="archive-search" className="sr-only">
              Search events
            </label>
            <svg aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              id="archive-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, venue or city"
              autoComplete="off"
              className="h-12 w-full border border-white/20 bg-black/40 pl-11 pr-12 text-base text-white placeholder:text-white/50 focus:border-[var(--heading)] focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 border border-white/25 px-2 py-0.5 font-mono text-[12px] text-white/60 md:block">
              /
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="archive-filters"
              className="archive-chip inline-flex items-center gap-2"
            >
              Filters
              {hasFilters ? <span className="h-2 w-2 bg-[var(--heading)]" aria-hidden /> : null}
              <span aria-hidden className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            <div role="group" aria-label="View" className="flex">
              {[
                { id: "list", label: "Index" },
                { id: "posters", label: "Posters" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => setView(v.id)}
                  className="archive-chip -ml-px first:ml-0"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id="archive-filters"
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="flex max-h-[55vh] flex-col gap-5 overflow-y-auto pb-2 pt-1">
                <ChipGroup label="Genesis role" value={filters.role} options={facets.role} onChange={(v) => setFilter("role", v)} />
                <ChipGroup label="Format" value={filters.category} options={facets.category} onChange={(v) => setFilter("category", v)} />
                <ChipGroup label="Year" value={filters.year} options={facets.year} onChange={(v) => setFilter("year", v)} />
                <ChipGroup label="City" value={filters.city} options={facets.city} onChange={(v) => setFilter("city", v)} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
          <p aria-live="polite">
            Showing <span className="text-white">{count}</span> of {total} events
          </p>
          {hasFilters ? (
            <button type="button" onClick={resetFilters} className="inline-flex min-h-[44px] items-center text-[var(--heading)] underline-offset-4 hover:underline">
              Clear filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
    </>
  );
}

export default ArchiveCommandBar;
