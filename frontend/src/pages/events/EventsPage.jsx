import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { BRAND, SITE_URL } from "@shared/config/site";
import { EVENT_CATEGORIES, EVENT_CITIES, EVENT_YEARS, PAST_EVENTS } from "@shared/data/events";
import { ArchiveHero, ArchiveCommandBar, ArchiveGrid, ArchiveModal, HorizontalScrollReel } from "./components";
import "./events.css";

const FILTER_KEYS = ["category", "city", "year", "role"];
const ROLES = ["Organiser", "Event Partner"];

function matches(e, filters, query, skip) {
  if (skip !== "category" && filters.category !== "All" && e.category !== filters.category) return false;
  if (skip !== "city" && filters.city !== "All" && !e.cities.includes(filters.city)) return false;
  if (skip !== "year" && filters.year !== "All" && e.year !== filters.year) return false;
  if (skip !== "role" && filters.role !== "All" && e.role !== filters.role) return false;
  if (query) {
    const hay = `${e.title} ${e.venue} ${e.cities.join(" ")} ${e.category}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Genesis Hacks events archive",
  url: `${SITE_URL}/events`,
  description: "Every event Genesis has run or partnered on.",
  isPartOf: { "@type": "WebSite", name: BRAND.name, url: SITE_URL },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: PAST_EVENTS.length,
    itemListElement: PAST_EVENTS.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.title,
      ...(e.path ? { url: `${SITE_URL}${e.path}` } : {}),
    })),
  },
};

export default function EventsPage() {
  const [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState(null);

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || "All"])),
    [params],
  );
  const query = params.get("q") || "";
  const view = params.get("view") === "posters" ? "posters" : "list";
  const q = query.trim().toLowerCase();

  const update = useCallback(
    (key, value) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === "All" || (key === "view" && value === "list")) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const resetFilters = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        [...FILTER_KEYS, "q"].forEach((k) => next.delete(k));
        return next;
      },
      { replace: true },
    );
  }, [setParams]);

  const filtered = useMemo(() => PAST_EVENTS.filter((e) => matches(e, filters, q)), [filters, q]);

  // Each option's count respects every other active filter.
  const facets = useMemo(() => {
    const count = (key, value) =>
      PAST_EVENTS.filter((e) => matches(e, filters, q, key)).filter((e) => {
        if (key === "city") return e.cities.includes(value);
        return e[key] === value;
      }).length;
    const build = (key, values) => values.map((v) => ({ value: v, label: v, count: count(key, v) }));
    return {
      category: build("category", EVENT_CATEGORIES),
      city: build("city", EVENT_CITIES),
      year: build("year", EVENT_YEARS),
      role: build("role", ROLES),
    };
  }, [filters, q]);

  const hasFilters = FILTER_KEYS.some((k) => filters[k] !== "All") || Boolean(q);

  // The dialog hands focus back to whatever had it when it opened (audit V04).
  const onSelect = useCallback((event) => setSelected(event), []);

  return (
    <PageShell seo={{ jsonLd: JSON_LD }}>
      <PageHero
        eyebrow="Archive"
        title="Events archive"
        lines={["Events", "archive"]}
        intro="Every event Genesis has run or partnered on."
      />

      <ArchiveHero />

      <HorizontalScrollReel onSelect={onSelect} />

      <section aria-labelledby="archive-index-title" className="pb-24 md:pb-32">
        <h2 id="archive-index-title" className="sr-only">
          All events
        </h2>
        <ArchiveCommandBar
          query={query}
          setQuery={(v) => update("q", v)}
          facets={facets}
          filters={filters}
          setFilter={update}
          count={filtered.length}
          total={PAST_EVENTS.length}
          view={view}
          setView={(v) => update("view", v)}
          hasFilters={hasFilters}
          resetFilters={resetFilters}
        />
        <ArchiveGrid events={filtered} view={view} onSelect={onSelect} onReset={resetFilters} />
      </section>

      <AnimatePresence>
        {selected ? <ArchiveModal key={selected.id} event={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </PageShell>
  );
}
