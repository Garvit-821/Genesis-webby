# Genesis Web — Production Readiness Audit

> **Status, 13 October 2026:** superseded in part by the October 2026 website audit. Since then: Unsplash images and the gstatic Draco host are gone from the CSP, unknown URLs return a real 404 (`build/404.html`), routes are prerendered, and forms are stored in Supabase. See the root README.

> **Audit date:** 20 Jul 2026  
> **Mode:** Brutal / launch-blocking  
> **Method:** Full codebase inspection + live browser DOM checks (not code review only)  
> **Overall score:** **4.2 / 10** — **Not production ready**

This document is the durable copy of the production readiness audit. Use it as the single source of truth for what is broken, why it matters, and exactly what to change before a public launch.

---

## Executive summary

The site is visually ambitious (Three.js hero, adaptive LOD, GSAP scroll), but it is **not launch-ready**.

Confirmed live:

| Finding | Why it blocks launch |
|---|---|
| Unknown URLs render a **blank page** | No catch-all / 404 route |
| Brand UI shows **garbled text** (`Â·`, `â†’`, `Â©`) | UTF-8 mojibake in source files |
| **`react-router-dom` High CVEs** | XSS / open redirect / RCE-class issues in a **runtime** dependency |
| **No ErrorBoundary** | WebGL / chunk failure → full white-screen crash |
| **No security headers** | No CSP, X-Frame-Options, HSTS, etc. |
| Contact form is **`mailto:` only** | No real lead capture; most mobile users get silence |

---

## Phase scores

| Category | Score /10 | Notes |
|---|---|---|
| Architecture | 6 | Layered `app/pages/widgets/features/shared/infrastructure` is solid; undermined by dead assets, zero tests, EOL CRA. |
| Frontend / React | 5 | Cleanup mostly good; no ErrorBoundary; stale-closure bug; non-functional contact. |
| Three.js | 5.5 | Good disposal + KTX2/Draco/Meshopt; lights don’t scale by tier; one wasted renderer; no IBL. |
| Performance | 5 | Adaptive FPS downgrade works; wasted GPU pass + 700% scroll-jack + ~13MB dead public assets hurt. |
| Security | 2 | No headers, High CVEs in router, no CSP, no consent. |
| Accessibility | 5 | Strong `prefers-reduced-motion`; nav uses buttons instead of links; empty `alt` on content image. |
| Visual Design | 6 | Strong mascot + type tokens; undermined by mojibake and nav wrap. |
| Brand Identity | 5 | Distinct mascot; Unsplash stock for “real events” undercuts authenticity. |
| UX | 3.5 | Blank 404, dead form, scroll-jack, dead legal/social links. |
| Developer Experience | 5 | Good aliases/docs; CRA EOL; encoding hygiene failure. |
| Production Readiness | 2.5 | Headers / 404 / CVEs / dead assets / lead capture all fail. |

---

## Critical blockers (must fix before launch)

### 1. Zero 404 / catch-all route

**Status: FIXED (Jul 2026)**

**Evidence:** `http://localhost:3000/nonexistent-route-test-404` rendered a completely blank page.

**Where:** `frontend/src/app/router/AppRouter.jsx` — only `/`, `/gallery`, `/events`. No `path="*"`.

**Impact:** Typos, old bookmarks, stale shares → blank dark page, no nav, guaranteed bounce.

**What was done:**
- [x] Create `pages/not-found/NotFoundPage.jsx` (branded 404 + home/events links).
- [x] Add `<Route path="*" …>` wired to `NotFoundPage`.
- [x] Automated smoke: `npm run check:critical`
- [ ] Manual: open `/this-does-not-exist` and confirm NotFound UI (not blank).

---

### 2. Text-encoding corruption (mojibake)

**Status: FIXED (Jul 2026)**

