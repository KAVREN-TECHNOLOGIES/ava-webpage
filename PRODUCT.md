# AVA Cosmetic Surgery

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing React 19 and TypeScript application, React Router, Vite, and plain CSS. Vitest and React Testing Library provide automated checks.

## Product Purpose

The existing AVA website presents cosmetic surgery procedures, patient preparation resources, and a consultation-details workflow in Spanish and English.

## Capabilities and Constraints

- The requested `/bmi` page follows the calculator functionality at https://aeplasticsurgerymiami.com/bmi/ and inherits the existing AVA styles.
- Calculate adult body mass index from metric measurements (kg/cm) or US measurements (lb/feet/inches), convert entered measurements when switching systems, validate input, and reset the calculator.
- Display the numeric result, adult BMI category, a visual scale, and a link to the existing consultation page. Translate labels, validation, results, and page titles using the existing language provider.
- Adult categories refer to the CDC guidance for ages 20 and older. BMI is a screening measure, not a diagnosis or a determination of surgical eligibility. No AVA-specific surgical BMI threshold has been supplied.
- The BMI page links to the consultation workflow.
- Home and the resources FAQ share six bilingual topics adapted from A&E's home FAQ: clinic distinction, procedure choice, surgical safety, result timing, consultation and recovery. Answers use AVA's existing consultation process and general patient guidance, without importing A&E's surgeon identities, credentials, satisfaction statistics or fixed outcome promises. Preserve the existing native accordion design.
- Contact forms ask only for first name, last name, phone and email, matching the fields verified at https://aeplasticsurgerymiami.com/contact-us/. Keep one privacy checkbox. The page language supplies translated labels; do not ask for language, procedure or notes. Combos from the selector remain visible as context and in hidden form metadata. Home and internal pages share one editorial campaign with full-bleed background photography, white editorial type and the form overlaid on the image. Keep the address out of this contact campaign. Preserve the existing review/edit flow. The user-approved sunlounger photograph (`public/media/ava-sunlounger.webp`, original preserved in `assets/source/ava-sunlounger.png`) supplies the contact background. Home contains exactly one contact band (`ap-consulta`), immediately after the combo selector and before the FAQ (`ap-preguntas`). Headline and form occupy a compact left column on desktop, leaving the model clear on the right; on mobile, the full photograph appears above the form. The former Mommy Makeover promotional banner and post-FAQ form instance are removed. The separate procedure carousel/detail image remains unchanged. `assets/contact/contact-background-prompt.txt` is historical, superseded asset direction.
- A bilingual Try your combo section follows the home procedure explorer. It supports up to three procedures, one breast option at a time, front/back views of the complete selected combination, matching-view base/combo comparison, reset and consultation handoff. Only selections backed by an exact original image pair are enabled. The visual stays sticky while choosing on mobile, except on short viewports.
- The component now uses54 front/back WebPs for27 canonical A&E combination states in `public/media/combo-ae/`. Original PNGs remain in `deliverables/AE-original-references/`; `assets/combo-ae/manifest.json` records exact source URLs, local originals and mapping decisions. `src/data/aeComboAssets.ts` lists supported states. A source row mislabeled as lift+tummy+lipo is excluded because its id/filenames specify abdominal etching; the correct source pair is used. Earlier generated clothed photographs, mannequin strips and3D sources remain historical and are not loaded by the component.

- The home sections “Evaluación preoperatoria” and “¿Liposucción o abdominoplastia?” were removed at the user’s request. The consultation band now leads directly into the existing FAQ. The Preparation navigation link goes to `/servicios`; do not restore the removed home anchor or add replacement sections until the user selects the proposed content.

## Brand Commitments

The user-confirmed production origin is **https://avacosmetic.com**. Spanish retains the established root URLs; English uses `/en` and translated paths. The URL determines the page language on direct entry, reload and history navigation. The language selector keeps the equivalent page, query parameters, fragment and existing form state. All internal links must use the localized routing helpers. `src/data/routes.ts` is the shared route/metadata registry; `src/data/site.ts` owns the canonical origin.

The build prerenders all 50 localized pages with their actual content and localized SEO head. Each page has a unique title/description, self-canonical, reciprocal es/en/x-default alternatives, Open Graph/Twitter metadata and JSON-LD grounded in visible content. Clinic address, service/procedure entities, breadcrumbs and the resources FAQ support local and generative search discovery. Do not add unverified surgeon profiles, ratings, pricing, hours, phone numbers or review credentials. Legal name restrictions continue to apply. Build also emits sitemap.xml, robots.txt and localized noindex 404 pages. `npm run check:seo` verifies the generated HTML. Vercel configuration preserves clean URLs and the former variant redirect; no production deployment or Search Console submission is part of this change.

Business details supplied by the user: legal name **Ava Cosmetic Surgery, LLC**; address **8700 North Kendall Drive, Suite 103, Miami, FL 33176**. Show the legal name only in the footer and legal pages. Keep the public-facing AVA brand elsewhere. In the footer, the address replaces "Miami, Florida / Cosmetic Surgery" inside the photograph; the lower copyright row contains the legal name without a second address. Also show the address on the location page and in company details on legal pages. The user's latest direction removes the address from all shared contact campaigns, including the standalone consultation page.

Preserve the existing AVA identity, shared header/footer and page introduction, typography, palette, and responsive behavior. The user explicitly requested the styles already designed in this repository.

Public copy must focus on patients and their tasks. The user explicitly prohibits development-status notices, provisional technical limitations, implementation commentary, and prototype disclaimers anywhere on the public site. Do not replace them with claims that an action succeeded unless that outcome is verified.

Image provenance and planned image replacements belong in internal records, not public copy, legal pages, captions, or the footer.

## Evidence on Hand

- Visual authority: `src/styles.css`, `src/pages/home.css`, `src/components/Shared.tsx`, `src/components/Header.tsx`, and `src/components/Footer.tsx`.
- Functional reference: https://aeplasticsurgerymiami.com/bmi/
- Adult BMI formula and categories: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
- Existing media sources: `public/media/sources.json`.
