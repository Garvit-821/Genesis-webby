import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import { CONTACT } from "@shared/config/site";
import { EASE_OUT } from "@shared/motion";

/* ─── Building blocks for legal copy ─────────────────────────── */

export function Callout({ children }) {
  return (
    <div className="my-6 border-l-2 border-[var(--heading)] bg-white/[0.04] px-5 py-4 text-[var(--text)]">
      {children}
    </div>
  );
}

export function List({ children }) {
  return <ul className="my-4 list-disc space-y-2 pl-5 marker:text-[var(--heading)]">{children}</ul>;
}

/** Responsive table: scrolls inside its own box, never the page. */
export function DataTable({ caption, columns, rows }) {
  return (
    <div className="my-6 overflow-x-auto border border-[var(--border)]">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-white/[0.05]">
            {columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-mono text-[12px] font-normal uppercase tracking-[0.14em] text-[var(--text-dim)]">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-[var(--border)] align-top">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 font-normal text-[var(--text)]">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 text-[var(--text-dim)]">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Scroll-spy ─────────────────────────────────────────────── */

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      ob.observe(el);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
    // `key` captures the id list; the array identity changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

function TocList({ sections, active, onNavigate }) {
  return (
    <ol className="space-y-1">
      {sections.map((s, i) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={`group relative flex min-h-[40px] items-start gap-3 py-2 pl-4 text-[15px] leading-snug transition-colors ${
                isActive ? "text-[var(--heading)]" : "text-[var(--text-dim)] hover:text-white"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="legal-toc-indicator"
                  aria-hidden
                  className="absolute left-0 top-2 h-[calc(100%-1rem)] w-[2px] bg-[var(--heading)]"
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              ) : (
                <span aria-hidden className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-white/15" />
              )}
              <span className="font-mono text-[12px] leading-[1.6] text-[var(--text-faint)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */

const DOCS = [
  { to: "/privacy", label: "Privacy policy", type: "privacy" },
  { to: "/terms", label: "Terms of service", type: "terms" },
];

export default function LegalPage({ type, title, intro, sections, lastUpdated }) {
  const active = useActiveSection(sections.map((s) => s.id));
  const other = DOCS.find((d) => d.type !== type);

  return (
    <PageShell>
      <PageHero eyebrow="Legal" title={title} intro={intro}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <nav aria-label="Legal documents" className="flex gap-2">
            {DOCS.map((d) => {
              const current = d.type === type;
              return (
                <Link
                  key={d.to}
                  to={d.to}
                  aria-current={current ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center border px-4 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${
                    current
                      ? "border-[var(--heading)] bg-[var(--heading)] text-[#181818]"
                      : "border-[var(--border-strong)] text-[var(--text-dim)] hover:border-white hover:text-white"
                  }`}
                >
                  {d.label}
                </Link>
              );
            })}
          </nav>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
            Last updated <time dateTime="2026-10-13">{lastUpdated}</time>
          </p>
        </div>
      </PageHero>

      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 pb-24 md:px-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 lg:pb-32">
        {/* Table of contents: sticky rail on desktop, collapsible on mobile */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <details className="group border border-[var(--border)] lg:hidden">
            <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
              On this page
              <span aria-hidden className="transition-transform group-open:rotate-45">+</span>
            </summary>
            <nav aria-label="On this page" className="border-t border-[var(--border)] px-2 py-3">
              <TocList sections={sections} active={active} />
            </nav>
          </details>

          <nav aria-label="On this page" className="hidden lg:block">
            <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">On this page</p>
            <TocList sections={sections} active={active} />
          </nav>

          <div className="mt-8 hidden border-t border-[var(--border)] pt-6 lg:block">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Questions</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-3 block break-words text-[15px] text-white underline-offset-4 hover:underline">
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref} className="mt-1 block text-[15px] text-[var(--text-dim)] underline-offset-4 hover:text-white hover:underline">
              {CONTACT.phone}
            </a>
            <p className="mt-3 text-sm text-[var(--text-faint)]">We reply {CONTACT.replyTime}.</p>
          </div>
        </aside>

        <div className="min-w-0 max-w-[72ch]">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="scroll-mt-32 border-t border-[var(--border)] py-10 first:border-t-0 first:pt-0 md:py-12"
            >
              <h2 id={`${s.id}-title`} className="flex items-baseline gap-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] text-[var(--heading)]">
                <span className="font-mono text-[13px] text-[var(--text-faint)]" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <div className="mt-6 text-[17px] leading-[1.75] text-[var(--text-dim)] [&_a]:text-[var(--heading)] [&_a]:underline [&_a]:underline-offset-4 [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-sans [&_h3]:text-lg [&_h3]:text-white [&_p+p]:mt-4 [&_strong]:font-normal [&_strong]:text-white">
                {s.content}
              </div>
            </motion.section>
          ))}

          <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-10 sm:flex-row sm:items-center">
            <a href={`mailto:${CONTACT.email}`} className="btn-cinema justify-center">
              Email {CONTACT.email}
            </a>
            <Link to={other.to} className="btn-ghost justify-center">
              Read the {other.label.toLowerCase()} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
