#!/usr/bin/env node
/* global process, console */
/**
 * Build-time prerender for crawlers, link previews and AI agents
 * (audit SE01, SE02, SE03, SE07, D04, D05, D06).
 *
 * Runs after `craco build`. For every route in src/shared/config/routes.json
 * (and every organiser-guide article) it writes a static HTML file with that
 * route's title, description, canonical, Open Graph tags and real text, plus
 * Event JSON-LD for the Hackers Occupied pages. React's createRoot replaces
 * the static #root content when the app boots, so visitors see the full app.
 *
 * Output follows Vercel's `cleanUrls`: /about -> build/about.html,
 * /events/hackers-occupied-delhi -> build/events/hackers-occupied-delhi.html.
 * Unknown URLs get build/404.html with a real 404 status.
 *
 * Usage: node scripts/prerender.mjs [--build <dir>]
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://www.genesishacks.com";
const OG_IMAGE = `${SITE_URL}/images/og-genesis.jpg`;

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
}

const BUILD_DIR = path.resolve(argValue("--build") || process.env.PRERENDER_BUILD_DIR || path.join(ROOT, "build"));

/* ─── Helpers ─────────────────────────────────────────────────── */

const escHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escAttr = (s) => escHtml(s).replace(/"/g, "&quot;");

/** JSON for a <script> tag: never lets "</script" close the tag early. */
const jsonForScript = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

/**
 * Imports a plain data module (no import statements) by copying it to a
 * temp .mjs file. Returns null if the module has imports or fails to load.
 */
async function importDataModule(relPath) {
  const file = path.join(ROOT, relPath);
  let text;
  try {
    text = await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
  if (/^\s*import\s/m.test(text)) return null;
  const hash = crypto.createHash("sha1").update(text).digest("hex").slice(0, 10);
  const tmp = path.join(os.tmpdir(), `genesis-prerender-${path.basename(relPath, ".js")}-${hash}.mjs`);
  try {
    await fs.writeFile(tmp, text, "utf8");
    return await import(pathToFileURL(tmp).href);
  } catch (err) {
    console.warn(`[prerender] could not load ${relPath}: ${err.message}`);
    return null;
  } finally {
    fs.unlink(tmp).catch(() => {});
  }
}

/** Regex fallback for guide routes if guideData.js cannot be imported. */
function parseGuideFallback(text) {
  const out = [];
  const catRe = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*icon:\s*"[^"]*",\s*articles:\s*\[/g;
  const cats = [];
  let m;
  while ((m = catRe.exec(text))) cats.push({ id: m[1], title: m[2], start: m.index });
  cats.forEach((cat, i) => {
    const chunk = text.slice(cat.start, cats[i + 1]?.start ?? text.length);
    const artRe = /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*desc:\s*"([^"]*)"/g;
    let a;
    while ((a = artRe.exec(chunk))) {
      out.push({ categoryId: cat.id, categoryTitle: cat.title, slug: a[1], title: a[2], desc: a[3] });
    }
  });
  return out;
}

async function loadGuideArticles() {
  const mod = await importDataModule("src/features/guide/guideData.js");
  if (mod?.GUIDE_CATEGORIES) {
    return mod.GUIDE_CATEGORIES.flatMap((cat) =>
      cat.articles.map((a) => ({
        categoryId: cat.id,
        categoryTitle: cat.title,
        slug: a.slug,
        title: a.title,
        desc: a.desc || "",
      })),
    );
  }
  try {
    const text = await fs.readFile(path.join(ROOT, "src/features/guide/guideData.js"), "utf8");
    return parseGuideFallback(text);
  } catch {
    return [];
  }
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escHtml(title)}</title>`);
}

function setMeta(html, attr, key, content) {
  const tag = `<meta ${attr}="${key}" content="${escAttr(content)}"/>`;
  const re = new RegExp(`<meta\\b[^>]*\\b${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "i");
  return re.test(html) ? html.replace(re, tag) : html.replace(/<\/head>/i, `${tag}</head>`);
}

function removeTag(html, re) {
  return html.replace(re, "");
}

function setCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escAttr(href)}"/>`;
  const re = /<link\b[^>]*\brel="canonical"[^>]*>/i;
  return re.test(html) ? html.replace(re, tag) : html.replace(/<\/head>/i, `${tag}</head>`);
}

function addJsonLd(html, data) {
  if (!data) return html;
  const tag = `<script type="application/ld+json" id="prerender-jsonld">${jsonForScript(data)}</script>`;
  return html.replace(/<\/head>/i, `${tag}</head>`);
}

function setRoot(html, inner) {
  const re = /<div id="root"><\/div>/i;
  if (!re.test(html)) throw new Error('build/index.html has no empty <div id="root"></div>');
  return html.replace(re, `<div id="root">${inner}</div>`);
}

