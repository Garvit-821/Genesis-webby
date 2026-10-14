import React from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "@shared/motion";

/**
 * Every photo as a real <img> with alt text and a caption: the version of
 * the gallery that search engines and screen readers get (audit A09).
 * Every fifth frame runs wide for an editorial rhythm.
 */
export default function PhotoGrid({ photos, onOpen }) {
  return (
    <ul className="grid grid-flow-dense grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((p, i) => {
        const wide = i % 5 === 0;
        return (
          <motion.li
            key={p.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: (i % 3) * 0.07, ease: EASE_OUT }}
            className={wide ? "sm:col-span-2" : ""}
          >
            <figure>
              <button
                type="button"
                onClick={(e) => onOpen(i, e.currentTarget)}
                className="group relative block w-full overflow-hidden bg-[#121214]"
                aria-label={`Open photo: ${p.caption}`}
                data-cursor
                data-cursor-label="View"
              >
                <motion.span
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1.1, delay: (i % 3) * 0.07, ease: EASE_OUT }}
                  className="block"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                    className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </motion.span>
                <span
                  aria-hidden
                  className="absolute right-3 top-3 bg-black/70 px-2 py-1 font-mono text-[12px] tracking-[0.14em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  View ↗
                </span>
              </button>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-display text-xl text-[var(--heading)]">{p.caption}</span>
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/60">{p.meta}</span>
              </figcaption>
            </figure>
          </motion.li>
        );
      })}
    </ul>
  );
}
