import React, { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@shared/motion";
import useDialog from "@pages/events/components/useDialog";

/** Single-layer photo viewer: Esc closes, arrows move, focus returns (audit V04). */
export default function Lightbox({ photos, index, onIndex, onClose }) {
  const ref = useRef(null);
  const startX = useRef(null);
  useDialog(ref, onClose);
  const photo = photos[index];
  const go = useCallback((step) => onIndex((index + step + photos.length) % photos.length), [index, onIndex, photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[300] bg-black/95"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.caption}`}
        tabIndex={-1}
        className="flex h-full flex-col focus:outline-none"
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-8">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/75">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="inline-flex h-11 min-w-[44px] items-center gap-2 px-3 font-mono text-[12px] uppercase tracking-[0.16em] text-white hover:text-[var(--heading)]"
          >
            Close <span aria-hidden>✕</span>
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-20">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              initial={{ opacity: 0, scale: 0.96, clipPath: "inset(0% 50% 0% 50%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="max-h-[72svh] w-auto max-w-full object-contain"
              draggable={false}
            />
          </AnimatePresence>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white hover:border-[var(--heading)] hover:text-[var(--heading)] md:flex"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 text-white hover:border-[var(--heading)] hover:text-[var(--heading)] md:flex"
          >
            →
          </button>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-6 pt-4 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="font-display text-2xl text-[var(--heading)]">{photo.caption}</p>
            <p className="mt-1 max-w-[70ch] text-[15px] text-white/75">{photo.alt}</p>
          </div>
          <div className="flex gap-2 md:hidden">
            <button type="button" onClick={() => go(-1)} className="btn-ghost flex-1 justify-center">
              Previous
            </button>
            <button type="button" onClick={() => go(1)} className="btn-ghost flex-1 justify-center">
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
