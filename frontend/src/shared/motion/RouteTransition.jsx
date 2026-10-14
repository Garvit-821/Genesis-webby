import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "@shared/hooks/useAnimationLifecycle";
import ROUTES from "@shared/config/routes.json";

const COLS = 14;
const ROWS = 9;
const DURATION_MS = 900;

function labelFor(pathname) {
  const meta = ROUTES[pathname];
  if (pathname === "/") return "Genesis";
  if (meta?.h1) return meta.h1;
  return pathname.replace(/^\//, "").split("/").pop().replace(/-/g, " ");
}

/**
 * Pixel-dissolve between routes, in the Gridular pixel spirit.
 * The new page renders immediately underneath; the tiles only clear away,
 * so navigation is never delayed. Skipped with reduced motion.
 */
export default function RouteTransition() {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    if (prefersReducedMotion()) return undefined;
    setRun((n) => n + 1);
    const t = setTimeout(() => setRun(0), DURATION_MS + 200);
    return () => clearTimeout(t);
  }, [pathname]);

  // Fresh random order per run so the dissolve never repeats exactly.
  const delays = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS;
        const sweep = (col / COLS) * 260;
        return Math.round(sweep + Math.random() * 360);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run],
  );

  if (!run) return null;

  return (
    <div
      key={run}
      aria-hidden="true"
      className="route-pixels pointer-events-none fixed inset-0 z-[1500] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {delays.map((d, i) => (
        <span
          key={i}
          className="route-pixel"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
      <span className="route-pixels__label font-display">{labelFor(pathname)}</span>
    </div>
  );
}
