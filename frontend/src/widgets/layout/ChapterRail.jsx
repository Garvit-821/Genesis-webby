import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HOME_CHAPTERS } from "@shared/config/site";

/**
 * Right-edge chapter index for the home page. Numbers and labels come from
 * HOME_CHAPTERS, the same list the sections use, so they always match
 * (audit C14). Hides at the top of the page and over the footer (V07).
 */
export default function ChapterRail() {
  const [active, setActive] = useState("hero");
  const [nearTop, setNearTop] = useState(true);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const observers = [];
    HOME_CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(c.id);
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });

    const footer = document.getElementById("site-footer");
    if (footer) {
      const io = new IntersectionObserver(
        ([entry]) => setOverFooter(entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(footer);
      observers.push(io);
    }

    const onScroll = () => setNearTop(window.scrollY < 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const hidden = nearTop || overFooter;

  return (
    <motion.nav
      aria-label="Page sections"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: hidden ? 0 : 1, x: hidden ? 20 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 mix-blend-difference lg:flex ${hidden ? "pointer-events-none" : ""}`}
    >
      {HOME_CHAPTERS.map((c) => {
        const isActive = active === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={isActive ? "true" : undefined}
            tabIndex={hidden ? -1 : 0}
            className="group flex min-h-[28px] items-center justify-end gap-3"
            data-cursor
          >
            {/* Label shows on hover/focus only, so it never sits on top of content. */}
            <span className="pointer-events-none translate-x-2 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
              {c.label}
            </span>
            <span className="font-mono text-[12px] tracking-[0.18em] text-[var(--text-faint)] transition-colors group-hover:text-[var(--text)]">
              {c.n}
            </span>
            <motion.span
              animate={{
                width: isActive ? 28 : 14,
                backgroundColor: isActive ? "rgb(226,239,186)" : "rgb(90,90,96)",
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px"
            />
          </a>
        );
      })}
    </motion.nav>
  );
}
