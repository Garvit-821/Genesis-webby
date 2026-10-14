import React, { Suspense, lazy, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageShell, PageHero } from "@widgets/layout";
import ErrorBoundary from "@shared/ui/ErrorBoundary";
import { GALLERY_PHOTOS } from "@shared/data/mediaAssets";
import { BRAND, DELHI, PUNE, SITE_URL } from "@shared/config/site";
import { Reveal, SplitText } from "@shared/motion";
import useDialog from "@pages/events/components/useDialog";
import PhotoGrid from "./PhotoGrid";
import Lightbox from "./Lightbox";

// three.js loads with the field only.
const InfiniteGallery = lazy(() => import("@features/infinite-gallery/InfiniteGallery"));

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: `Photos from ${PUNE.name}`,
  url: `${SITE_URL}/gallery`,
  publisher: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
  image: GALLERY_PHOTOS.map((p) => ({
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${p.src}`,
    caption: p.alt,
  })),
};

function Field({ mode }) {
  return (
    <ErrorBoundary
      compact
      title="The photo field could not start."
      fallback={() => (
        <div className="flex h-full items-center justify-center p-6 text-center text-white/75">
          The interactive field needs WebGL. Every photo is listed below.
        </div>
      )}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center font-mono text-[12px] uppercase tracking-[0.16em] text-white/60">
            Loading photos
          </div>
        }
      >
        <InfiniteGallery mode={mode} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Immersive({ onClose }) {
  const ref = useRef(null);
  useDialog(ref, onClose);
  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen photo field"
      tabIndex={-1}
      initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(50% 0% 50% 0%)" }}
      transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
      className="fixed inset-0 z-[300] bg-[#141414] focus:outline-none"
    >
      <Field mode="immersive" />
      <button
        type="button"
        onClick={onClose}
        data-autofocus
        className="absolute right-4 top-4 z-20 inline-flex h-11 items-center gap-2 border border-white/30 bg-black/60 px-4 font-mono text-[12px] uppercase tracking-[0.16em] text-white backdrop-blur hover:border-[var(--heading)]"
      >
        Close <span aria-hidden>✕</span>
      </button>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [immersive, setImmersive] = useState(false);
  const [open, setOpen] = useState(null);

  return (
    <PageShell seo={{ jsonLd: JSON_LD }}>
      <PageHero
        eyebrow={`${PUNE.name} · ${PUNE.when}`}
        title="Gallery"
        intro={`${GALLERY_PHOTOS.length} photos from ${PUNE.name} at ${PUNE.shortWhere}. Drag the field to explore, or scroll for every frame with captions.`}
      />

      <section aria-label="Interactive photo field" className="px-5 md:px-12">
        <div className="relative mx-auto h-[72vh] min-h-[460px] max-w-[90rem] overflow-hidden border border-white/10">
          <p className="sr-only">An interactive field of the same photos listed below. Drag to move around it.</p>
          {!immersive ? <Field mode="embedded" /> : null}
          <button
            type="button"
            onClick={() => setImmersive(true)}
            className="absolute right-3 top-3 z-20 inline-flex h-11 items-center gap-2 border border-white/30 bg-black/60 px-4 font-mono text-[12px] uppercase tracking-[0.16em] text-white backdrop-blur transition-colors hover:border-[var(--heading)] hover:text-[var(--heading)]"
            data-cursor
            data-cursor-label="Expand"
          >
            Full screen <span aria-hidden>↗</span>
          </button>
        </div>
      </section>

      <section aria-labelledby="every-frame" className="mx-auto max-w-[90rem] px-5 py-20 md:px-12 md:py-28">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SplitText
            as="h2"
            id="every-frame"
            text="Every frame"
            className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] text-[var(--heading)]"
          />
          <p className="max-w-[44ch] text-base text-white/75">
            Shot across both days at {PUNE.shortWhere}. Select any photo to see it larger.
          </p>
        </div>
        <PhotoGrid photos={GALLERY_PHOTOS} onOpen={(i) => setOpen(i)} />
      </section>

      <section aria-label="More" className="mx-auto grid max-w-[90rem] gap-5 px-5 pb-24 md:grid-cols-2 md:px-12 md:pb-32">
        <Reveal>
          <Link to={PUNE.path} className="group flex h-full min-h-[180px] flex-col justify-between border border-white/15 p-6 transition-colors hover:border-[var(--heading)] md:p-8">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/65">Recap</span>
            <span className="mt-6 flex items-end justify-between gap-4">
              <span className="font-display text-3xl leading-none text-white">{PUNE.name}</span>
              <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.08}>
          <Link to={DELHI.path} className="group flex h-full min-h-[180px] flex-col justify-between bg-[var(--heading)] p-6 text-[#181818] md:p-8">
            <span className="font-mono text-[12px] uppercase tracking-[0.16em]">Next up</span>
            <span className="mt-6 flex items-end justify-between gap-4">
              <span className="font-display text-3xl leading-none">
                {DELHI.name} {DELHI.edition}
              </span>
              <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Reveal>
      </section>

      <AnimatePresence>{immersive ? <Immersive key="immersive" onClose={() => setImmersive(false)} /> : null}</AnimatePresence>
      <AnimatePresence>
        {open !== null ? (
          <Lightbox key="lightbox" photos={GALLERY_PHOTOS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
        ) : null}
      </AnimatePresence>
    </PageShell>
  );
}
