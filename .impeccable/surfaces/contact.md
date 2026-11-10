# Contact form

## Scope and direction contract

The current user direction moves the single home contact band one section higher, immediately after the combo selector, and groups the headline and form on the left to leave the model clear on the right. On mobile, show the full photograph above the form. The user-approved sunlounger photograph remains; the Mommy Makeover promotional banner remains removed. The earlier Apollo reference and `assets/contact/contact-background-prompt.txt` are historical inspiration, not current asset or layout direction. No image was generated for this refinement. Keep the address out of every shared contact campaign.

Retain the four fields previously verified at https://aeplasticsurgerymiami.com/contact-us/: first name, last name, phone and email, plus one privacy checkbox. Selected combos stay visible read-only context and hidden metadata. Preserve validation, review/edit and bilingual support, without additional entry fields.

Operate mode inside AVA's existing editorial site. Left-align “Tu belleza. / A tu manera.”, invitation and controls in a compact desktop column, with the four fields in a 2×2 grid, consent and full-width action below. On mobile, retain paired names and full-width phone, email and action on an espresso form surface beneath the full 4:3 image. This is an ordinary scoped refinement, with no new world or approved system change.

## Quality bar

Keep desktop headline and controls on the left without covering the model's torso or face; keep the full mobile photograph free of form overlap. Maintain legible ivory type, controls, focus and errors. Translate labels, errors and review controls; focus the first invalid field. Review/edit must retain values, privacy choice and combo context. Home and standalone heading treatments match. No horizontal overflow at CSS viewports 1440×1000, 390×844 and 1280×720. Preserve footer-photo, location/legal address placements and legal-name restrictions. Add no medical/commercial claims or public development commentary. Control transitions respect reduced motion.

## Implementation and evidence

`ConsultationBand` in `src/components/Shared.tsx` serves home `ap-consulta`, `/consulta` and internal bands. In `src/pages/Home.tsx`, the single home band sits immediately after `ComboExplorer` and before the FAQ `ap-preguntas`; the former post-FAQ instance and Mommy Makeover promotional banner remain removed. `src/components/contact.css` groups desktop content at `width: min(48%, 480px)` over a directional left scrim that clears by 76%. Fields use two columns, with phone/email spanning both up to 760px. Mobile shows the full 4:3 image above the espresso content surface with no overlay. Ivory fields retain espresso text, 56px minimum height and visible focus; the full-width pill action retains its circular arrow.

`media.contact` in `src/data/media.ts` uses unchanged `public/media/ava-sunlounger.webp` (2048×1536); unused `media.mommyBanner` and banner CSS remain removed. The supplied original is preserved at `assets/source/ava-sunlounger.png`; embedded XMP, its `.webp.json` and `public/media/sources.json` record provenance. The shared image attributes match that ratio. Contact retains `object-position: 60% 50%` on desktop; up to 760px it uses a centered full image rather than the earlier 92% crop. See `sunlounger-photo.md` for asset scope.

`ConsultationForm.tsx` retains validation/review/edit. Review remains in the left column and replaces the introduction with one focused heading: h1 on `/consulta`, h2 in shared bands, preserving the section's accessible name without an empty introduction gap. Editing restores retained values and consent. Earlier title and legal field-description changes remain.

## Incumbent continuity

Source continuity with `src/styles.css`, home integration and the prior surface record preserves AVA's ivory/espresso/cacao/nude palette, Jost with Cormorant italic, 16px photographic frame, header/footer and circular-arrow controls. The left desktop column and full-image mobile stack are surface-specific composition refinements. No root `DESIGN.md` or design sidecar was created or rewritten; unrelated drift was not repaired or canonized.

## Verification and finish

The campaign handoff reports **42 tests passed**, production build passed and detector `[]` once. Existing checks cover four-field entry, focus, bilingual errors/value retention, consent, review/edit, one review heading and combo metadata. This documentation pass did not rerun tests.

Checked all eight captures in `.impeccable/review/contact-campaign/`: `desktop.png`, `mobile.png`, `user-1280.png`, `home-desktop.png`, `home-mobile.png`, `english.png`, `validation.png` and `review-mobile.png`. They show the responsive overlay, consistent home heading, English labels, validation/focus, retained edited values and compact review. The address in home capture context belongs to the separate footer photograph.

The campaign's independent finish review returned **ship**, with no material fixes, scoped to source and supplied captures without live-browser review. Its captures establish the earlier campaign layout and states; the current photograph is evidenced below.

Browser evidence in `direction.md` verifies the three CSS viewports, no overflow, loaded background natural width 2048 and zero address text within contact. Raw PNGs are slightly smaller than the CSS viewports; the cause is unestablished, and none was resized/cropped. PNG dimensions are not CSS viewport measurements.

Historical `.impeccable/review/contact/` evidence records the superseded split layout/address strip: 42 tests/build passed, detector `[]`, and **ship** scoped to corrected heading case/scale and review-introduction gap. Its ten captures and viewport limitations remain prior evidence. Current campaign evidence governs this surface and does not establish acceptance of unrelated work.

The earlier photograph replacement passed the production build and detector `[]` once; automated tests were not rerun for that asset-only change. Compared the scoped source with all five `.impeccable/review/sunlounger-swap/` captures: `contact-desktop.png`, `contact-mobile.png`, `mommy-desktop.png`, `mommy-mobile.png` and `user-1280.png`. Its independent finish review returned **ship**, scoped to that earlier two-use placement. Browser handoff reports CSS viewports 1440×1000, 390×844 and 1280×720, no horizontal overflow and loaded image natural width 2048. Raw PNGs are slightly smaller than CSS viewports for an unestablished reason; none was manually resized.

Earlier placement direction and evidence are in `.impeccable/review/contact-placement/`: `direction.md`, `desktop.png`, `mobile.png` and `user-1280.png`. That handoff reports build passed, detector `[]` once, no overflow at CSS widths 1440/390/1280, and DOM checks confirming one form and zero `.ap-editorial` banners. Its review found a stale `PRODUCT.md` banner statement; the verdict pass scored that documentation finding resolved and returned **ship**, scoped to that scored fix. That section order is superseded below.

Current direction and quality bar are in `.impeccable/review/contact-left/direction.md`, with seven raw captures: `desktop.png`, `mobile.png`, `mobile-controls.png`, `user-1280.png`, `english.png`, `review.png` and `standalone.png`. Handoff reports **17 relevant tests passed**, production build passed and detector `[]` once; CSS viewports 1440×1000, 390×844 and 1280×720 have no horizontal overflow. DOM evidence confirms one home form after combo and before preparation; desktop content spans x=90–570 (480px). The fresh independent finish review returned **ship**, with no material fixes, after reviewing source and all seven raw captures for placement, left grouping, model clarity, full mobile photograph and retained form states. This documentation update adds no QA, source changes or root design changes.
