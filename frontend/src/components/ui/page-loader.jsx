import React from 'react';

const WORD = 'GENESIS'.split('');

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center gap-7">
      <style>{PAGE_LOADER_CSS}</style>

      {/* Wordmark framed by viewfinder corners that pulse like a lens finding focus */}
      <div className="relative px-9 py-7 sm:px-12 sm:py-9">
        <span className="page-loader-corner page-loader-corner--tl" />
        <span className="page-loader-corner page-loader-corner--tr" />
        <span className="page-loader-corner page-loader-corner--bl" />
        <span className="page-loader-corner page-loader-corner--br" />

        <div aria-hidden className="flex font-display text-4xl sm:text-5xl leading-none tracking-tight">
          {WORD.map((ch, i) => (
            <span key={i} className="page-loader-letter" style={{ animationDelay: `${i * 90}ms` }}>
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="page-loader-track" aria-hidden>
        <span className="page-loader-bar" />
      </div>

      <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
        Loading
      </span>
      <span className="sr-only">Loading page</span>
    </div>
  );
}

const PAGE_LOADER_CSS = `
  .page-loader-letter {
    display: inline-block;
    color: var(--heading);
    opacity: 0.2;
    animation: page-loader-wave 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }
  @keyframes page-loader-wave {
    0%, 55%, 100% { opacity: 0.2; transform: translateY(0); color: var(--heading); }
    20% { opacity: 1; transform: translateY(-0.12em); color: var(--brand); }
  }

  .page-loader-corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 0 solid var(--brand);
    animation: page-loader-focus 1.8s ease-in-out infinite;
  }
  .page-loader-corner--tl { top: 0; left: 0; border-top-width: 1.5px; border-left-width: 1.5px; --dx: -6px; --dy: -6px; }
  .page-loader-corner--tr { top: 0; right: 0; border-top-width: 1.5px; border-right-width: 1.5px; --dx: 6px; --dy: -6px; }
  .page-loader-corner--bl { bottom: 0; left: 0; border-bottom-width: 1.5px; border-left-width: 1.5px; --dx: -6px; --dy: 6px; }
  .page-loader-corner--br { bottom: 0; right: 0; border-bottom-width: 1.5px; border-right-width: 1.5px; --dx: 6px; --dy: 6px; }
  @keyframes page-loader-focus {
    0%, 100% { transform: translate(0, 0); opacity: 1; }
    50% { transform: translate(var(--dx), var(--dy)); opacity: 0.45; }
  }

  .page-loader-track {
    position: relative;
    width: 180px;
    height: 1px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
  }
  .page-loader-bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, var(--brand), var(--heading));
    animation: page-loader-sweep 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
  @keyframes page-loader-sweep {
    from { transform: translateX(-100%); }
    to { transform: translateX(250%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .page-loader-letter, .page-loader-corner, .page-loader-bar { animation: none; }
    .page-loader-letter { opacity: 1; }
    .page-loader-bar { width: 100%; }
  }
`;
