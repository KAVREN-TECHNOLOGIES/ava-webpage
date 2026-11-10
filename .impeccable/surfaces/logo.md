# AVA logo legibility refinement

## Scope

The small descriptor beneath AVA was difficult to read. This refinement updates the shared header and footer lockup within the incumbent AVA identity. It does not establish a new visual world or a general design system.

Product authority: `PRODUCT.md` requires preservation of the existing identity, shared header/footer, typography, palette and responsive behavior. The public brand remains AVA; the footer address and legal-name placement remain as implemented.

## Direction

- **THESIS:** Make the descriptor readable in the header and footer.
- **OWN-WORLD:** Preserve the exact AVA vector mark and the site's Jost, ivory, espresso and editorial photography.
- **STORY:** Keep navigation and the footer address in their existing roles.
- **FIRST VIEWPORT:** Keep the logo at the top left with room for navigation and controls.
- **FORM:** Use one shared code-native lockup, with the descriptor on two lines.

No new-world selection, composition exploration or seed applies to this ordinary refinement.

## Implemented surface

`src/components/BrandLogo.tsx` supplies both header and footer links. The AVA mark uses the exact `brandLockup.letters` path from `src/data/brand.ts`, with `viewBox="66.9336 62.4297 115.3438 32.9648"`, matching the existing large footer art. The original SVG masters in `public/brand/` remain preserved. `public/brand/README.md` distinguishes those masters from the digital lockup.

The descriptor uses the existing Jost family at weight 500, loaded locally in `src/main.tsx`. `src/components/brand-logo.css` implements:

- **Cosmetic Surgery:** uppercase, `.75rem` (12px in the checked browser state), line height `1.2`, tracking `.02em`, no wrapping, and a 7px gap below the vector mark.
- **Miami:** uppercase, `.625rem` (10px in the checked browser state), line height `1.2`, tracking `.28em`, compensating left padding `.28em`, and a 3px gap below the descriptor.
- A centered vertical lockup in incumbent ivory (`--ivory: #f5f1ea`). The incumbent espresso is `--espresso: #241b16`.

The descriptor sizes stay constant across the checked responsive widths. Header link width is `9rem` (144px), `8rem` (128px) at widths up to 1100px, and `7.5rem` (120px) at widths up to 600px. The footer link remains `9rem` (144px). These widths come from `src/pages/home.css` and `src/components/footer.css`.

The existing footer photograph receives the final directional scrim below, extending the darker region behind the small lockup. This is a local legibility treatment, not a new palette or global gradient rule:

```css
linear-gradient(90deg, rgba(13,28,22,.64), rgba(13,28,22,.48) 46%, rgba(13,28,22,.08) 62%, transparent 75%),
linear-gradient(0deg, rgba(13,28,22,.35), transparent 45%)
```

The large AVA footer art, footer address and photography remain unchanged. Each containing home link keeps the existing accessible name, `AVA Cosmetic Surgery · Inicio`. The visual child is `aria-hidden="true"`; the SVG is not focusable.

## Surface rules

**The Exact Mark Rule.** Reuse the original vector outlines for AVA; do not substitute typed letters.

**The Readable Descriptor Rule.** Preserve the implemented two-line descriptor and its checked type sizes when changing the shared lockup. Recheck fit and photographic contrast at affected widths.

## Verification and proof

Proof files are in `.impeccable/review/logo-legibility/`. Captures were saved without manual cropping or resizing. CSS viewport dimensions and saved raster dimensions differ slightly; the cause was not established:

- `desktop.png` and final `footer-desktop.png`: CSS 1280×720; raster 1271×715.
- `mobile.png`, `home-mobile.png` and final `footer-mobile.png`: CSS 390×844; raster 381×825.
- `mobile-english.png`: CSS 375×812; raster 366×793.
- `mobile-320.png`: CSS 320×740; raster 311×719.
- `tablet-english.png`: CSS 901×768; raster 892×760.

The implementer reports no horizontal overflow in the checked states, descriptor/city computed sizes of 12px/10px at weight 500, and a descriptor width of 119.59px within the 120px mobile mark width. The mobile menu opened below the header and closed with Escape. Five existing Footer/App tests passed. The production build passed after the final footer scrim correction.

Adjacent background samples from the final footer captures gave contrast ratios of 6.49–6.80:1 on desktop and 6.63–16.13:1 on mobile. These are local descriptor/city backdrop samples, not an exhaustive measurement of every image pixel.

The detector returned an empty findings list before the final tracking-only adjustment and footer scrim correction; it was not rerun afterward. Final screenshot and source review covered the correction.

The independent review initially requested one footer contrast fix. After the correction, its scored verdict was **ship**: that finding was resolved, with no introduced regressions observed and no remaining scored finding. This verdict is limited to this logo legibility refinement; it is not approval of the whole site.

## Boundaries and drift

The interim footer contrast defect is superseded and is not a design rule. The unexplained CSS-to-raster capture size discrepancy remains an evidence limitation. Neither is canonized into the incumbent system. Root `DESIGN.md`, the design sidecar, `PRODUCT.md` and unrelated surfaces were not changed by this documentation pass; no broader audit or drift repair was performed.
