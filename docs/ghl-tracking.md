# HighLevel external tracking

Implemented and tested November 13, 2026. Changes are local; this session did not push or deploy them.

## Installation

- Official script: `https://link.msgsndr.com/js/external-tracking.js`
- Public tracking ID: `tk_c94b2b94d91140cc804c4e934610176c`
- Verified destination in the signed-in GHL interface: **Ava Cosmetic Surgery LLC**, Miami, Florida, location `Bd4c10zc7hGNNCuSP4re`.
- `src/components/ExternalTracking.tsx` loads one asynchronous script after the form DOM exists. It remains a singleton through React StrictMode and navigation. The vendor script is not copied, patched or embedded in this repository.
- The vendor SDK sends the initial page view and detects dynamic forms with a MutationObserver. It does not observe React Router navigation. The adapter reuses its existing `tracker.sendEvent` and session for pathname/query changes, without sending duplicate initial or fragment-only views. This bridge depends on the supplied SDK interface and should be checked if HighLevel changes the script.
- No credentials, private API keys, paid ads or outbound messages were used.

## Form behavior and mapping

The shared form ID is `ava-consultation`. Field names: `first_name`, `last_name`, `phone`, `email`, `privacy_consent`. GHL's local-domain mapping was inspected and explicitly saved with First Name, Last Name, Phone and Email mapped to their corresponding CRM fields. Privacy acknowledgment remains in raw submission details; it is not mapped to marketing consent or DND settings.

The SDK listens to both submit-button clicks and native submit events in the capture phase, even if React later prevents the event. React root capture handlers therefore reject incomplete or unconsented attempts before either vendor listener can read them. Valid submissions reach the SDK before React navigates to the localized thank-you page (`/gracias` or `/en/thank-you`). This replaces the earlier review/edit interface. The thank-you copy does not claim verified server receipt, a booked appointment or a response deadline: the vendor does not provide the form with a delivery acknowledgment. Campaign query parameters are retained, and entered contact details are never added to the redirect URL.

The SDK excludes hidden form fields, including the selected combo input. A combo present in the URL can still appear in page URL metadata. BMI inputs have no submitted names; weight, height and result are not present in FormData. Do not change either without revisiting the data handling and privacy copy.

Internal navigation preserves an allowlist of UTMs and ad/click identifiers. Destination values take precedence, external URLs are unchanged, unrelated parameters are not carried between pages, and gallery filter changes retain the campaign. Campaign links are applied after hydration to match prerendered canonical HTML on first render.

## Observed live GHL results

All leads below use synthetic names, reserved example.com email addresses and fictional 202-555-01xx phone numbers.

| Test | Journey | GHL result |
| --- | --- | --- |
| No privacy acknowledgment | Complete fields, click Continue without checking privacy | Error displayed; contact search returned **No contacts found** before the subsequent valid submission |
| Google controlled test | Home → consultation form | One contact; one Form submitted event; First/Latest attribution **Paid Search**; campaign `AVA_QA_GOOGLE_CONTROL_20261113` |
| Meta controlled test | Home → liposuction → consultation, using actual links without reloading | One contact; one Form submitted event; all three page visits in the same journey; First/Latest attribution **Paid Social**; campaign `AVA_QA_META_20261113` |

Google contact: `AVATestGoogle ControlledQA20261113`, `ava.qa.google.control.20261113@example.com`, phone `+1 202 555 0103`; contact ID `gxJijL6ZmiLvHdP6lCdf`, submission ID `6af72fba4b6fd8c13e77cc65`, 10:41 AM EST.

Meta contact: `AVATestMeta JourneyQA20261113`, `ava.qa.meta.journey.20261113@example.com`, phone `+1 202 555 0104`; contact ID `HdzMD6sNXPUGF5zRHyKw`, submission ID `6af72ff9e9da3f87179be9ec`, 10:42 AM EST.

Activity detail dialogs confirmed all four field values, `privacy_consent: on`, timezone, full page URL, source/medium/campaign/content and correct CRM field mapping. Google also retained term/keyword; Meta retained `campaign_id=QA_META_20261113`. Contact-created activities are separate from Form submitted activities, not duplicate submissions. Test contacts remain available for inspection.

