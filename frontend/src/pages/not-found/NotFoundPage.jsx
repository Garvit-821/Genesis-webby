import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PageShell } from "@widgets/layout";
import { DELHI } from "@shared/config/site";
import { EASE_OUT, Magnetic, ScrambleText } from "@shared/motion";

const LINKS = [
  { to: DELHI.path, label: `${DELHI.name} ${DELHI.edition}`, note: "Our next event" },
  { to: "/partner", label: "Sponsor an event", note: "For companies" },
  { to: "/events", label: "Events archive", note: "Everything we have run or partnered on" },
  { to: "/contact", label: "Contact", note: "Email, phone or the form" },
];

/**
 * Catch-all 404. Marked noindex here; the hosting config returns a real
 * 404 status for unknown paths (audit D05).
 */
export default function NotFoundPage() {
  const location = useLocation();
  const attempted = location.pathname + location.search;

  return (
    <PageShell seo={{ noindex: true, title: "Page not found | Genesis Hacks", description: "This page does not exist." }}>
      <section aria-labelledby="not-found-title" className="relative overflow-hidden px-5 pb-24 pt-40 md:px-12 md:pt-52">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden />
        <div className="relative mx-auto max-w-[90rem]">
          <p aria-hidden className="select-none font-display text-[clamp(7rem,30vw,26rem)] leading-[0.8] text-outline opacity-60">
            <ScrambleText text="404" duration={1100} />
          </p>
          <h1 id="not-found-title" className="mt-4 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] text-[var(--heading)]">
            Page not found.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-[var(--text-dim)]">
            Nothing lives at{" "}
            <code className="bg-white/[0.06] px-1.5 py-0.5 font-mono text-[15px] text-[var(--heading)]">{attempted}</code>. It may have moved,
            or the link has a typo.
          </p>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map((l, i) => (
              <motion.li
                key={l.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: EASE_OUT }}
              >
                <Link
                  to={l.to}
                  className="group flex min-h-[9rem] flex-col justify-between border border-[var(--border)] p-5 transition-colors hover:border-[var(--heading)]/60 hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{l.note}</span>
                  <span className="flex items-center justify-between gap-3 font-display text-2xl leading-tight text-[var(--heading)]">
                    {l.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-12">
            <Magnetic strength={0.25}>
              <Link to="/" className="btn-cinema">
                Back to home <span aria-hidden>→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
