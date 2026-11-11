# Home content refinement

## Scope and direction contract

The user found two home sections unhelpful, requested competitor-informed proposals for future content, and directed their removal for now. This ordinary refinement removes “Evaluación preoperatoria” and “¿Liposucción o abdominoplastia?” without adding replacement sections or public copy.

- **THESIS:** Remove the low-value blocks cleanly.
- **OWN-WORLD:** Preserve AVA's existing Jost typography, editorial photography and ivory/espresso palette.
- **STORY:** The consultation form leads directly into the existing FAQ.
- **FIRST VIEWPORT:** Leave the existing cover composition unchanged.
- **FORM:** Delete the two sections and repair their navigation dependency.

## Implementation and continuity

`src/pages/Home.tsx` removes both adjacent sections and the unused `Link` import. `src/pages/home.css` removes their 73 unused rules under `ap-experience`, `ap-journey` and `ap-perspective`. The Preparation link in `src/components/Header.tsx` now routes to `/servicios` rather than the removed home anchor. The retained order is cover, procedure explorer, combo selector, single consultation band, six-question FAQ and shared footer. `ap-consulta` is directly followed by `ap-preguntas`.

This deletion establishes no new visual world, system rule, seed, composition exploration or quality card. Existing typography, photographic frames and controls remain incumbent. Root `DESIGN.md` and the design sidecar were not created or updated; `PRODUCT.md` was updated separately by the implementation owner.

## Future proposals, unimplemented

The implementation owner reviewed [A&E Plastic Surgery](https://aeplasticsurgerymiami.com/), [305 Plastic Surgery](https://305plasticsurgery.com/) and [Avana Plastic Surgery](https://avanaplasticsurgery.com/) on 2026-11-10. The advisory comparison found results galleries, named surgeon profiles, patient reviews and financing content across those references. Proposed AVA additions are procedure-specific results and an introduction to the AVA team, using actual clinic materials. These are internal proposals awaiting selection, not implemented sections, new requirements or verified claims about AVA.

## Verification and acceptance

The implementation handoff reports production build passed, 10 existing App/ContentPages tests passed, detector `[]` once and clean `git diff --check`. Browser handoff reports zero removed sections, `ap-consulta.nextElementSibling` resolving to `ap-preguntas`, six native FAQ details, no document horizontal overflow and a Preparation click reaching `/servicios`. This documentation pass did not rerun those checks.

Inspected the two raw captures in `.impeccable/review/home-section-removal/`: `desktop.png` at 1271×715 from CSS viewport 1280×720, and `mobile.png` at 381×825 from CSS viewport 390×844. Both show the bottom of the consultation form, the direct FAQ junction and all six questions. The slight raw/CSS dimension mismatch is unexplained; neither image was cropped or resized, and raw image dimensions do not establish CSS viewport dimensions.

The fresh independent finish review returned **ship**, with no material fixes, scoped to source and the supplied junction captures. It found no visible gap, collision or overflow and confirmed continuity of typography, photography and ivory/espresso color. First-viewport appearance and expanded FAQ states were explicitly outside that review. Historical contact and photograph review records remain unchanged; this acceptance applies only to the narrow removal and navigation repair.

No unrelated drift was repaired or canonized. The unexplained capture-dimension mismatch remains an evidence limitation, not a layout token or accepted defect rule.

## Copy review — November 11, 2026

The user requested another pass over home and procedures for repetition and meaningless copy. Home's hero now names the three procedure categories without repeating a list of card titles. Category summaries explain what distinguishes the options. The shared FAQ replaces the unsubstantiated clinic-distinction question and repeated consultation explanation with consultation preparation and combining procedures; its six topics remain distinct in both languages. The contact campaign now says “Hablemos de tu cirugía” and asks for contact details instead of using a generic beauty slogan.

The procedure directory and all nine detail pages use the same updated bilingual data. Detail pages explain the technique once alongside the photograph, without repeating the card summary above it or the 27 short checklist labels below it. Subsequent sections add procedure-specific assessment, limitations or recovery information. Medical scope was checked against the existing linked ASPS procedure pages and their procedure-step/consultation guidance. Photography, typography, palette, routes, form behavior and the comparison fix remain unchanged. Shared FAQ and contact instances inherit the wording for consistency.

Verification: all 59 existing tests pass; the client/SSR build and the 50-page SEO check pass. A one-off inspection of the 22 generated home/directory/detail pages found no repeated body paragraphs within a page. Desktop and mobile browser checks confirmed readable Spanish/English copy and no horizontal overflow. Captures and extracted rendered paragraphs are retained in `.impeccable/review/copy-refinement/`. No new copy-mirroring tests or design-system changes were added.

## Hero consultation card removal — November 11, 2026

At the user's request, Home no longer renders the floating «Preparar consulta» card. Its duplicate hero photograph and all 23 dedicated CSS rules, including compact breakpoint overrides, were removed. The hero's photograph, headline, procedure action, navigation and rail retain their current layout. Consultation remains available through navigation and the shared contact section. Browser checks at 1440×900 and 390×844 confirmed no card and no horizontal overflow; captures are in `.impeccable/review/hero-card-removal/`.