An earlier exploratory `AVA QA Google Tracking Test 20261113` record also exists (`ava.qa.google.20261113.1033@example.com`, contact `ImY2hMeAo67trv3b8dFW`). It has two submission activities and is excluded from the controlled single-click result above.

Screenshots are local QA artifacts under `.impeccable/review/ghl-tracking/`: Google/Meta attribution and captured fields, plus the negative consent search.

## Campaign URL examples

Google test landing query:

```text
?utm_source=adwords&utm_medium=cpc&utm_campaign=AVA_QA_GOOGLE_CONTROL_20261113&utm_content=qa_search_ad&utm_term=miami_cosmetic_surgery
```

Meta test landing query:

```text
?utm_source=fb_ad&utm_medium=qa_adset&utm_campaign=AVA_QA_META_20261113&utm_content=qa_creative&campaign_id=QA_META_20261113
```

Use actual campaign/ad macros when configuring ads. HighLevel documents `adwords` and `fb_ad` as supported source values. The tests verify URL attribution and form capture; they do not verify real platform click IDs, ad account reporting, spend, conversion uploads, Meta CAPI, Google enhanced conversions or messaging workflows. No paid campaigns were launched.

## Deployment

Local GHL events were recorded for `127.0.0.1`. Once the code is deployed to `https://avacosmetic.com`, check **Settings → External Tracking → Settings** for that detected domain, verify Page views / Form analytics / Form submissions and its form tracking switch, confirm the four field mappings, then repeat one tagged synthetic lead on the public domain. Local-domain mappings do not prove production-domain configuration. A browser blocker or network failure can still prevent the vendor script from loading or delivering; reaching the thank-you page alone is not proof of receipt.

## Checks

- `npm test`: **86 tests passed across 19 files** after adding the thank-you flow. Coverage includes singleton installation, SPA page views, capture-order validation/consent, standard field identity, campaign propagation, query filters, prerendered HTML hydration and redirects from both localized contact pages and home.
- `npm run build`: passed TypeScript, client/SSR build and 52-page prerendering.
- `npm run check:seo`: all 52 localized pages and both noindex 404 pages passed. The two thank-you pages have `noindex, follow` and are excluded from the 50-URL sitemap.
- Production preview at `127.0.0.1:4173/en/contact` with Meta UTMs: one script, `data-status=ready`, stable form ID and campaign-preserving English links. Browser console had no warnings or errors, including hydration errors. Screenshot: `production-page.png`.
- `git diff --check`: passed.

## Thank-you redirect verification

The production preview form at `127.0.0.1:4173/en/contact` was submitted with synthetic contact `AVATestThanks RedirectQA20261113`, email `ava.qa.thankyou.20261113@example.com` and phone `+1 202 555 0105`. The browser redirected to `/en/thank-you?utm_source=adwords&utm_medium=cpc&utm_campaign=AVA_QA_THANKYOU_20261113`, with no contact details in the URL and no browser warnings or errors.

GHL contact `qI1Bcgckm5noBuUNp6TE`, created November 13 at 11:04 AM EST, shows exactly one **Form submitted** activity linked to `/en/contact`, plus the subsequent thank-you page visit. First and latest attribution both remain **Paid Search**, campaign `AVA_QA_THANKYOU_20261113`. Contact fields match the entered values. This verifies that navigation did not discard the captured form or relabel its landing URL as the thank-you URL.

Desktop English and mobile Spanish compositions were visually checked; both mobile locales were checked for horizontal overflow at 390px. The viewport override was reset afterward. Evidence is in `.impeccable/review/thank-you/`, including `desktop-en.png`, `mobile-es.png` and `ghl-redirect-proof.png`. No deployment, ad spend, conversion-platform setup or outbound messaging was performed.

## Primary references

- [Tracking external forms](https://help.gohighlevel.com/support/solutions/articles/155000006092-tracking-external-forms-with-gohighlevel)
- [Field mapping and domain settings](https://help.gohighlevel.com/support/solutions/articles/155000009476-field-mapping-and-iframe-form-tracking-in-external-tracking)
- [Attribution source rules and ad URL conventions](https://help.gohighlevel.com/support/solutions/articles/48001219997-understanding-attribution-source)
- [External tracking analytics](https://help.gohighlevel.com/support/solutions/articles/155000007809-analytics-for-external-tracking)
