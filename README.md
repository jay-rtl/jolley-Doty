# Jalleh Doty — author website

Next.js, React, TypeScript and Tailwind CSS author website, with custom editorial styling, self-hosted fonts and GSAP animation. Deployment target: **GitHub Pages**, selected by the owner. Repository: https://github.com/jay-rtl/jolley-Doty.

## Development and static preview

Requires Node 24 and npm. Run `npm ci`, then `npm run dev` for development.

For the same static build used on GitHub Pages, in PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH='/jolley-Doty'
$env:NEXT_PUBLIC_SITE_URL='https://jay-rtl.github.io/jolley-Doty'
npm run build
npm start
```

Open http://127.0.0.1:3000/jolley-Doty/. `out/` is generated and ignored. GitHub Pages publishes it through `.github/workflows/deploy-pages.yml` on pushes to `main`; GitHub Pages must use the GitHub Actions source. The expected project address is https://jay-rtl.github.io/jolley-Doty/. See `DEPLOYMENT.md` for deployment status and caveats.

For a root-domain build, leave `NEXT_PUBLIC_BASE_PATH` empty and provide the real HTTPS site URL. Never invent a domain. If adding a custom domain, update both workflow settings and GitHub Pages domain configuration together.

## Checks

```text
npm test
npm run typecheck
npm run format:check
npm run build
npm run audit:pages
```

The Pages audit requires the static preview and installed Microsoft Edge. It checks rendered routes, images, subpath links, accessibility, paperback availability, query-prefilled inquiries, production canonical/sitemap URLs and responsive overflow. Set `AUDIT_BASE_URL` to audit the deployed site. Results/screenshots go to ignored `artifacts/`.

`scripts/motion-audit.mjs` preserves the original focused GSAP tests: changing hero transforms, same-session replay/skip, book pointer response/reset, reading progress, portrait parallax, live reduced-motion cleanup, route changes and touch behavior. Those tests ran before the Pages conversion; `scripts/pages-audit.mjs` checks the exported build. `scripts/browser-audit.mjs` preserves historical server-build/API checks, which do not apply to GitHub Pages.

## Content and assets

Edit `src/lib/content.ts`. All four titles are paperback-only. Series order: Last Savior → The Journey → Final Awakening. Set each book's `ingramUrl` only when the author supplies a verified link; until then, the Ingram button is disabled with an explicit coming-soon message. No prices, discounts or checkout have been invented. Signed copies are inquiries by arrangement.

Books, genres, formats, approved samples/reviews, articles, events, media and social links use typed data. Keep series entries in volume order. Empty lists display honest empty states. The article route template is preserved in `src/templates/news-article.tsx`; restore it to `src/app/news/[slug]/page.tsx` only after at least one verified article exists, because static exports cannot generate an empty dynamic route. Rebuild after all content changes.

Public assets are in `public/images/`. Do not publish questionnaires, full manuscripts, private correspondence or credentials. Approved samples must contain only authorized excerpts.

- Official portrait: supplied `IMG_5692-Edit2.jpg`, resized without face replacement/retouching.
- Book 2 and Book 3: front-panel crops from supplied wraps. The local Book 2 wrap differs from the initial chat reference; confirm final edition artwork.
- Book 1: identical to the cover supplied in chat, visually compared and saved locally from the [Apple Books listing](https://books.apple.com/us/book/the-child-of-humanity/id6463206397), because the chat image lacked an accessible file path. It is not hotlinked; no prices/ISBNs/edition dates were imported.
- Cormorant Garamond is self-hosted; OFL license in `public/fonts/LICENSE.txt`.
- Favicon and typographic wordmark are new proposals, not pre-existing official branding.

## Animation

`src/components/motion.tsx` owns GSAP matchMedia contexts and cleans them up on route/media changes. The homepage has a masked title entrance, layered trilogy display, drawn journey line and skippable intro that replays on each home entry. Desktop shelves stagger and respond to pointer depth. Portrait parallax and pointer effects are excluded on touch/reduced-motion devices. Text retains full contrast during scroll reveals. Natural scrolling is preserved. Supporting pages have short heading transitions; the top line tracks reading progress. Content is visible without JavaScript. No new animation dependency was added.

## Static-hosting limitations

GitHub Pages does not run Node/API routes or Next.js image optimization. Images were pre-optimized locally and are exported directly. `src/server/contact-route.ts` preserves the previous server implementation but is **not deployed or active**. The contact form prepares a draft locally; the visitor reviews it, opens their email app and clicks Send there. It never submits or stores correspondence on Pages. Copy email details provides a fallback when an app cannot open the full draft. With no confirmed recipient configured, preparation remains disabled.

To enable manual email later, set the GitHub repository Actions variable `CONTACT_EMAIL` to the owner-approved public recipient, then rebuild/deploy. The workflow exposes it as `NEXT_PUBLIC_CONTACT_EMAIL`; it is public, not a secret. No backend is needed. Local builds can set the same public environment variable. Confirm inbox access, retention, operator contact/jurisdiction and final privacy text before activation. A server-backed delivery service would require separate implementation. The reserved server environment variables in `.env.example` cannot enable the contact API on GitHub Pages. No merchant account or payment integration is active.

Static Pages also does not apply `headers()` from Next.js. A supported HTML meta CSP is included, with inline scripts/styles required for hydration. Header-only protections such as frame-ancestors and nosniff cannot be configured by this project on GitHub Pages; do not treat the old server-header audit as proof of production headers. GitHub controls hosting headers. Optional analytics/tracking have not been added.

## SEO and launch review

The workflow supplies the actual Pages URL/base path so static canonicals, social metadata, JSON-LD and sitemap reference the correct project location. Public pages do not contain noindex/nofollow. Project robots.txt is exported, but origin-wide robots behavior is controlled at the GitHub Pages host root. Verify the public deployment before Search Console submission; no indexing/ranking guarantee is implied.

Outstanding owner content: verified Ingram URLs, full biography/blurbs/edition details, standalone cover, final Book 2 artwork and approved privacy/legal text. Genuine social URLs, reviews, media/captions, news and events may be added when supplied. The published site may serve as a review preview while these remain pending; it must not be described as a fully operational store or correspondence service.

## Manual email verification

`node scripts/manual-email-audit.mjs` requires a LOCAL fixture build using `NEXT_PUBLIC_CONTACT_EMAIL=author@example.test` and the static preview. It tests preparation, validation, safe encoding, draft invalidation, copy/fallback, no-JS blocking and axe at 1440/390px without opening a mail app or sending mail. Rebuild with an empty recipient afterward; never deploy the fixture address. The owner has deferred supplying an address, so public contact remains disabled.
