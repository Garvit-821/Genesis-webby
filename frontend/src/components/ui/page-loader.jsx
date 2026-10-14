import React from "react";

const WORD = "GENESIS".split("");
const PIXELS = 12;

/**
 * Route fallback: the GENESIS wordmark builds itself pixel by pixel while a
 * stepped lime bar fills underneath. Announced once to screen readers; all
 * motion stops with reduced motion.
 */
export default function PageLoader({ label = "Loading page" }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-8">
      <style>{PAGE_LOADER_CSS}</style>

      <div aria-hidden className="flex gap-[0.08em] font-display text-5xl leading-none sm:text-6xl">
        {WORD.map((ch, i) => (
          <span key={i} className="page-loader-cell" style={{ "--i": i }}>
            <span className="page-loader-letter">{ch}</span>
            <span className="page-loader-pixel" />
          </span>
        ))}
      </div>

      <div aria-hidden className="flex gap-[3px]">
        {Array.from({ length: PIXELS }).map((_, i) => (
          <span key={i} className="page-loader-step" style={{ "--i": i }} />
        ))}
      </div>

      <span aria-hidden className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/60">
        Loading
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

const PAGE_LOADER_CSS = `
  .page-loader-cell {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  .page-loader-letter {
    display: inline-block;
    color: var(--heading, #e2efba);
    clip-path: inset(0 100% 0 0);
    animation: page-loader-build 1.6s steps(5, end) infinite;
    animation-delay: calc(var(--i) * 90ms);
  }
  .page-loader-pixel {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0.22em;
    left: 0;
    background: var(--heading, #e2efba);
    animation: page-loader-scan 1.6s steps(5, end) infinite;
    animation-delay: calc(var(--i) * 90ms);
  }
  @keyframes page-loader-build {
    0% { clip-path: inset(0 100% 0 0); }
    45%, 80% { clip-path: inset(0 0 0 0); }
    100% { clip-path: inset(0 0 0 100%); }
  }
  @keyframes page-loader-scan {
    0% { transform: translateX(0); opacity: 1; }
    45% { transform: translateX(400%); opacity: 1; }
    46%, 100% { opacity: 0; }
  }

  .page-loader-step {
    width: 10px;
    height: 10px;
    background: rgba(226, 239, 186, 0.14);
    animation: page-loader-fill 1.6s steps(1, end) infinite;
    animation-delay: calc(var(--i) * 110ms);
  }
  @keyframes page-loader-fill {
    0% { background: rgba(226, 239, 186, 0.14); }
    10%, 60% { background: var(--heading, #e2efba); }
    70%, 100% { background: rgba(226, 239, 186, 0.14); }
  }

  @media (prefers-reduced-motion: reduce) {
    .page-loader-letter, .page-loader-pixel, .page-loader-step { animation: none; }
    .page-loader-letter { clip-path: none; }
    .page-loader-pixel { display: none; }
    .page-loader-step { background: var(--heading, #e2efba); }
  }
`;
