import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { eventSummary } from "@shared/data/events";
import { EASE_OUT } from "@shared/motion";
import EventPoster from "./EventPoster";
import RoleBadge from "./RoleBadge";
import useDialog from "./useDialog";

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div className="border-t border-white/10 py-3">
      <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/60">{label}</dt>
      <dd className="mt-1 text-[15px] text-white">{children}</dd>
    </div>
  );
}

/**
 * Event details. One dialog layer only; no lightbox underneath (audit V04).
 * Shows facts from the archive row, never raw links or record ids (V05).
 */
export function ArchiveModal({ event, onClose }) {
  const ref = useRef(null);
  const [photo, setPhoto] = useState(0);
  useDialog(ref, onClose);
  const titleId = `event-dialog-${event.id}`;
  const photos = event.photos || [];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ y: 60, opacity: 0, clipPath: "inset(12% 0% 0% 0%)" }}
        animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto border border-white/15 bg-[#121214] focus:outline-none md:grid-cols-2"
      >
        <div className="relative aspect-[4/5] w-full md:aspect-auto md:min-h-[520px]">
          <EventPoster event={event} className="absolute inset-0" size="large" photoIndex={photo} showText={!photos.length} loading="eager" />
          {photos.length > 1 ? (
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-4">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setPhoto(i)}
                  aria-label={`Show photo ${i + 1} of ${photos.length}: ${p.caption}`}
                  aria-pressed={photo === i}
                  className={`h-11 w-11 overflow-hidden border transition-colors ${photo === i ? "border-[var(--heading)]" : "border-white/30 hover:border-white/70"}`}
                >
                  <img src={p.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <RoleBadge role={event.role} />
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              className="-mr-2 -mt-2 inline-flex h-11 min-w-[44px] items-center justify-center gap-2 px-3 font-mono text-[12px] uppercase tracking-[0.16em] text-white/80 hover:text-white"
            >
              Close <span aria-hidden>✕</span>
            </button>
          </div>

          <h2 id={titleId} className="mt-6 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] text-[var(--heading)]">
            {event.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">{eventSummary(event)}</p>
          {photos[photo] ? (
            <p className="mt-2 text-sm text-white/60">Photo: {photos[photo].caption}</p>
          ) : null}

          <dl className="mt-8">
            <Fact label="Date">{event.date}</Fact>
            <Fact label="Venue">{event.venue}</Fact>
            <Fact label="City">{event.cities.join(", ")}</Fact>
            <Fact label="Format">{event.category}</Fact>
            <Fact label="Genesis role">{event.role}</Fact>
            <Fact label="Attendance">{event.attendees ? event.attendees.toLocaleString("en-IN") : null}</Fact>
          </dl>

          {event.path ? (
            <div className="mt-auto pt-8">
              <Link to={event.path} className="btn-cinema">
                {event.status === "upcoming" ? "See the event" : "Read the recap"} <span aria-hidden>→</span>
              </Link>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ArchiveModal;
