import React, { useId, useMemo } from "react";
import "../events.css";

/**
 * Typographic poster for an event. Events with real photos show the first
 * photo; every other event gets a pixel-grid pattern seeded by its id, so a
 * card never borrows a stock photo (audit C10, T01) and the same event
 * always looks the same.
 */

export const CATEGORY_ACCENT = {
  Hackathon: "#e2efba",
  Meetup: "#c4b5fd",
  Workshop: "#e2a1f7",
  Bootcamp: "#7dd3fc",
  Ideathon: "#86efac",
};

const COLS = 8;
const ROWS = 10;

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mirrored pixel pattern, like an identicon scaled up to poster size. */
function buildCells(seedKey) {
  const rand = mulberry32(hashString(seedKey));
  const half = COLS / 2;
  const cells = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < half; x += 1) {
      const r = rand();
      if (r < 0.44) {
        const kind = r < 0.07 ? "outline" : "solid";
        const shade = 0.55 + rand() * 0.45;
        cells.push({ x, y, kind, shade });
        cells.push({ x: COLS - 1 - x, y, kind, shade });
      }
    }
  }
  return cells;
}

export function posterAccent(event) {
  return CATEGORY_ACCENT[event?.category] || "#e2efba";
}

export default function EventPoster({
  event,
  className = "",
  showText = true,
  size = "card",
  usePhoto = true,
  photoIndex = 0,
  loading = "lazy",
}) {
  const accent = posterAccent(event);
  const patternId = `poster-grid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const cells = useMemo(() => buildCells(event?.id || "genesis"), [event?.id]);
  const photo = usePhoto ? event?.photos?.[photoIndex] : null;
  const titleSize =
    size === "large"
      ? "text-[clamp(2rem,5vw,3.6rem)]"
      : size === "thumb"
        ? "text-[1.15rem]"
        : "text-[clamp(1.35rem,2.2vw,1.9rem)]";

  return (
    <div
      className={`event-poster group/poster relative isolate overflow-hidden bg-[#121214] ${className}`}
      style={{ "--poster-accent": accent }}
    >
      {photo ? (
        <>
          <img
            src={photo.src}
            alt={photo.alt}
            loading={loading}
            decoding="async"
            width="1280"
            height="853"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/poster:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        </>
      ) : (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="xMidYMid slice"
          className="event-poster__pixels absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern id={patternId} width="1" height="1" patternUnits="userSpaceOnUse">
              <path d="M1 0H0V1" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.03" />
            </pattern>
          </defs>
          <rect width={COLS} height={ROWS} fill={`url(#${patternId})`} />
          {cells.map((c, i) =>
            c.kind === "solid" ? (
              <rect
                key={i}
                x={c.x + 0.06}
                y={c.y + 0.06}
                width="0.88"
                height="0.88"
                fill={accent}
                className="event-poster__cell"
                style={{ opacity: c.shade * 0.82, transitionDelay: `${(c.y * 22 + c.x * 9) % 260}ms` }}
              />
            ) : (
              <rect
                key={i}
                x={c.x + 0.2}
                y={c.y + 0.2}
                width="0.6"
                height="0.6"
                fill="none"
                stroke={accent}
                strokeWidth="0.06"
                style={{ opacity: c.shade }}
              />
            ),
          )}
        </svg>
      )}

      {/* Scanline veil keeps the CRT feel of the buttons */}
      <div aria-hidden className="event-poster__scan pointer-events-none absolute inset-0" />

      {showText ? (
        <div className="relative z-[1] flex h-full flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.14em]">
            <span className="bg-black/70 px-2 py-1 text-white">{event?.category}</span>
            {event?.year ? <span className="bg-black/70 px-2 py-1 text-white">{event.year}</span> : null}
          </div>
          <div>
            <p className={`font-display leading-[0.92] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.65)] ${titleSize}`}>
              {event?.title}
            </p>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-white/85">
              {event?.city}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
