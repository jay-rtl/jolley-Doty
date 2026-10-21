# Editorial transformation - 20 October 2026

## Implemented

- Homepage and CSS: full-width author masthead, original-cover composition, curated book exhibition, asymmetric author feature, refined standalone/news/events sections and typographic footer. Ivory, ink, rust and the existing local serif retained.
- BookExhibition: native horizontal desktop browsing with direct-volume, previous/next and Arrow/Home/End controls. All three volumes stack in reading order at 900px and below. No autoplay, pinning or vertical scroll capture.
- GSAP: entrance, cover depth, restrained magnetic CTA, section/image reveals, portrait parallax, reading progress and footer reveal. Cleanup and reduced motion retained. Late/offscreen entrances are skipped; mobile introduction text remains immediately readable.
- Navigation/footer/About: responsive disclosure menu, Escape focus return, no-JS mobile links, larger readable supporting type, authentic portrait and existing verified biography/quotation. Removed obsolete styles, ornament and public extended-biography placeholder.
- Events: upcoming/ongoing dates sorted first; past events newest first; honest empty state retained. Classification is static at build time. Rebuild when dates pass or content changes.
- Contact: correspondence notice replaces editable fields while the recipient remains deferred. Manual-send code is preserved for later activation. No automatic delivery/storage is claimed.
- Assets: true image dimensions and responsive cover variants; originals unchanged. Local fonts use the built-in Next font loader/preloading. No new runtime dependency or generated artwork.
- Static tooling: postbuild normalizes Windows router-segment filename aliases without changing Linux output. Local preview supports gzip and immutable hashed-script caching; these settings do not configure GitHub hosting headers.

Main files: src/app/page.tsx, globals.css, layout.tsx, about/events/contact/privacy pages; components/book-exhibition.tsx, motion.tsx, navigation.tsx, footer.tsx, ui.tsx, contact-form.tsx; lib/events.mjs and content.ts; public/images/responsive; scripts and event tests.

## Design review

The author's identity, real covers and portrait determine the design. Each desktop volume gets a distinct exhibition plate with title/context and a clear detail action. Mobile follows the books as ordered chapters. The author feature, standalone collection and editorial updates use different compositions. Motion supports the introduction and browsing rather than animating every element.

Rendered Edge views of desktop, tablet and narrow-mobile hero/exhibition/author sections were reviewed. Six key pages were rendered at 390px. No tested horizontal overflow. Real hardware, other engines, actual browser zoom and screen readers remain unverified.

## Audit matrix

| Category / scope                           | Status     | Evidence / limits                                                                                                                                                                                  |
| ------------------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functionality - routes/navigation          | PASS       | 13 public routes, local links/images/subpath routing; exhibition controls and real client navigation; menu Tab/Escape/focus and no-JS fallback. No checked missing assets or runtime errors.       |
| Functionality - mail/retail delivery       | NOT TESTED | Recipient/Ingram URLs deferred. No message or purchase attempted. Missing-contact state has no editable fields.                                                                                    |
| SEO - export configuration                 | PASS       | 13 unique titles, descriptions, canonicals, social previews, headings, sitemap membership, no accidental noindex, robots sitemap declaration and JSON-LD syntax. Correct project subpath retained. |
| SEO - external validation/indexing         | NOT TESTED | Search Console, Google rich-results tooling, indexing and origin-wide robots policy not verified.                                                                                                  |
| Responsive/Visual - Edge                   | PASS       | 320/390/768/900/1024/1440px checks, rendered screenshots; desktop exhibition changes to ordered mobile chapters.                                                                                   |
| Responsive/Visual - hardware/other engines | NOT TESTED | Actual devices, Safari, Firefox and browser zoom not exercised.                                                                                                                                    |
| Accessibility - sampled checks             | PASS       | Zero axe A/AA violations on 13 desktop routes and six key mobile pages; keyboard controls, disclosure focus, reduced-motion cleanup and no-JS content/navigation checked. Not certification.       |
| Accessibility - assistive technology       | NOT TESTED | Full screen-reader/zoom audit outstanding.                                                                                                                                                         |
| Security/Privacy - application scope       | PASS       | Production dependency audit: zero reported vulnerabilities. No new tracker, backend, credential, data store or collection flow. Existing CSP retained.                                             |
| Security/Privacy - hosting/legal           | NOT TESTED | GitHub controls hosting headers. Approved operator/jurisdiction, inbox retention and privacy/legal text remain pending.                                                                            |
| Performance - laboratory                   | PASS       | Local static Lighthouse measurements recorded below; scores are observations, not guarantees.                                                                                                      |
| Performance - field CWV                    | NOT TESTED | No real-user LCP/INP/CLS data. Laboratory scores do not establish field performance.                                                                                                               |
| Code/Regression                            | PASS       | 13 unit tests; TypeScript, formatting, production export, SEO, Pages, focused interaction and GSAP audits. No ESLint command configured.                                                           |

