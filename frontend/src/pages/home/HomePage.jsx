import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@shared/styles/shell.css";

import {
  Intro,
  Cursor,
  ChapterRail,
  Navbar,
  Marquee,
  ScribbleDivider,
  Footer,
} from "@widgets/layout";

import { Hero } from "@features/hero";
import { About } from "@features/about";
import { TheLoop } from "@features/the-loop";
import { Events } from "@features/events-showcase";
import { Contact } from "@features/contact";
import useLenis from "@shared/hooks/useLenis";

/**
 * Marketing landing — chrome + feature sections.
 * Smooth scroll (Lenis) and hash deep-links live here.
 */
export default function HomePage() {
  useLenis();
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;

      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -60, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  return (
    <div className="App grain dark">
      <Intro />
      <Cursor />
      <ChapterRail />
      <Navbar />
      <main className="relative">
        <Hero />
        <Marquee />
        <About />
        <TheLoop />
        {/* Light band after The Loop — Events + Contact. Footer stays dark. */}
        <div
          className="bg-white text-[#181818]"
          style={{
            ["--bg"]: "#ffffff",
            ["--bg-2"]: "#f4f4f4",
            ["--surface"]: "rgba(0,0,0,0.03)",
            ["--surface-2"]: "rgba(0,0,0,0.06)",
            ["--border"]: "rgba(0,0,0,0.12)",
            ["--border-strong"]: "rgba(0,0,0,0.28)",
            ["--text"]: "#181818",
            ["--text-dim"]: "rgba(24,24,24,0.68)",
            ["--text-faint"]: "rgba(24,24,24,0.42)",
            ["--heading"]: "#181818",
            ["--brand"]: "#6d28d9",
          }}
        >
          <ScribbleDivider variant="arrow" />
          <Events />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
