# Home: Try your combo

## Scope and current status

The latest user direction replaces the generated clothed photographs with the downloaded original A&E combination images. The home section remains below Procedures and before the shared consultation campaign. This is an ordinary Operate/Experience extension within AVA's incumbent editorial world. `PRODUCT.md` remains the product authority; root design files are unchanged.

Current implementation: `src/components/ComboExplorer.tsx`, `src/components/combo.css`, `src/data/combo.ts` and `src/data/aeComboAssets.ts`. Fresh independent A&E finish review returned **SHIP**, scoped to source and all eight supplied captures, with no material fixes requested. The previous photo integration's SHIP verdict applies only to that superseded stage.

## Direction and continuity

Preserve the ivory/espresso/cacao/nude palette, Jost body and heading type, Cormorant Garamond italic emphasis, quiet dividing rules, rounded media frame and circular selection controls inherited from `src/styles.css` and `src/pages/home.css`.

Comparison of the current desktop/mobile captures with the previous photo integration and source confirms continuity in the AVA frame, heading hierarchy, two-column desktop composition, procedure rows and consultation action. The requested original model replaces the clothed family within the existing scene; its transparent full canvas is contained rather than cropped. The preview row now contains exactly two camera controls: Front and Back. This source change does not establish a new visual system.

Desktop keeps the visual left and heading/controls right, with scene height `min(74svh, 780px)`. Below 760px, heading, visual and controls stack; the scene uses `min(38svh, 340px)`. The visual stays sticky while choosing, except on mobile viewports at or below 620px high. Desktop heading remains `clamp(44px, 4.8vw, 70px)` with italic emphasis; supporting copy and procedure rows use 17px, supporting controls 12–14px. Preserve visible focus and reduced-motion behavior.

## Behavior

- Six procedures: BBL, liposuction, tummy tuck, breast augmentation, breast lift and breast reduction. Select at most three, with one breast procedure at a time. Valid breast replacement remains available when three choices are selected; selected choices remain removable.
- Each supported selection renders the **complete selected combination**, with Front and Back controls. Only transitions whose resulting state has an exact original image pair are enabled. BBL + liposuction + tummy tuck and BBL + tummy tuck + breast reduction lack exact original pairs and cannot be selected. Never substitute an unrelated image.
- Comparison pairs the selected combination with the base in the same camera view. Labels are Base and Your combo. The wipe starts at 50%, resets on selection/camera changes, and uses a native keyboard-operable range with visible focus. Comparison is unavailable for an empty selection or an unready/failed image.
- Reset clears selections, returns to the base in the current camera view, closes comparison and recenters the wipe. The bilingual consultation URL and editable form retain selected procedures as context. The generic consultation parser may independently accept other valid lists of up to three procedures.
- Images load near the section. Paired base/combo loading, stale-result cancellation and retry remain in place. Failure must not display an old image as the requested combination.

## Assets and provenance

`public/media/combo-ae/` contains 54 optimized WebPs: front/back pairs for 27 canonical states including base. Each preserves the original 1165×2560 transparent canvas. `src/data/aeComboAssets.ts` lists supported states; `assets/combo-ae/manifest.json` maps states to originals and exact source URLs. All 94 downloaded original PNGs remain in `deliverables/AE-original-references/` with their source manifest.

Source row 37 has procedure labels inconsistent with its etching id/filenames and is excluded. Source row 38 supplies the correct liposuction + breast lift + tummy tuck pair. Duplicate BBL + tummy tuck pairs have identical source hashes; the first pair is retained. Exact original URLs are embedded in WebP XMP and recorded in sidecars. The provenance scan found 54 rasters and zero missing records.

## Public content boundaries

Keep patient-facing selection, comparison and consultation copy. Do not expose development notes, provenance or unavailable-source commentary; invent outcomes or clinical claims; or describe a single-procedure image as a combined result. Provenance and mapping decisions remain internal.

## Quality bar and verification

Current direction and acceptance criteria: `.impeccable/review/combo-ae/direction.md`. Eight validated raw captures are in that directory: `desktop.png`, `mobile.png`, `user-1280.png`, `combo-front.png`, `combo-back.png`, `compare.png`, `english.png` and `consultation.png`.

Reported browser checks covered CSS viewports 1440×1000, 390×844 and 1280×720 with no overflow; matching front/back sources; comparison ArrowRight moving the value to 51; valid breast replacement at three choices; unsupported transitions; reset; and consultation handoff with three procedures and four form fields. Forty-five tests and the final production build passed; the detector returned `[]` once. Raw browser PNG dimensions differ slightly from measured CSS viewports; the cause is unknown and captures were not resized. Fresh independent review confirmed the exact original family, full combinations, matching-camera comparison, supported transitions and handoff, with a SHIP disposition and no material fixes. These results do not establish clinical outcomes.

## Historical work — superseded

The seven generated clothed photographs, 29 mannequin strips, custom 3D bodies, supplied-mannequin experiments, breast pilots, swimwear attempts and other asset studies remain historical. Their original prompts, sources and review records are retained in their existing directories and are not loaded by the current component.

Earlier directions for fixed three-quarter individual previews, generated combined images, Three/GLB loading, sculpted garments, free rotation and profile cameras are retired. Prior SHIP/REBUILD findings and generation blocks describe their respective stages. Current authority is the requested original A&E front/back family, exact supported combinations, matching-view comparison and the incumbent AVA frame documented above.