## Tests run

Windows; Node 24.18.0; Next.js 16.4.2; Edge 155; Playwright/axe; Lighthouse 13.5.0. Local build uses /jolley-Doty, the actual Pages URL and an empty recipient.

```text
npm test
npm run typecheck
npm run format:check
npm run build
node scripts/seo-audit.mjs
node scripts/pages-audit.mjs
node scripts/luxury-audit.mjs
node scripts/motion-audit.mjs
npm audit --omit=dev --json
```

13 unit tests passed; static export generated 18 pages including framework/metadata routes. Production dependency audit reported zero known vulnerabilities at checking time. Raw reports/screenshots are ignored under artifacts/; no credentials or test recipient are published.

Lighthouse command: cached `npm exec --offline --package=lighthouse -- lighthouse` against the local URL, JSON output, `--chrome-flags="--headless --no-sandbox"`, `--only-categories=performance,accessibility,best-practices,seo`; desktop adds `--preset=desktop`. Edge supplied through CHROME_PATH. Mobile uses default simulated 4x CPU, 150ms RTT and approximately 1.6Mbps throughput. Local preview uses gzip. Earlier optimization runs varied; delivery scores below are the final measurements, not an average or guarantee. No real-device or production-network result is inferred.

## Delivery Lighthouse results

| Local lab profile                    | Performance | Accessibility | Best practices | SEO | LCP  | TBT  | CLS   |
| ------------------------------------ | ----------- | ------------- | -------------- | --- | ---- | ---- | ----- |
| Mobile, default simulated throttling | 91          | 100           | 100            | 100 | 3.5s | 50ms | 0.002 |
| Desktop preset                       | 99          | 100           | 100            | 100 | 0.9s | 0ms  | 0     |

Both final runs had no console-error or label/name-mismatch audit failures. Mobile lab LCP remains above the 2.5s good-CWV reference; field performance is unmeasured. Prior runs varied, including mobile 80-91; the delivery run followed font preloading, responsive images and disabling eager route prefetch. Results are not guaranteed on real devices or production networks. Raw reports: artifacts/lighthouse-mobile-delivery.json and lighthouse-desktop-delivery.json.

## Outstanding items

- Verified Ingram paperback URLs and owner-approved public contact recipient, deferred by the owner.
- Approved full blurbs/edition details, extended biography, standalone cover and final Book 2 artwork confirmation.
- Approved operator/privacy/legal text and inbox-retention decisions.
- Actual-device, other-engine, assistive-technology, Search Console and real-user performance review.
- Rebuild as calendar dates/content change.

## Launch readiness

**READY FOR REVIEW** for the authorized public author-site preview. Full business launch still depends on content/contact/retail/legal items above. No active store or email-delivery service is claimed.

## Next action

Review the live desktop/mobile design. Supply remaining approved business content when ready; contact and purchase setup can remain deferred.
