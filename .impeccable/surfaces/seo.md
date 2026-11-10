# Bilingual routes and SEO

## Scope and direction contract

Completed ordinary integration, dated November 10, 2026. The user requested URLs and metadata that change with the page language, plus SEO/GEO preparation covering services. The confirmed production origin is **https://avacosmetic.com**. Spanish retains existing root paths; English uses `/en` and translated paths, such as `/procedimientos/abdominoplastia` and `/en/procedures/tummy-tuck`.

- **THESIS:** Make the URL express the page language and serve crawler-readable page content.
- **OWN-WORLD:** Preserve AVA's Jost typography, Cormorant editorial italics, ivory/espresso palette, photography and shared chrome.
- **STORY:** Direct entry, reload and browser history retain the page and language; language changes keep the equivalent route, query, fragment and entered consultation values.
- **FIRST VIEWPORT:** Preserve the existing page composition.
- **FORM:** Integrate routing, localized head metadata and prerendering without a new visual world, component system, seed or quality card.

## Implementation

`src/data/routes.ts` owns 25 route identities and 50 localized paths with titles and descriptions. `src/data/site.ts` owns the origin. `src/lib/LocalizedRouting.tsx` derives language from the URL and wraps internal `Link`/`NavLink` destinations. The shared `Site` and route tree in `src/App.tsx` serve both browser and server rendering; switching languages reuses the page component, preserving form state.

`src/lib/seo.ts` supplies unique titles/descriptions, self-canonicals, reciprocal es/en/x-default links, localized Open Graph/Twitter metadata and JSON-LD. `SeoMetadata.tsx` replaces the managed head on navigation. The public AVA name and supplied address ground `MedicalClinic`; the graph also includes `WebSite` and non-home breadcrumbs. Procedure pages use `Service`, `MedicalProcedure` and `MedicalWebPage`, based on existing visible content and the procedure's visible ASPS source. Follow-up text is included only when an actual detail is titled `Recovery`. `FAQPage` is limited to the resources overview and its six visible shared questions/answers. No telephone, hours, ratings, prices, surgeon certifications or legal-name marketing claims were invented.

`src/entry-server.tsx` and `scripts/build.mjs` produce actual page body and head HTML for all 50 paths, a reciprocal-hreflang sitemap, robots.txt and Spanish/English noindex 404 files without a home canonical. The route manifest stays in private `.prerender`, outside `dist`. `vercel.json` configures clean URLs, no trailing slash and the legacy `/variante-apollo` redirect. Production deployment and Search Console configuration were not performed. This is a foundation of readable HTML and grounded entities; it establishes no AI ranking or rich-result guarantee.

The final hydration guard in `src/lib/searchParams.ts` uses `useSyncExternalStore` to supply empty search parameters during server rendering and initial hydration, then apply the actual visit parameters. `ConsultationForm` and `GalleryPage` use it so direct combo/filter URLs first match the prerendered base markup, then restore the query-driven view.

## Incumbent continuity

Checked `src/styles.css`, `src/pages/home.css` and the supplied rendered captures. The integration preserves the existing warm palette, Jost hierarchy, editorial italic emphasis, spacious reading grids, fine dividers, rounded photography and responsive navigation. It introduces no visual tokens or system rules. Root `DESIGN.md` and the design sidecar were not created or changed; `PRODUCT.md` was updated separately by the implementation owner.

## Verification and acceptance

The final implementation handoff reports 57 tests across 14 files passed, including two SSR hydration tests for consultation combo metadata and the clinical gallery filter. Final production build emitted 50 pages, and `npm run check:seo` passed all 50 for page HTML/H1, unique head metadata, canonicals, hreflang, JSON-LD, internal destinations/anchors, image files, sitemap and both noindex 404s. The detector returned `[]` once. This documentation pass inspected the earlier source/test samples and received the final guard verification by handoff rather than rerunning checks.

Browser handoff reports equivalent Spanish/English liposuction switching with query/fragment retained, correct Back/reload and unique head elements; eight English services menu destinations with no overflow; an unknown English resource displaying noindex 404 content without a home canonical; and no console warnings/errors, including hydration. Development Spanish procedure content was also checked. Preview HTTP checks returned 200 for valid pages, 404 for unknown Spanish/English pages and 308 for trailing-slash/legacy redirects with query retained. These are local checks, not evidence of production deployment.

Separate final production-preview browser checks loaded `/en/contact?combo=bbl%2Cliposuccion` directly and displayed “Brazilian Butt Lift + Liposuction”; `/en/photography?tipo=clinica` selected “Evaluating results.” Both retained query-free canonicals and produced no warning/error logs. The two SSR tests verified initial base-markup hydration without recoverable errors followed by the actual combo/hidden metadata or gallery state. These checks cover the later hydration guard; it introduced no visual change to the captures below.

Inspected `.impeccable/review/seo/desktop.png` (English services, CSS viewport 1280×720; raw 1271×715), `mobile.png` (English services, CSS 390×844; raw 381×825) and `procedure-spanish.png` (Spanish abdominoplasty, CSS 1280×720; raw 1271×715). The captures show incumbent type, palette and layouts without visible collisions in their frames. They are uncropped and unresized; the slight CSS/raw dimension difference is unexplained and does not establish a layout token.

The fresh independent finish review returned **ship**, with no material fixes, limited to sampled sources and the three captured first viewports. That review preceded the later query-state hydration guard; the guard's separate automated/browser evidence is recorded above. Acceptance applies only to this narrow routing/SEO integration. No unrelated drift is repaired or canonized; the capture-dimension discrepancy remains an evidence limitation.
