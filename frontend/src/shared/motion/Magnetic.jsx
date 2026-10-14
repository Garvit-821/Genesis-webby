import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "./useMediaQuery";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Inert on touch screens and with reduced motion.
 */
export default function Magnetic({
  strength = 0.35,
  className = "",
  children,
  as = "span",
}) {
  const ref = useRef(null);
  const enabled = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const Component = motion[as] || motion.span;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={enabled ? { x: sx, y: sy } : undefined}
      className={`inline-flex ${className}`}
    >
      {children}
    </Component>
  );
}