**Evidence:** Live DOM showed `Contact â†’`, `SRM-IST Â· Chennai`, `Â©{year}`. ~**43** occurrences across **7** files historically: Footer, Hero, TheLoop, InfiniteGallery, Contact, Gallery, Events.

**Impact:** `·` → `Â·`, `→` → `â†’`, `©` → `Â©`. Brand-damaging and launch-blocking.

**What was done:**
- [x] `scripts/fix-encoding.py` replaced 42 sequences in 7 files with real Unicode.
- [x] Repo `.editorconfig` locks `charset = utf-8`.
- [x] Guardrail: `npm run check:encoding` (included in `npm run check:critical`).
- [ ] Manual: spot-check Contact / Events / Footer / Hero copy in the browser.

---

### 3. Contact form does not capture leads

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] Primary submit: `POST /api/contact` (Vercel serverless) → Formspree or Resend when env configured.
- [x] Client also tries `REACT_APP_BACKEND_URL/api/contact` and `REACT_APP_FORMSPREE_ID`.
- [x] Success / error UI with mailto **fallback link** (not primary).
- [x] Secrets stay in env (`FORMSPREE_ID`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`).

---

### 4. No React ErrorBoundary

**Status: FIXED (Jul 2026)**

**Evidence:** Zero matches for `ErrorBoundary` / `componentDidCatch` / `getDerivedStateFromError` in `src/`.

**Impact:** `HeroCanvas` creates `WebGLRenderer` without a safety net. WebGL-disabled / old GPU → whole tree crashes white.

**What was done:**
- [x] `shared/ui/ErrorBoundary.jsx` (class boundary + default fallback).
- [x] App-level wrap in `AppProviders`.
- [x] Per-route `PageBoundary` in `AppRouter` (incl. 404).
- [x] Hero feature boundary around `HeroCanvas`.
- [x] `HeroCanvas` try/catch + `webglFailed` UI — ErrorBoundary cannot catch `useEffect` failures.
- [x] Automated smoke: `npm run check:critical`
- [ ] Manual: temporarily throw in a page / disable WebGL to confirm fallbacks.

---

### 5. High-severity npm vulnerabilities (runtime)

**Status: FIXED for runtime router CVEs (Jul 2026)**

**Evidence (audit-time):** `npm audit` → **33** vulns, **16 High**. Critical path: **`react-router-dom@7.5.1`** (direct runtime dep).

**What was done:**
- [x] Upgraded `react-router-dom` → **`7.18.1`** (pulls patched `react-router@7.18.1`).
- [x] Ran `npm audit fix` (non-force). Remaining High findings are **CRA/react-scripts toolchain** (svgo/`nth-check`, jest/jsdom, webpack-dev-server) — build/dev path, not shipped app router code.
- [x] Guard: `npm run check:critical` asserts `react-router-dom >= 7.18`.
- [ ] Follow-up (not blocking this fix): migrate off CRA/craco to clear remaining toolchain Highs.

---

### 6. Zero security headers

**Status: FIXED (Jul 2026)**

**Evidence:** `vercel.json` only had cache headers.

**What was done:**
- [x] Global headers: CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy.
- [x] CSP allowlists PostHog, Unsplash images, gstatic Draco, `'self'`, plus CRA-needed `'unsafe-inline'`/`'unsafe-eval'` (tighten after Vite migration).
- [x] SPA rewrite destination set to `/index.html`.
- [x] Long-cache headers for `/model/`, `/genesis-frame/`, `/fonts/`, `/images/`.
- [x] Guard: `npm run check:critical` asserts required header keys exist.
- [ ] Verify on a Vercel preview: DevTools → Network → Response Headers.

---

### 7. Dead / leaked assets in `public/`

**Status: FIXED (Jul 2026)** — active Hero LODs preserved

**What was done (caution: only moved unused/source files):**
- [x] **Kept in `public/model/`:** all `Hero-{Ultra,High,Medium,Low}.glb` + `*-KTX2.glb` (8 runtime files).
- [x] **Moved offline to `frontend/assets/model-source/`** (not served):
  - `genesis-original.bak`
  - `genesis-model.glb`
  - `genesis-compressed.glb`
  - `genesis`
- [x] `ASSET_PATHS.fallback` → `/model/Hero-Low.glb` (no public `genesis-compressed` dependency).
- [x] `optimize-hero-models.mjs` reads sources from `assets/model-source/` only; never writes backups into `public/`.
- [x] Guard: `npm run check:critical` fails if banned files reappear in `public/model/` or required Hero LODs are missing.

---

## High priority

### 8. “Adaptive” quality does not scale lights

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] `LIGHT_RIGS` in `quality.config.js` — low: ambient+key; medium: +fill; high/ultra: full rig.
- [x] `applyLightRig()` toggles visibility/intensity on quality evaluate and FPS swaps.

### 9. Wasted WebGL renderer on Events page

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] Removed `WebGLRenderer` / scene / `#letters-canvas` / per-frame `.render()`.
- [x] Kept `PerspectiveCamera` + `CatmullRomCurve3` + `.project()` for DOM letter placement only.

### 10. Extreme scroll-jacking (`+=700%`)

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] Pin distance ≈ `2.75×` viewport (`2.2×` on coarse pointers), derived via `end: () => …`.

