import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ROUTES from "@shared/config/routes.json";
import { BRAND, SITE_URL } from "@shared/config/site";

const DEFAULT_IMAGE = `${SITE_URL}/images/og-genesis.jpg`;

/** The route the static HTML was prerendered for (the first one loaded). */
const PRERENDERED_PATH =
  typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") || "/" : "/";

function upsertMeta(attr, key, content) {
  if (content == null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  const el = existing || document.createElement("script");
  el.id = id;
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(el);
}

/** Route metadata for a path, falling back to the home entry. */
export function getRouteMeta(path) {
  return ROUTES[path] || null;
}

/**
 * Per-route title, description, canonical, Open Graph and JSON-LD.
 * The build-time prerender writes the same values into static HTML, so
 * crawlers that skip JavaScript still see them (audit SE01, SE02).
 */
export default function useSeo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  jsonLd = null,
  noindex = false,
} = {}) {
  const location = useLocation();
  const resolvedPath = (path ?? location.pathname).replace(/\/+$/, "") || "/";
  const meta = getRouteMeta(resolvedPath);
  const finalTitle = title || meta?.title || `${BRAND.name}`;
  const finalDescription =
    description || meta?.description || BRAND.shortDescription;
  const canonical = `${SITE_URL}${resolvedPath === "/" ? "/" : resolvedPath}`;
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = finalTitle;
    upsertMeta("name", "description", finalDescription);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", finalDescription);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", finalTitle);
    upsertMeta("name", "twitter:description", finalDescription);
    upsertMeta("name", "twitter:image", image);
    if (noindex) {
      document.head.querySelector('link[rel="canonical"]')?.remove();
    } else {
      upsertLink("canonical", canonical);
    }
    // The prerender writes route JSON-LD into #prerender-jsonld. Drop it when
    // the page supplies its own (no duplicates) or after navigating away
    // from the prerendered route (no stale data).
    if (jsonLdKey || resolvedPath !== PRERENDERED_PATH) {
      document.getElementById("prerender-jsonld")?.remove();
    }
    setJsonLd("page-jsonld", jsonLdKey ? JSON.parse(jsonLdKey) : null);
  }, [finalTitle, finalDescription, canonical, image, noindex, jsonLdKey, resolvedPath]);
}
