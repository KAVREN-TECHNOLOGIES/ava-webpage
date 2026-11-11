# Site motion — November 11, 2026

## Direction

Refine the approved AVA editorial layout with CSS motion, Lenis smooth scrolling and subtle photographic parallax. Preserve the current identity, assets, copy, section order and consultation workflow. The hero's typography is the single authored entrance; controls and temporary states respond briefly to interaction. Do not restore the removed floating hero consultation card.

## Implementation

- `src/motion.css`: hero text reveal with room for italic overhangs and descenders; short transitions for buttons, filters and arrows; entries for the mobile navigation, gallery dialog, form feedback and FAQ answers. Native CSS view timelines move photographs within their clipped frames. No scroll listeners, animation library, per-frame React updates or permanent `will-change` layers drive visual effects.
- Photograph coverage: home hero, procedure carousel, procedure directory, procedure details, gallery tiles, contact campaign, footer and the comparison model. Desktop photographs overscan by 3.5% and drift by ±1.2%; mobile overscans by 2% and drifts by ±0.65%. The comparison instead moves its complete pair vertically by up to 6px/3px without horizontal scaling, preserving the split masks. Logos stay fixed; enlarged dialog photographs use a bounded entrance.
- Unsupported view timelines retain visible, static photographs. Spatial animations are enabled only under `prefers-reduced-motion: no-preference`; reduced motion retains instant feedback and native scrolling.
- `src/lib/smoothScroll.ts` and `src/App.tsx`: one Lenis 1.3.27 instance across routes, wheel smoothing at lerp 0.1, native touch and keyboard, coordinated hash navigation, cancellation of outgoing inertia and history position restoration. Body/menu/dialog locks pause the engine. Preference changes destroy/recreate it; cleanup supports React StrictMode. Horizontal carousel gestures, navigation and dialog scrolling remain native.
- `src/main.tsx`: imports Lenis styles and the final shared motion stylesheet. `package.json`/`package-lock.json` add only Lenis. `src/AppScroll.test.tsx` and `src/lib/smoothScroll.test.ts` cover scroll behavior and lifecycle.

## Redlines resolved

| Finding | Fix | Status |
| --- | --- | --- |
| Hero reveal clipped the lower edge of the display type | Expanded the animation's final clipping bounds | Fixed |
| General photo selector overrode the comparison's no-scale exception | Strengthened the pair-specific selector; verified computed scale `none` and 5/50/95% split positions | Fixed |
| Smoothing could conflict with body locks, anchors or route changes | One route controller, explicit lock observer, canceled stale navigation, native nested scroll | Fixed |
| Large movement would compete with the photographs on mobile | Smaller mobile drift and overscan; no movement under reduced motion | Fixed |

## Visual verification

Before/after section captures live in `.impeccable/review/site-motion/`. Captured at CSS viewports 1440×900, 1024×1366 and 390×844. Browser screenshots exclude the scrollbar in their raw image dimensions. Whole-page captures can misrepresent the sticky mobile comparison; its individual viewport capture and DOM measurements verify the actual layout.

| Section | Desktop | Tablet | Mobile | Notes |
| --- | --- | --- | --- | --- |
| Hero | Pass | Pass | Pass | Display letters intact; existing composition retained |
| Procedure explorer | Pass | Pass | Pass | Clipped photos; native horizontal carousel and category switching |
| Combo selector | Pass | Pass | Pass | Pair remains registered; front/back and split extremes checked |
| Contact | Pass | Pass | Pass | Existing form geometry and photograph above form on mobile |
| FAQ | Pass | Pass | Pass | Native details; answer entry verified |
| Footer | Pass | Pass | Pass | Readable links and address; clipped photograph |

All six section positions and dimensions match the baseline within rounding (less than 1 CSS pixel); no document horizontal overflow at any viewport. Procedure directory/detail and gallery were also checked, including mobile dialog open/Escape/focus restoration and scroll lock. Actual wheel input activates Lenis smooth mode; home hash navigation settles 24px below the viewport top. Computed photo translations change with scrolling. No browser console warnings/errors during the final check. Temporary viewport overrides were reset.

## Automated verification

- 71 tests pass across 16 files, including 12 new scroll lifecycle/navigation tests.
- Production client and SSR build passes and prerenders all 50 localized pages.
- `npm run check:seo` passes for all 50 pages.
- `git diff --check` passes.
- Dynamic reduced-motion behavior is tested through the media-query lifecycle; the system preference itself was not changed during browser QA.

Sources consulted: [official Lenis documentation](https://github.com/darkroomengineering/lenis), [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline), [MDN named view timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-timeline-name). No additional animation dependency, deployment or Git push is part of this change.

## Carousel axis correction

The user clarified that only internal Y scrolling in the procedure carousel should be disabled. The global Lenis behavior stays enabled. `overflow-x: auto` had implicitly made Y overflow `auto`; the broad carousel exclusion also switched vertical wheel handling to native scrolling over the cards. The track now declares `overflow-y: hidden`, uses `data-lenis-prevent-horizontal` for native horizontal gestures, and no longer bypasses Lenis for the vertical page gesture. Menu/dialog exclusions are retained.

The regression assertion failed before the fix and passes afterward. All 71 tests and the client/SSR build pass. Browser checks at 1440×900, 1024×1366 and 390×844 confirm hidden Y overflow, track `scrollTop` zero, vertical page progression over the cards with Lenis smooth mode, and no document overflow. Desktop horizontal wheel movement also advances the track while page Y stays unchanged. Evidence is in `.impeccable/review/carousel-axis/`. An explicit reload was used after the change to avoid testing a preexisting engine retained by development hot reload.

## Initial card alignment correction

The initial article entrance translated snap targets horizontally by 12px. Reproduction on a fresh load with the pointer outside the cards measured track `scrollLeft: 12` and the first card 12px outside the left edge after the animation ended. Entering a card's hover state caused the browser to realign the track to zero, producing the reported jump. `ava-card-arrive` now fades opacity only; snap targets stay stationary throughout their entrance.

Fresh normal and fragment loads now both start at `scrollLeft: 0` with the first card aligned to the track edge. Before/after-hover measurements remain zero. The first card fits fully within the track at desktop 1440×900, tablet 1024×1366 and mobile 390×844; switching Body/Breast/Face categories also keeps its initial offset zero. The existing 71 tests and production client/SSR build pass. Captures and measured acceptance checks are in `.impeccable/review/carousel-first-card/`; the 1440×1100 initial/hover captures show the complete portrait card. No JavaScript positioning workaround was introduced.

## Hero cursor stability

The user localized cursor flicker to the hero controls. Inspection found decorative SVG paths receiving pointer hits inside controls, while the computed cursor was already `pointer`. The shared styles now explicitly set actionable link cursors, inherit cursor state into direct children, and remove decorative SVG/aria-hidden content from hit testing. Home marks the circular arrow wrapper as decorative too. Hover transforms remain confined to the artwork; the link's hit area stays fixed.

For both «Consulta» and «Ver procedimientos», repeated text/icon hover probes now hit the anchor itself with `cursor: pointer` and identical bounds. Native clicks at each icon position reach the expected consultation/procedure fragment. Carousel arrow and form probes also retain pointer cursors, and disabled controls retain their distinct cursor states. Evidence in `.impeccable/review/control-cursor/` records DOM hit targets and computed cursor values; it is not an OS cursor recording. No mousemove listeners or custom cursor layer were added.