function outFileFor(route) {
  if (route === "/") return path.join(BUILD_DIR, "index.html");
  return path.join(BUILD_DIR, `${route.replace(/^\//, "")}.html`);
}

/* ─── Content ─────────────────────────────────────────────────── */

function navList(routes) {
  const items = Object.entries(routes)
    .map(([route, meta]) => `<li><a href="${route}">${escHtml(meta.h1)}</a></li>`)
    .join("");
  return `<nav aria-label="Site"><ul>${items}</ul></nav>`;
}

function contactLine(site) {
  const c = site?.CONTACT || { email: "partner@genesishacks.com", phone: "+91 70433 88006", phoneHref: "tel:+917043388006" };
  return `<p>Sponsors and partners: <a href="mailto:${escAttr(c.email)}">${escHtml(c.email)}</a> or <a href="${escAttr(c.phoneHref)}">${escHtml(c.phone)}</a>.</p>`;
}

function extraFor(route, site) {
  if (!site) return "";
  const { BRAND, STATS, DELHI, PUNE } = site;
  if (route === "/") {
    return [
      `<p>${escHtml(BRAND.description)}</p>`,
      `<p>${escHtml(STATS.eventsLabel)} events. ${escHtml(STATS.attendeesLabel)} attendees.</p>`,
      `<p>Next up: <a href="${DELHI.path}">${escHtml(`${DELHI.name} ${DELHI.edition}`)}</a>, ${escHtml(DELHI.where)}, ${escHtml(DELHI.when)}.</p>`,
    ].join("");
  }
  if (route === DELHI.path) {
    return [
      "<ul>",
      `<li>When: ${escHtml(DELHI.when)}</li>`,
      `<li>Where: ${escHtml(DELHI.where)} (${escHtml(DELHI.venue.toLowerCase())})</li>`,
      `<li>Teams: ${DELHI.teams} teams of ${escHtml(DELHI.teamSize)}</li>`,
      `<li>Tracks: ${escHtml(DELHI.tracks.join(", "))}</li>`,
      `<li>Projected registrations: ${escHtml(DELHI.projectedRegistrations)} (a projection, not a result)</li>`,
      "</ul>",
      `<p><a href="/partner">Sponsor ${escHtml(DELHI.name)}</a></p>`,
    ].join("");
  }
  if (route === PUNE.path) {
    return `<p>${escHtml(PUNE.name)} took place on ${escHtml(PUNE.when)} at ${escHtml(PUNE.where)}. <a href="${PUNE.certificatePath}">Participant certificates</a>.</p>`;
  }
  return "";
}