### 11. Stale-closure after resize

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] `moveDistance` is mutable; recomputed in `handleResize` with `updateCardsTarget` + `ScrollTrigger.refresh()`.

### 12. Hard dependency on Unsplash for core content

Event cards + OG/Twitter images use hardcoded Unsplash URLs, no local fallback, weak `onError` story.

**What to do:**
- [ ] Prefer real event photos under `public/`.
- [ ] Add `onError` fallback image.
- [ ] Point OG/Twitter meta to a first-party image.

### 13. Navbar uses `<button>` instead of `<Link>`

**Impact:** No open-in-new-tab, no copy link, weaker SEO crawlability, a11y smell.

**What to do:**
- [ ] Use React Router `<Link>` / `<NavLink>` for internal routes.
- [ ] Keep buttons only for true actions (menu toggle, etc.).

### 14. Dead legal links + no consent

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] `/privacy` + `/terms` pages; footer links wired.
- [x] `ConsentBanner` — PostHog loads only after Accept (`shared/consent`).
- [x] Inline PostHog bootstrap removed from `index.html`.

### 15. Global `HTMLCanvasElement.prototype.getContext` monkey-patch

**Status: FIXED (Jul 2026)**

**What was done:**
- [x] Removed prototype patch from `public/index.html`.
- [x] Draw-only canvases keep explicit `{ willReadFrequently: false }` where needed.

---

## Medium priority

| # | Issue | Action |
|---|---|---|
| 16 | Empty `alt=""` on content image (`EventsPage`) | Real descriptive alt |
| 17 | Social links `href="#"` (`Contact`) | Real URLs or `preventDefault` + disabled state |
| 18 | Incomplete cache headers | Cache `/model/*`, `/images/*`, `/genesis-frame/*` with long TTL + versioning strategy |
| 19 | Draco decoder on `gstatic` only | Self-host decoder under `public/` + fallback |
| 20 | No `robots.txt` / `sitemap.xml` / structured data | Add for `/`, `/events`, `/gallery` |
| 21 | CRA/craco EOL toolchain | Plan Vite (or similar) migration; many audit noise vulns come from CRA stack |
| 22 | Thin favicon / no PWA manifest | apple-touch-icon, maskable icons, `manifest.json` |
| 23 | Duplicate mobile/desktop DOM | Prefer one tree + CSS, or true conditional render |
| 24 | PostHog script always injected | Gate script insert on valid key **and** consent |

---

## Low priority

