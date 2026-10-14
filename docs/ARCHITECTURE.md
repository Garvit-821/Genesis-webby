# Frontend architecture

The frontend uses a pragmatic layered architecture. Dependencies flow downward; lower layers must not reach back into higher layers.

```mermaid
flowchart TD
    Entry["index.js"] --> App["app"]
    App --> Pages["pages"]
    Pages --> Widgets["widgets"]
    Pages --> Features["features"]
    Widgets --> Shared["shared"]
    Features --> Shared
    Widgets --> Infra["infrastructure"]
    Features --> Infra
```

## Layer responsibilities

### `app/`

Application wiring only:

- global providers;
- router configuration;
- route loading fallbacks.

Do not place page markup or domain behavior here.

### `pages/`

Route-level composition, one folder per route (`home/`, `events/`, `partner/`, `privacy/`, ...).

Pages may assemble widgets and features. Route modules are lazy-loaded in `app/router/AppRouter.jsx`. Every page renders inside `widgets/layout/PageShell.jsx` (header, cursor, smooth scroll, per-route SEO, footer); most start with `PageHero`.

### `widgets/`

Reusable page-level chrome such as `PageShell`, `PageHero`, the navbar, footer, intro, cursor, marquee, and chapter rail. Widgets may import from `shared` and `infrastructure`, but not from pages.

### `features/`

Self-contained experiences such as hero, about, event showcase, contact, and galleries. Keep feature-specific components, shaders, and behavior together.

### `shared/`

Generic modules with no domain ownership:

- `config/` — `site.js` (every public fact: contact, numbers, events) and `routes.json` (title, description and H1 per route). Pages read facts from here instead of hard-coding them;
- `motion/` — shared animation primitives and easing curves;
- `seo/` — `useSeo`, which sets title, description, canonical and Open Graph tags per route;
- `ui/` — reusable primitives;
- `hooks/` — generic lifecycle hooks;
- `lib/` — framework-neutral helpers;
- `data/` — shared static data (`events.js` is the curated event archive);
- `styles/` — global design tokens and shell styles;
- `constants/` — stable IDs and constants.

`shared` must never import from pages, widgets, or features.

### `infrastructure/`

Low-level technical systems. The adaptive quality stack lives in `infrastructure/performance`, including device/network/GPU detection, model loading, FPS monitoring, and rendering presets.

## Import aliases

| Alias | Layer |
|---|---|
| `@app` | `src/app` |
| `@pages` | `src/pages` |
| `@widgets` | `src/widgets` |
| `@features` | `src/features` |
| `@shared` | `src/shared` |
| `@infra` | `src/infrastructure` |

Use a feature's `index.js` for its public API. Deep imports are acceptable only for a genuinely private implementation used inside the same feature.

## Adding a route

1. Add a folder under `pages/` and wrap the page in `PageShell`.
2. Keep the page focused on composition.
3. Add a lazy import and route in `app/router/AppRouter.jsx`.
4. Add the route to `shared/config/routes.json` (title, description, h1, priority). The build-time prerender (`frontend/scripts/prerender.mjs`) writes static HTML for every entry and adds it to `sitemap.xml`. A route that is missing there gets an HTTP 404 on a direct visit, because `vercel.json` has no catch-all rewrite.
5. Run `npm run build` and check `build/<route>.html` exists.
6. Test mobile, keyboard navigation, reduced motion, and the production build.

## Adding a feature

Create `features/<feature-name>/` with the component, local helpers, styles, and assets it owns. Export the intended public API from `index.js`; do not expose every internal file.

## Known debt

`pages/events/EventsPage.jsx` currently mixes GSAP, Lenis, Three.js, embedded CSS, and UI state. Treat it as temporary debt, not a template for new pages. Prefer splitting future work into page composition plus smaller feature modules.
