# GitHub Pages deployment

Owner selected GitHub Pages and authorized uploading/deploying the supplied repository on 20 October 2026.

- Repository: https://github.com/jay-rtl/jolley-Doty
- Project path: `/jolley-Doty`
- Expected public URL: https://jay-rtl.github.io/jolley-Doty/
- Build: `npm ci`, `npm test`, `npm run build` with `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` set by the workflow.
- Output: `out/`; `.nojekyll` is added before artifact upload.
- Workflow: `.github/workflows/deploy-pages.yml`, source branch `main`, deployment environment `github-pages`.
- Deployment permissions: repository contents read, Pages write and OIDC token write. No account-wide secret is placed in the repository.

The site is exported HTML/CSS/JS, including GSAP and thirteen public content pages. Contact backend code is preserved outside active routes. Ingram buttons and contact submission remain unavailable until separately configured. Missing content and draft privacy text remain visible review items.

Publication status will be verified against the GitHub Actions result and the public URL, not inferred from a successful push. See `AUDIT.md` and ignored `artifacts/pages-audit.json` for verification evidence.

Manual email drafts are implemented without a backend. Optional repository Actions variable `CONTACT_EMAIL` supplies the public recipient at build time. The owner deferred this address; leave it unset so preparation stays disabled. No automatic sending, inbox delivery or email-client compatibility is claimed.