function eventJsonLd(route, site) {
  if (!site) return null;
  const { DELHI, PUNE, BRAND } = site;
  const organizer = { "@type": "Organization", name: BRAND.name, url: `${SITE_URL}/` };
  if (route === DELHI.path) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${DELHI.name} ${DELHI.edition}`,
      description: `${DELHI.teams} teams of ${DELHI.teamSize} build across six tracks: ${DELHI.tracks.join(", ")}. Dates and venue are tentative and will be confirmed.`,
      startDate: DELHI.startDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: `${DELHI.where} (venue to be announced)`,
        address: { "@type": "PostalAddress", addressRegion: "Delhi", addressCountry: "IN" },
      },
      image: [OG_IMAGE],
      organizer,
      url: `${SITE_URL}${DELHI.path}`,
    };
  }
  if (route === PUNE.path) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: PUNE.name,
      description: `${PUNE.name}, a hackathon run by Genesis Hacks at ${PUNE.where}.`,
      startDate: "2026-08-22",
      endDate: "2026-08-23",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: PUNE.where,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
      image: [`${SITE_URL}/gallery/hackers-occupied-pune/dsc09998.webp`],
      organizer,
      url: `${SITE_URL}${PUNE.path}`,
    };
  }
  return null;
}

function renderPage(shell, { route, title, description, h1, body, jsonLd, noindex = false, routes, site }) {
  const canonical = `${SITE_URL}${route === "/" ? "/" : route}`;
  let html = shell;
  html = setTitle(html, title);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "name", "robots", noindex ? "noindex, follow" : "index, follow");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", description);
  if (noindex) {
    html = removeTag(html, /<link\b[^>]*\brel="canonical"[^>]*>/i);
    html = setMeta(html, "property", "og:url", `${SITE_URL}/`);
  } else {
    html = setCanonical(html, canonical);
    html = setMeta(html, "property", "og:url", canonical);
  }
  html = addJsonLd(html, jsonLd);
  const inner = [
    '<div class="prerender">',
    "<main>",
    `<h1>${escHtml(h1)}</h1>`,
    `<p>${escHtml(description)}</p>`,
    body || "",
    contactLine(site),
    "</main>",
    navList(routes),
    "</div>",
  ].join("");
  return setRoot(html, inner);
}

async function writeFile(file, html) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html, "utf8");
}

/* ─── Main ────────────────────────────────────────────────────── */

async function main() {
  const shellPath = path.join(BUILD_DIR, "index.html");
  const shell = await fs.readFile(shellPath, "utf8");
  if (!/<div id="root"><\/div>/i.test(shell)) {
    throw new Error(`${shellPath} looks already prerendered (no empty #root). Rebuild first.`);
  }

  const routes = JSON.parse(await fs.readFile(path.join(ROOT, "src/shared/config/routes.json"), "utf8"));
  const site = await importDataModule("src/shared/config/site.js");
  if (!site) console.warn("[prerender] site.js could not be imported; pages get route metadata only.");
  const guide = await loadGuideArticles();
  const written = [];

  for (const [route, meta] of Object.entries(routes)) {
    const html = renderPage(shell, {
      route,
      title: meta.title,
      description: meta.description,
      h1: meta.h1,
      body: extraFor(route, site),
      jsonLd: eventJsonLd(route, site),
      routes,
      site,
    });
    const file = outFileFor(route);
    await writeFile(file, html);
    written.push(route);
  }

  for (const a of guide) {
    const route = `/guide/${a.categoryId}/${a.slug}`;
    const html = renderPage(shell, {
      route,
      title: `${a.title} | Organiser guide | Genesis Hacks`,
      description: a.desc || `${a.title}: part of the Genesis Hacks guide to running a student hackathon.`,
      h1: a.title,
      body: `<p>Section: ${escHtml(a.categoryTitle)}. <a href="/guide">Back to the guide</a>.</p>`,
      routes,
      site,
    });
    await writeFile(outFileFor(route), html);
    written.push(route);
  }

  // 404: noindex, no canonical. The SPA boots and shows its Not Found page.
  const notFound = renderPage(shell, {
    route: "/404",
    title: "Page not found | Genesis Hacks",
    description: "This page does not exist. It may have moved, or the link is out of date.",
    h1: "Page not found",
    body: '<p><a href="/">Go to the home page</a> or <a href="/events">browse events</a>.</p>',
    noindex: true,
    routes,
    site,
  });
  await writeFile(path.join(BUILD_DIR, "404.html"), notFound);

  // sitemap.xml from the same route list (www URLs only).
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...Object.entries(routes).map(([route, meta]) => ({ loc: `${SITE_URL}${route === "/" ? "/" : route}`, priority: meta.priority || "0.5" })),
    ...guide.map((a) => ({ loc: `${SITE_URL}/guide/${a.categoryId}/${a.slug}`, priority: "0.3" })),
  ];
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${escHtml(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`),
    "</urlset>",
    "",
  ].join("\n");
  await writeFile(path.join(BUILD_DIR, "sitemap.xml"), sitemap);

  // llms.txt kept in step with site.js when it can be read.
  if (site) {
    const { BRAND, CONTACT, STATS, DELHI, PUNE, PROOF_EVENTS } = site;
    const llms = [
      `# ${BRAND.name}`,
      "",
      `> ${BRAND.description}`,
      "",
      "## Facts",
      `- ${STATS.eventsLabel} events run or partnered on across India, ${STATS.attendeesLabel} attendees in total (${STATS.womenShareLabel} women).`,
      `- Own series: Hackers Occupied. ${PUNE.name} took place on ${PUNE.when} at ${PUNE.where}.`,
      `- Next: ${DELHI.name} ${DELHI.edition}, ${DELHI.where}, ${DELHI.when}. ${DELHI.teams} teams of ${DELHI.teamSize}. Tracks: ${DELHI.tracks.join(", ")}. Dates and venue are tentative.`,
      `- Event Partner at: ${PROOF_EVENTS.map((e) => `${e.name} (${e.venue})`).join("; ")}.`,
      "",
      "## Contact",
      `- Sponsors and partners: ${CONTACT.email}, ${CONTACT.phone}`,
      `- Reply time: ${CONTACT.replyTime}`,
      "",
      "## Key pages",
      ...Object.entries(routes).map(([route, meta]) => `- [${meta.h1}](${SITE_URL}${route === "/" ? "/" : route}): ${meta.description}`),
      "",
    ].join("\n");
    await writeFile(path.join(BUILD_DIR, "llms.txt"), llms);
  }

  console.log(`[prerender] wrote ${written.length} pages + 404.html, sitemap.xml${site ? ", llms.txt" : ""} into ${BUILD_DIR}`);
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
