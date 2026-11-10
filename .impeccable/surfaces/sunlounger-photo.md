# Supplied sunlounger photograph

## Scope and direction

The user supplied `C:/Users/Guest/Downloads/hf_20261110_210029_c86697bc-58b8-4c91-ae4b-05db16e778a9.png` and approved it for the shared contact campaign. Current direction places the single home `ap-consulta` immediately after `ComboExplorer` and before the FAQ `ap-preguntas`, retaining the left desktop headline/form grouping established in `.impeccable/review/contact-left/direction.md` to leave the model clear. Mobile shows the full photograph above the form. The initial two-use request and intermediate placement in `sunlounger-swap/direction.md` and `contact-placement/direction.md` are historical; the Mommy Makeover promotional banner and former post-FAQ form remain removed. The earlier contact image prompt is also historical.

This is an ordinary refinement inside AVA's existing visual world: contact remains Operate. Preserve copy, controls, four-field form flow and site frame while keeping the model clear. The separate Mommy Makeover procedure carousel/detail photograph remains unchanged. No image generation or new medical claims were introduced.

## Shipped asset and treatment

`assets/source/ava-sunlounger.png` preserves the supplied 2048×1536 original (4,441,823 bytes). `public/media/ava-sunlounger.webp` encodes the full dimensions (448,084 bytes), with provenance in embedded XMP, `ava-sunlounger.webp.json` and `public/media/sources.json`.

`media.contact` in `src/data/media.ts` uses that WebP. `ConsultationBand` in `src/components/Shared.tsx` declares 2048×1536 image dimensions and keeps the background decorative. The removed banner's JSX, CSS and unused `media.mommyBanner` mapping are gone. Provenance records preserve the original image history.

Desktop contact retains `object-position: 60% 50%`; a directional left scrim clears by 76%, with headline, 2×2 fields, consent and full-width action grouped at a 480px maximum. Up to 760px, the centered full 4:3 image appears above an espresso form surface, replacing the earlier 92% crop and image overlay. Names remain paired, phone/email span the form width, and review remains in the left column. Existing typography, controls and rounded frame continue. The banner's earlier crop is superseded by its removal.

## Continuity and evidence

The earlier source/capture comparison covered `src/styles.css`, `src/components/contact.css`, `src/pages/home.css`, their image components and media mapping with all five `.impeccable/review/sunlounger-swap/` captures: `contact-desktop.png`, `contact-mobile.png`, `mommy-desktop.png`, `mommy-mobile.png` and `user-1280.png`. These document the superseded two-use placement. Ivory type, form labels and controls remain legible over the contact gradient. AVA's ivory/espresso/cacao palette, Jost with Cormorant italic, rounded photographic frames and circular-arrow controls remain continuous.

The earlier asset handoff reports production build passed and detector `[]` once, with no automated test rerun for the asset-only change. Its independent finish review returned **ship**, scoped to the source and five supplied captures for that earlier placement.

Browser handoff reports CSS viewports 1440×1000, 390×844 and 1280×720, no horizontal overflow and loaded image natural width 2048. All five PNGs were inspected; raw PNGs are slightly smaller than the measured CSS viewports, cause unestablished, with no manual resizing. PNG dimensions do not establish CSS viewport dimensions.

The intermediate `.impeccable/review/contact-placement/` handoff records three captures, no overflow, one form and zero `.ap-editorial` banners. Build passed and detector returned `[]` once; its verdict scored the stale `PRODUCT.md` banner statement resolved and returned **ship**, scoped to that documentation fix. Its placement is superseded by the current refinement.

Current `.impeccable/review/contact-left/` evidence comprises `desktop.png`, `mobile.png`, `mobile-controls.png`, `user-1280.png`, `english.png`, `review.png` and `standalone.png`. Handoff reports 17 relevant tests and production build passed, detector `[]` once, no overflow at CSS viewports 1440×1000, 390×844 and 1280×720, and one home form after combo/before preparation. Desktop content spans x=90–570 (480px), leaving the model's torso and face clear. Review/focus/edit and bilingual behavior remain covered. The fresh independent finish review returned **ship**, with no material fixes, scoped to source and all seven raw captures covering placement, left grouping, model clarity, full mobile photograph and retained form states. This documentation update runs no new QA and leaves the already-current `PRODUCT.md` facts intact.

No root `DESIGN.md` or design sidecar was created or updated. No unrelated drift was repaired or canonized; this placement correction establishes no new system rule.
