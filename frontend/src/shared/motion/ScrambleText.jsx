import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { prefersReducedMotion } from "@shared/hooks/useAnimationLifecycle";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

/**
 * Text that decodes from random glyphs into place, terminal style.
 * Plays once on view (or whenever `active` flips true). The final text is
 * always in the DOM for screen readers via aria-label.
 */
export default function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  duration = 900,
  delay = 0,
  active,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const trigger = active ?? inView;
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frame.current);
    if (!trigger || prefersReducedMotion()) {
      setDisplay(text);
      return undefined;
    }
    const chars = String(text).split("");
    let start = 0;
    const tick = (now) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const settled = Math.floor(t * chars.length);
      setDisplay(
        chars
          .map((ch, i) => {
            if (ch === " " || i < settled) return ch;
            return GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join(""),
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [trigger, text, duration, delay]);

  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
