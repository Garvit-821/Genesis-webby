import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll to an element by id, through Lenis when it is running. */
export function scrollToId(id, offset = -110) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
  return true;
}

/**
 * Honour #hash links on pages that render forms lower down (for example
 * /partner?event=hackers-occupied-delhi#partner-form). PageShell skips its
 * scroll-to-top when a hash is present; this does the jump once the page
 * has painted.
 */
export default function useHashScroll() {
  const { hash, search } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => scrollToId(id), 120);
    return () => window.clearTimeout(t);
  }, [hash, search]);
}
