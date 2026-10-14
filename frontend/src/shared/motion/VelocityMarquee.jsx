import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "framer-motion";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Infinite marquee that speeds up, reverses and skews with scroll velocity.
 * The first copy carries the content for assistive tech; the repeats are
 * aria-hidden so screen readers hear each item once (audit A08).
 */
export default function VelocityMarquee({
  children,
  baseVelocity = -2,
  copies = 4,
  className = "",
  itemClassName = "",
  skew = true,
  label,
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll({ layoutEffect: false });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-100 / copies, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden ${className}`} role={label ? "region" : undefined} aria-label={label}>
      <motion.div
        className="flex w-max flex-nowrap whitespace-nowrap will-change-transform"
        style={{ x, skewX: skew && !reduce ? skewX : 0 }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 items-center ${itemClassName}`}
            aria-hidden={i > 0 ? "true" : undefined}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
