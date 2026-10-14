import React, { useEffect, useState } from "react";

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Go through Lenis when it is running; a plain scrollTo is ignored under it.
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -120, duration: 1.1 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function GuideToc({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.length) return undefined;
    const onScroll = () => {
      const pos = window.scrollY + 160;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= pos) {
          setActiveId(sections[i].id);
          return;
        }
      }
      setActiveId(sections[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav aria-label="On this page" className="sticky top-32 hidden w-64 shrink-0 self-start space-y-3 border-l border-white/10 px-4 py-2 lg:block">
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">On this page</p>
      <ul className="space-y-1">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollToSection(sec.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={`block min-h-[32px] py-1 text-[14px] leading-snug transition-colors ${
                  isActive ? "border-l-2 border-[var(--heading)] pl-2 text-[var(--heading)]" : "text-white/65 hover:text-white"
                }`}
              >
                {sec.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
