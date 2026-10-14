# Genesis engineering docs

Use this folder as the source of truth for contributing to Genesis.

## Read in this order

1. [Getting started and contribution workflow](CONTRIBUTING.md)
2. [Frontend architecture](ARCHITECTURE.md)
3. [Clean code policy](CODE_STANDARDS.md)
4. [Performance and optimization](PERFORMANCE.md)
5. [UI, animation, and 3D guidelines](UI_ANIMATION_3D.md)
6. [Release checklist](RELEASE_CHECKLIST.md)
7. [Production readiness audit, July 2026](PRODUCTION_AUDIT.md): security, CVEs, 404, encoding, 3D/perf blockers and fix order
8. The website audit of 13 October 2026 (the PDF in the repository root) drove the redesign: single source of truth for facts, prerendered routes with real 404s, Supabase form storage, DPDP-ready legal pages and the accessibility fixes. Forms and Supabase setup are in the [root README](../README.md#forms-and-supabase).

## Core principle

Genesis is an experience-led website, but visual ambition must stay within a measurable performance budget. Every contribution should preserve:

- a clear mobile experience;
- keyboard and reduced-motion accessibility;
- adaptive quality for expensive rendering;
- route-level code splitting;
- predictable ownership through the layered architecture;
- clean teardown of listeners, observers, animation frames, and GPU resources.

When documentation and implementation disagree, update both in the same pull request.
