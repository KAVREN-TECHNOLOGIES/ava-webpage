# Patient FAQ

## Current copy — November 11, 2026

The user's subsequent duplicate-copy review supersedes the historical topic wording below. The current six topics are preparing for consultation, choosing a procedure, safety, result timing, combining procedures and returning to work or exercise. Generic differentiation and the overlapping pre-surgery consultation question were removed. The shared data still serves both Home and resources in Spanish and English, including the resources page's structured FAQ. Preparation guidance was checked against [ASPS consultation guidance](https://www.plasticsurgery.org/cosmetic-procedures/mommy-makeover/consultation). Native accordions and their styles are unchanged.

## Scope and sources

Completed content extension of the existing AVA FAQ, dated November 10, 2026. The user's A&E reference supplies six topics in order: clinic distinction, procedure choice, surgical safety, result timing, consultation before surgery and recovery time. `src/data/patientContent.ts` holds the Spanish and English questions with original concise answers adapted to AVA's existing consultation content. The source clinic's doctors, credentials, satisfaction statistics and outcome guarantees are not AVA facts and were not transferred.

Topic reference: [A&E home FAQ](https://aeplasticsurgerymiami.com/). General answer guidance: [ASPS consultation questions](https://www.plasticsurgery.org/patient-safety?sub=Questions+to+ask+your+plastic+surgeon), [ASPS risks and safety](https://www.plasticsurgery.org/patient-safety?sub=Risks+and+Safety+of+Plastic+Surgery) and [Mayo Clinic cosmetic surgery overview](https://www.mayoclinic.org/tests-procedures/cosmetic-surgery/about/pac-20385138). The reference supplies patient topics, not visual authority. `PRODUCT.md` and the existing AVA implementation govern product and presentation.

## Implementation and incumbent continuity

`src/pages/Home.tsx` now renders all six shared entries; `src/pages/Pages.tsx` renders the same data at `/recursos` and uses a subtitle covering consultation, safety and recovery. Both retain native `details`/`summary` accordions and the existing plus SVG, which rotates when open. Language selection continues through the existing provider.

The build preserves the incumbent ivory and espresso palette, sand/nude dividers, Jost reading text, editorial heading treatment and visible keyboard focus. Home keeps its two-column heading/list composition, becoming a single column on mobile; its questions remain 19px desktop/18px mobile and answers 16px/15px. The resource page keeps its broader reading layout, 24px desktop/21px mobile questions and 18px/17px answers. These are existing surface differences, not a new shared type scale. No CSS, visual world, imagery, root design specification or design sidecar changed.

## Verification and limits

The implementation handoff records six matching topics on home and `/recursos`, Spanish and English coverage, Enter toggling a focused summary, visible focus and no horizontal overflow at CSS viewports 1440×1000, 390×844 and 1280×720. Raw captures are in `.impeccable/review/faq-ae/`: `desktop.png`, `mobile.png`, `mobile-open.png`, `user-1280.png`, `english.png` and full-page `resources.png`. Their raw PNG dimensions differ slightly from the CSS viewports for an unestablished reason; the files were not resized.

The initial independent review found the topic order, layout and keyboard continuity satisfactory and requested one English wording correction: the open-ended recovery question now receives an answer starting “Plan for a recovery period.” The subsequent scored-fix review returned **ship** for that copy correction, confirmed in the expanded `english.png`; this verdict is limited to the finding it scored. The production build passed after the correction. Six existing `ContentPages` tests had passed, and the detector returned `[]` once. No new tests or raster changes were needed. This scoped record does not canonize or repair unrelated design drift.
