import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "framer-motion";
import { EASE_OUT, useFinePointer } from "@shared/motion";

const AEONIK = '"Aeonik", sans-serif';
const GRIDULAR = '"Gridular", sans-serif';
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const AUDIENCES = ["student builders", "hackers", "designers", "founders"];
const LENS_RADIUS = 120;

/**
 * Letters that decode from pixel noise, then react to the pointer: any
 * letter inside the "lens" swaps from Aeonik to the Gridular pixel face.
 * Styles are written straight to the DOM in rAF, so moving the mouse never
 * re-renders React.
 */
function DecodeLine({ text, ready, delay, register, className = "" }) {
  const [shown, setShown] = useState(() => text.split("").map(() => " "));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ready) return undefined;
    if (reduce) {
      setShown(text.split(""));
      return undefined;
    }
    const chars = text.split("");
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now) => {
      const t = (now - start) / 900;
      setShown(
        chars.map((ch, i) => {
          if (ch === " ") return " ";
          const local = t * chars.length * 1.4 - i;
          if (local >= 1) return ch;
          if (local <= -2) return " ";
          return GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }),
      );
      if (t < 1.6) raf = requestAnimationFrame(tick);
      else setShown(chars);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, text, delay, reduce]);

  return (
    <span aria-hidden className={`inline-block whitespace-nowrap ${className}`}>
      {shown.map((ch, i) => {
        const settled = ch === text[i];
        return (
          <span
            key={i}
            ref={register}
            className="kinetic-char inline-block"
            style={{
              fontFamily: settled ? AEONIK : GRIDULAR,
              opacity: ch === " " && text[i] !== " " ? 0 : 1,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );
}

/** Slot-machine roll through the audiences sponsors can reach. */
function AudienceRoller({ ready }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!ready || reduce) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % AUDIENCES.length), 2600);
    return () => clearInterval(id);
  }, [ready, reduce]);

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.6, ease: EASE_OUT } }}
      aria-hidden
      className="relative inline-block h-[1.06em] overflow-hidden align-bottom"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={AUDIENCES[i]}
          initial={{ y: "105%", rotateX: -70, opacity: 0 }}
          animate={ready ? { y: "0%", rotateX: 0, opacity: 1 } : { y: "105%", opacity: 0 }}
          exit={{ y: "-105%", rotateX: 70, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: ready && i === 0 ? 0.55 : 0 }}
          className="hero-roller block whitespace-nowrap"
          style={{ fontFamily: GRIDULAR, transformOrigin: "50% 50% -0.5em" }}
        >
          {AUDIENCES[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export default function KineticHeadline({ ready, scrollYProgress, id }) {
  const wrapRef = useRef(null);
  const charsRef = useRef([]);
  const lens = useFinePointer();
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const register = (el) => {
    if (el && !charsRef.current.includes(el)) charsRef.current.push(el);
  };

  useEffect(() => {
    if (!lens) return undefined;
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const paint = () => {
      raf = 0;
      charsRef.current = charsRef.current.filter((el) => el.isConnected);
      for (const el of charsRef.current) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
        const on = d < LENS_RADIUS;
        el.dataset.lens = on ? "on" : "off";
        // Pull letters slightly toward the pointer inside the lens.
        const pull = on ? (1 - d / LENS_RADIUS) * -10 : 0;
        el.style.transform = `translateY(${pull}px)`;
      }
    };
    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const node = wrapRef.current?.closest("section") || window;
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [lens]);

  return (
    <h1
      id={id}
      ref={wrapRef}
      className="kinetic-headline mt-5 font-display text-[clamp(2.2rem,4.6vw,5.2rem)] leading-[1] tracking-[-0.01em] text-[var(--heading)]"
    >
      <span className="sr-only">Reach India&apos;s student builders at hackathons.</span>
      <motion.span style={{ x: x1 }} className="block">
        <DecodeLine text="Reach India's" ready={ready} delay={350} register={register} />{" "}
        <AudienceRoller ready={ready} />
      </motion.span>
      <motion.span style={{ x: x3 }} className="block">
        <span className="relative inline-block">
          <DecodeLine text="at hackathons." ready={ready} delay={650} register={register} />
          <motion.span
            aria-hidden
            initial={{ opacity: 0, rotate: -14, scale: 0.8 }}
            animate={ready ? { opacity: 1, rotate: -8, scale: 1 } : undefined}
            transition={{ duration: 0.9, delay: 1.5, ease: EASE_OUT }}
            className="pointer-events-none absolute -bottom-[0.6em] -right-[1em] normal-case leading-none text-[hsl(285_85%_80%)]"
            style={{ fontFamily: '"Leirtag Aquelli", cursive', fontSize: "0.6em", textShadow: "0 0 22px rgba(10,4,40,0.9)" }}
          >
            together
          </motion.span>
        </span>
      </motion.span>
    </h1>
  );
}
