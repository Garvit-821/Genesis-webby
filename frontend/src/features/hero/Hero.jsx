import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LANDING } from "@shared/constants/testIds";
import { useSectionScroll } from "@shared/hooks/useSectionScroll";
import ErrorBoundary from "@shared/ui/ErrorBoundary";
import CountUp from "@shared/ui/CountUp";
import { BRAND, DELHI, STATS } from "@shared/config/site";
import { EASE_OUT, Magnetic, ScrambleText, useMediaQuery } from "@shared/motion";
import KineticHeadline from "./KineticHeadline";

// three.js only downloads once the text has painted (audit F03, F04).
const HeroCanvas = lazy(() => import("./HeroCanvas"));

function useIdleMount(enabled, delay = 900) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled) return undefined;
    let idleId;
    const t = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      } else {
        setReady(true);
      }
    }, delay);
    return () => {
      window.clearTimeout(t);
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    };
  }, [enabled, delay]);
  return ready;
}

/** Floating "next up" ticket: the event we are selling right now. */
function DelhiTicket({ ready }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={ready ? { opacity: 1, y: 0, rotate: 0 } : undefined}
      transition={{ duration: 1, delay: 1.3, ease: EASE_OUT }}
      className="relative"
    >
      <Link
        to={DELHI.path}
        data-cursor
        data-cursor-label="Delhi"
        className="group pixel-corners relative block w-full max-w-[380px] bg-[var(--heading)] p-5 text-[#181818] transition-transform duration-500 hover:-translate-y-1"
      >
        <span className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.16em]">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-[#181818] opacity-60" />
              <span className="relative inline-flex h-2 w-2 bg-[#181818]" />
            </span>
            Next up
          </span>
          <span>{DELHI.edition}</span>
        </span>
        <span className="mt-4 block font-display text-[1.9rem] leading-[0.92] text-[#181818]">
          Hackers Occupied
          <br />
          Delhi
        </span>
        <span className="mt-4 grid grid-cols-2 gap-3 border-t border-[#181818]/25 pt-3 text-[13px] leading-snug">
          <span>
            <span className="block font-mono text-[12px] uppercase tracking-[0.12em] opacity-75">When</span>
            Mid-Jan 2027 (tentative)
          </span>
          <span>
            <span className="block font-mono text-[12px] uppercase tracking-[0.12em] opacity-75">Where</span>
            {DELHI.where}
          </span>
        </span>
        <span className="mt-4 flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em]">
          {DELHI.teams} teams · {DELHI.tracks.length} tracks
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function Hero({ ready = true }) {
  const ref = useRef(null);
  const go = (target) => (ready ? target : undefined);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const showModel = useIdleMount(isDesktop);

  const { scrollYProgress } = useSectionScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const modelY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Soft spotlight that trails the pointer.
  const mx = useMotionValue(70);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, rgba(226,239,186,0.10), transparent 60%)`,
  );

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      id="hero"
      ref={ref}
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="relative flex min-h-[var(--app-height)] flex-col overflow-hidden pt-36 md:pt-40 lg:pt-44"
    >
      <motion.div style={{ y: gridY }} aria-hidden className="hero-grid absolute inset-0 z-0 opacity-[0.16]" />
      <motion.div aria-hidden className="absolute inset-0 z-0" style={{ background: spotlight }} />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] left-1/2 z-0 hidden h-[80vh] w-[70vw] -translate-x-1/2 lg:block"
        style={{
          background:
            "radial-gradient(closest-side, hsl(285 85% 60% / 0.24), hsl(258 90% 66% / 0.08) 55%, transparent 75%)",
        }}
      />

      {/* Mascot: centred, rising from the bottom edge, below the headline. */}
      {showModel ? (
        // Outer div centres; inner motion div owns the scroll transform.
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[62vh] justify-center lg:flex xl:h-[68vh]">
          <motion.div style={{ y: modelY }} className="relative h-full w-[min(1100px,100%)]">
            <ErrorBoundary compact title="3D hero unavailable." fallback={() => null}>
              <Suspense fallback={null}>
                <HeroCanvas className="absolute inset-0" entryDelayMs={300} />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </div>
      ) : null}

      {/* Headline, centred above the mascot's head */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-[3] mx-auto w-full max-w-[90rem] px-5 text-center md:px-10"
      >
        <div className="flex items-center justify-center gap-3">
          <span className="block h-2 w-2 bg-[var(--heading)]" aria-hidden />
          <ScrambleText
            text="Hackathon partnerships · India"
            className="overline"
            delay={200}
            active={ready}
          />
        </div>
        <KineticHeadline id="hero-title" ready={ready} scrollYProgress={scrollYProgress} />
      </motion.div>

      <div className="flex-1" />

      {/* Corners: story + CTAs left, next event right. The middle stays the mascot's. */}
      <div className="relative z-[3] mx-auto mt-12 grid w-full max-w-[90rem] gap-10 px-5 pb-10 md:px-10 md:pb-14 lg:mt-0 lg:grid-cols-12 lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={go({ opacity: 1, y: 0 })}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE_OUT }}
          className="lg:col-span-4"
        >
          <p className="max-w-[40ch] text-base leading-relaxed text-[var(--text-dim)] md:text-lg">
            {BRAND.description}
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Events", STATS.events, "+"],
              ["Attendees", STATS.attendees, ""],
              ["Women", 35, "%"],
            ].map(([label, value, suffix]) => (
              <div key={label}>
                <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{label}</dt>
                <dd className="mt-1 font-display text-3xl text-white md:text-4xl">
                  <CountUp value={value} suffix={suffix} duration={2.2} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start xl:flex-row">
            <Magnetic strength={0.3}>
              <Link
                to="/partner"
                data-testid={LANDING.heroCtaPrimary}
                data-cursor
                data-cursor-label="Partner"
                className="btn-cinema w-full justify-center whitespace-nowrap sm:w-auto"
              >
                Partner with Genesis <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link
              to={DELHI.path}
              data-testid={LANDING.heroCtaSecondary}
              data-cursor
              data-cursor-label="Delhi"
              className="btn-ghost w-full justify-center whitespace-nowrap sm:w-auto xl:hidden"
            >
              Hackers Occupied Delhi {DELHI.edition}
            </Link>
          </div>
        </motion.div>

        <div className="lg:hidden xl:col-span-3 xl:col-start-10 xl:block xl:justify-self-end">
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-11 left-4 hidden -rotate-6 text-[2rem] leading-none text-[hsl(285_85%_82%)] xl:block"
              style={{ fontFamily: '"Leirtag Aquelli", cursive' }}
            >
              next stop, Delhi
            </span>
            <DelhiTicket ready={ready} />
          </div>
        </div>
      </div>
    </section>
  );
}
