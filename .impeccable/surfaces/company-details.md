# Company details

## Scope and facts

Completed factual extension of the existing AVA site, dated November 10, 2026. The user-supplied business identity is **Ava Cosmetic Surgery, LLC**, with address **8700 North Kendall Drive, Suite 103, Miami, FL 33176**. Source: `C:/Users/Guest/Downloads/Image.jpg`; durable placement constraints also appear in `PRODUCT.md` and `.cursor/rules/public-copy.mdc`.

The exact legal name appears in the footer copyright and the company-information section of `/privacidad`, `/terminos` and `/accesibilidad`. Following the user's placement correction, the footer address is inside the photograph, replacing the former "Miami, Florida / Cosmetic Surgery" text. The lower copyright row retains the legal name without a duplicate address. The address also appears in company information on the three legal pages and on `/ubicacion`. The later contact-campaign direction removes it from every shared contact campaign: standalone `/consulta`, home and embedded internal instances. Public marketing and header branding remain AVA. Legal sections inherit Read mode; the consultation form retains its existing task flow.

## Implementation

`src/data/company.ts` owns the shared facts and Google Maps destination. `src/components/CompanyAddress.tsx` renders a semantic `address` with a visible, underlined map link, three address lines, protected new-tab navigation and an optional class name. `Footer.tsx` places it in the photograph's top area with the existing location treatment; the address has been removed from the lower notes area. `src/pages/Pages.tsx` retains the location/legal placements; `Shared.tsx` no longer renders the address in contact. `footer.css` and `src/styles.css` provide local spacing and type sizing. Existing bilingual section labels remain in use; the proper name and address stay exact in both languages.

## Incumbent continuity

This ordinary extension preserves the established ivory/espresso palette, Jost body text, Cormorant editorial italics, quiet legal-section rules, rounded photographic footer, AVA lockups and responsive layout. The legal company block follows the existing reading grid and stacks on mobile. The footer address inherits the original uppercase location styling (14px desktop, 12px mobile) and wraps within the existing top-area layout. The later full-photo contact campaign has no address strip; its removal does not alter the footer, location or legal treatment. No new visual world or system change is introduced. No root `DESIGN.md` exists; this scoped record does not create one or a design sidecar, and no unrelated drift is repaired.

## Verification

For the placement correction, checked `Footer.tsx`, `CompanyAddress.tsx`, the footer location styles, the persisted placement rule, and all three captures in `.impeccable/review/company-footer-placement/`: `desktop.png`, `mobile.png` and `user-1280.png`. They show the address on the photograph and the legal-name copyright below, with the incumbent AVA framing. `viewport-evidence.json` records requested desktop/mobile/user viewports, observed browser widths of 1440/390/1280, no horizontal overflow, one address on the photograph and zero below. Raw PNG dimensions differ slightly from those CSS viewport dimensions; the reason is unestablished.

The fresh independent footer-placement review returned **ship**, with no material fixes requested. The production build and updated existing `Footer.test.tsx` passed; the detector returned `[]` on the changed UI. The full suite was not rerun for this correction.

Earlier verification of the wider company-details extension checked the supplied source image, shared facts, placements, stylesheet tokens and six captures in `.impeccable/review/company-details/` (legal desktop/mobile, footer desktop/mobile, consultation mobile and location at user width 1280). That round passed the build and 40 tests, returned detector `[]`, and received a **ship** review. Its footer captures record the superseded lower-notes placement; the newer placement evidence above governs the current footer. Its consultation capture also predates the removal of the contact address.

The subsequent contact-campaign evidence in `.impeccable/review/contact-campaign/` verifies zero address text inside contact at the measured desktop/mobile/user viewports. Its home captures preserve the separate footer-photo address. That handoff reports 42 tests/build passed, detector `[]` once and a fresh independent **ship** finish review scoped to source and supplied captures, without live-browser review. See `contact.md` for the current campaign record. These checks do not establish acceptance of unrelated site work.
