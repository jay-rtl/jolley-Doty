# GitHub Pages predeployment audit — 20 October 2026

## Implemented

Latest listing cleanup: removed the visible Ingram coming-soon note and signed-copy inquiry links from homepage/catalog book listings. Paperback buttons remain disabled until URLs are supplied; their availability is retained in the hover title. Individual book pages retain the explanatory note and signed-copy inquiry flow. Shared `PurchaseOptions` uses a compact listing variant; no commerce/backend behavior changed.

Owner authorized publication to `jay-rtl/jolley-Doty` and selected GitHub Pages. Converted the reviewed Next.js site to static export, added the `/jolley-Doty` deployment path, adjusted local images/fonts/icons and absolute SEO URLs, and added a GitHub Actions build/deploy workflow. Contact queries now prefill in the browser; the disabled form blocks submission without sending or storing data. The inactive Node backend is preserved in `src/server/contact-route.ts`. The empty news article route is preserved as `src/templates/news-article.tsx` until real articles exist.

The thirteen content pages, authentic covers/portrait, paperback-only Ingram placeholders and GSAP effects are retained. No verified retail links, payment credentials or contact destination have been supplied. No real commerce or email delivery is claimed.

Affecting `next.config.ts`, `.github/workflows/deploy-pages.yml`, `src/lib/paths.ts`, metadata, Contact, local assets, static preview/audit scripts and documentation. Generated `out/`, `.next/`, dependencies, credentials and audit artifacts are excluded from Git.

## Design review

Light editorial presentation is retained: ivory, ink blue, authentic covers, full-color portrait, serif/italic typography and layered trilogy hero. GSAP includes masked title entry, replayable/skippable introduction, shelf reveals, desktop pointer depth, portrait parallax, progress line and reduced-motion cleanup. Body text stays fully opaque during scroll reveals. Earlier low-contrast fade states were removed and rechecked. No scroll hijacking.

The static export was rendered in Edge under the actual repository subpath. Home layouts at 320, 390, 768, 1024 and 1440px have no horizontal overflow. Direct book routes, images, fonts and JS loaded without missing-asset errors. Actual desktop/mobile screenshots are in ignored `artifacts/pages-home-*.png`.

## Audit matrix

| Category / scope | Status | Evidence and limits |
| --- | --- | --- |
| Functionality — exported site | PASS | Thirteen public routes return 200 locally under `/jolley-Doty/`. Internal destinations, four unavailable Ingram buttons, browser-prefilled signed-copy inquiry, disabled contact and no-JS homepage checked. No published API exists. |
| Functionality — GSAP | PASS | Original motion audit passed eight actual transform/replay/hover/progress/parallax/cleanup/touch checks. Exported site initializes and completes GSAP without runtime errors. |
| Functionality — orders/email | NOT APPLICABLE | Unavailable by configuration. GitHub Pages cannot run the preserved Node backend. A separate approved backend or hosting migration is required before contact can operate. |
| SEO — export | PASS | Production URL/base path configured, canonical and sitemap paths checked, titles/descriptions/JSON-LD exported, no public noindex/nofollow. Sitemap includes thirteen content URLs. |
| SEO — indexing | NOT TESTED | Search Console, indexing, origin-wide robots policy and search-engine rich-result validation require postdeployment review. Project robots.txt is not an origin-wide access control. |
| Responsive/Visual — Edge | PASS | Five homepage viewport sizes, static asset rendering and representative desktop/mobile screenshots reviewed; no tested overflow. |
| Responsive/Visual — real devices/other engines | NOT TESTED | Actual phones, Safari, Firefox and actual browser zoom not exercised. |
| Accessibility — sampled checks | PASS | Zero axe A/AA violations on thirteen exported pages. Prior keyboard, reduced-motion and no-JS checks retained; contact controls are labeled and unavailable purchase states are explicit. Not WCAG certification. |
| Accessibility — full assistive technology | NOT TESTED | Screen reader and complete manual zoom/tab-order review outstanding. |
| Security/Privacy — static application | PASS | No secrets in configured public variables or staged environment example. No active form collection, checkout, analytics or optional tracking. Meta CSP blocks unapproved external resources and form actions. Private source documents are not public assets. |
| Security/Privacy — hosting/legal | NOT TESTED | GitHub controls HTTP headers; Next.js headers() does not apply. Header-only policies cannot be claimed from the old server audit. Operator contact/jurisdiction, retention and draft privacy/legal text require owner/professional review. |
| Performance — export implementation | PASS | Pre-optimized local WebP, reserved image sizes, lazy below-fold assets, local WOFF2 and code-split GSAP. No runtime Next Image optimizer required. |
| Performance — Lighthouse/field CWV | NOT TESTED | No Lighthouse or real-user field metrics. Local observations do not establish deployment performance. |
| Code/Regression | PASS | Static production build generated 18 pages including framework/metadata routes. Six unit tests, TypeScript, formatting and the subpath browser audit passed. No browser page errors or missing checked assets. |
| Public hosting status | NOT TESTED | This is the source predeployment audit. The final delivery must separately verify GitHub Actions completion and the actual public URL; a push alone is not a deployment. |

## Tests run

Windows, Node 24.18.0, Next.js 16.4.2, headless Microsoft Edge 155.0.4283.62. Local static host: `http://127.0.0.1:3000/jolley-Doty/`.

```text
npm run build
npm test
npm run typecheck
npm run format:check
node scripts/serve-static.mjs
node scripts/pages-audit.mjs
```

Build environment used `NEXT_PUBLIC_BASE_PATH=/jolley-Doty` and `NEXT_PUBLIC_SITE_URL=https://jay-rtl.github.io/jolley-Doty`. The Pages audit covers thirteen routes, local links/assets, axe, responsive layout, static contact queries, unavailable retail buttons, canonical/sitemap paths, absent API and no-JS content. Raw output: ignored `artifacts/pages-audit.json`. The initial export's empty article route was incompatible with static hosting and was moved to a preserved template; the export then passed.

## Outstanding items

- Verified Ingram paperback URLs, standalone cover, approved full blurbs/edition details, extended biography and final Book 2 artwork confirmation.
- Approved privacy/legal text and operator contact. Contact remains disabled until a separately approved service is implemented.
- Postdeployment actual-device/browser/assistive-technology, Search Console and field performance review.

## Launch readiness

**READY FOR REVIEW** as an explicitly requested public static preview with unavailable commerce/correspondence clearly labeled. Full business launch remains dependent on content/legal approval and verified retail/contact details. No functioning store or email service is claimed.

## Next action

Verify the deployment workflow succeeds, visit the public project URL, then provide the author-supplied Ingram URLs and remaining approved content.
