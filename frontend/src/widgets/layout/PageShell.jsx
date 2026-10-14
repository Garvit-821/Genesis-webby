import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useLenis from "@shared/hooks/useLenis";
import useSeo from "@shared/seo/useSeo";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cursor from "./Cursor";

/**
 * Chrome for every route: header, custom cursor, smooth scroll, per-route
 * SEO tags and footer. Pages pass `seo` overrides (JSON-LD, title) when
 * they need more than the defaults in routes.json. `extras` renders fixed
 * chrome (intro curtain, chapter rail) outside <main>.
 */
export default function PageShell({
  children,
  seo,
  extras = null,
  footer = true,
  className = "",
  mainClassName = "",
}) {
  useLenis();
  useSeo(seo);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className={`App grain relative min-h-[100svh] bg-[var(--bg)] text-[var(--text)] ${className}`}>
      <Cursor />
      <Navbar />
      {extras}
      <main id="main" tabIndex={-1} className={`relative focus:outline-none ${mainClassName}`}>
        {children}
      </main>
      {footer ? <Footer /> : null}
    </div>
  );
}
