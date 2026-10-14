import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "@shared/styles/shell.css";

import { Intro, ChapterRail, Marquee, PageShell } from "@widgets/layout";
import { Hero } from "@features/hero";
import SponsorsSection from "@features/home/SponsorsSection";
import ProofSection from "@features/home/ProofSection";
import SeriesSection from "@features/home/SeriesSection";
import { Events } from "@features/events-showcase";
import { Contact } from "@features/contact";

/**
 * Home: sponsor-first story.
 * Hero → brands → what sponsors get → proof → Hackers Occupied (Delhi 2027
 * up next, Pune recap) → events → contact. Hash deep-links (#series etc.)
 * scroll once the page has rendered.
 */
export default function HomePage() {
  const location = useLocation();
  // Hero choreography waits for the intro curtain (first visit per session).
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return undefined;
    const timeout = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -60, duration: 1.6 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  return (
    <PageShell
      className="dark"
      extras={
        <>
          <Intro onDone={() => setIntroDone(true)} />
          <ChapterRail />
        </>
      }
    >
      <Hero ready={introDone} />
      <Marquee />
      <SponsorsSection />
      <ProofSection />
      <SeriesSection />
      <Events />
      <Contact />
    </PageShell>
  );
}