| # | Issue | Status |
|---|---|---|
| 25 | ASCII `console.log` banner in `App.jsx` | ✅ Dev-only (`NODE_ENV !== "production"`) |
| 26 | `dezhub:perfDebug` / `?perfDebug=1` | ✅ Production ignores toggle (`DEBUG_PERFORMANCE` gated) |
| 27 | `envMapIntensity = 0` on hero materials | ✅ Quiet IBL (`envMapIntensity = 0.18` + low `environmentIntensity` + `RoomEnvironment`) so glasses aren’t black without washing lights |

---

## Recommended fix order

Do these in sequence for maximum launch risk reduction:

1. ~~Upgrade `react-router-dom` (CVE)~~ ✅ (`7.18.1`)
2. ~~Add security headers (`vercel.json`)~~ ✅
3. ~~Add catch-all 404 route~~ ✅
4. ~~Fix encoding mojibake (7+ files)~~ ✅
5. ~~Add ErrorBoundaries (app + Hero + routes)~~ ✅
6. ~~Wire real contact / lead capture~~ ✅ (`/api/contact` + Formspree/Resend + mailto fallback)
7. ~~Delete/move dead public model/backup assets~~ ✅ (sources in `assets/model-source/`)
8. ~~Events page: reduce scroll-jack, fix resize stale closure, remove wasted WebGL pass~~ ✅
9. Nav `<Link>`s, Unsplash → first-party media (legal/consent done ✅)
10. Cache headers (partially done), robots/sitemap, CRA→Vite plan (clears remaining toolchain Highs)

### Automated checks for fixed items

```bash
cd frontend
npm run check:encoding    # blocker #2
npm run check:critical    # blockers #1 + #2 + #4 wiring
```

---

## Verification checklist (before calling it “ready”)

### Security
- [x] `react-router-dom` >= 7.18 (runtime router CVEs addressed)
- [ ] Remaining CRA toolchain Highs accepted until Vite migration (document in release notes)
- [x] Production config has HSTS, nosniff, frame deny, CSP, referrer policy (`vercel.json`)
- [ ] Confirm headers on a Vercel preview deploy
- [x] No `.bak` / raw genesis sources under `public/model/`

### Reliability
- [x] Unknown route shows NotFound UI with navigation (code + smoke check)
- [ ] Manual confirm NotFound on a preview/prod URL
- [x] Hero WebGL failure shows fallback, not white screen (local try/catch + boundary)
- [x] Lazy/page render failure caught by route ErrorBoundary
- [ ] Manual confirm by forcing a throw in a page component

### Content / brand
- [x] No `Â` / `â` mojibake in source (`npm run check:encoding`)
- [ ] Spot-check Contact / Events / Footer / Hero in the browser
- [ ] Contact submit creates a real lead (or confirmed third-party receipt)
- [ ] Terms + Privacy are real pages

### Performance / 3D
- [ ] Dead public GLBs/backups gone
- [ ] Quality tiers change light count (or documented why not)
- [ ] Events page has no unused WebGL render loop
- [ ] Scroll-jack duration acceptable on mobile

### Commands

```bash
cd frontend
npm run check:critical
npm run check:encoding
npm audit
npm test
npm run build
```

Then on production (or preview):

- Open DevTools → Network → confirm security headers
- Hit `/this-route-does-not-exist` → expect NotFound, not blank
- Submit contact form → expect confirmed delivery
- Spot-check Contact / Events / Footer for encoding

---

## Related docs

- [Release checklist](./RELEASE_CHECKLIST.md)
- [Performance notes](./PERFORMANCE.md)
- [Architecture](./ARCHITECTURE.md)
- [Frontend architecture](../frontend/src/ARCHITECTURE.md)

---

## Status note

Some items may already be partially addressed after the audit (for example local `/images/logo.png`, PostHog session recording disabled, per-canvas `willReadFrequently: false`, KTX2 mipmap guards). **Re-verify each checkbox against the current tree** before marking done — do not assume the audit findings are all still open or all still accurate without a fresh check.
