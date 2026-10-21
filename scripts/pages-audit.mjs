import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3000/jolley-Doty').replace(/\/$/, '');
const origin = new URL(base).origin;
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const report = { base, pages: [], errors: [], failedAssets: [], checks: [] };
page.on('pageerror', (e) => report.errors.push(e.message));
page.on('response', (r) => {
  if (r.status() >= 400 && /\.(js|css|woff2|webp|jpg|svg|txt)(\?|$)/.test(r.url()))
    report.failedAssets.push({ url: r.url(), status: r.status() });
});
const paths = [
  '',
  '/books',
  '/books/the-child-of-humanity-last-savior',
  '/books/the-child-of-humanity-the-journey',
  '/books/the-child-of-humanity-final-awakening',
  '/books/poetry-and-satire-for-the-avant-garde',
  '/about',
  '/news',
  '/events',
  '/media',
  '/contact',
  '/privacy',
  '/purchase-information',
];
try {
  for (const route of paths) {
    const r = await page.goto(`${base}${route}/`);
    assert.equal(r.status(), 200);
    await page.waitForLoadState('networkidle');
    if (!route)
      await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
    await page.waitForTimeout(1100);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(1500);
    const exhibition = page.locator('.exhibition-track');
    if (await exhibition.count()) {
      await exhibition.scrollIntoViewIfNeeded();
      for (let index = 0; index < 3; index++) {
        await exhibition.evaluate(
          (el, i) => el.scrollTo({ left: i * el.clientWidth, behavior: 'instant' }),
          index,
        );
        await page.waitForTimeout(250);
      }
      await exhibition.evaluate((el) => el.scrollTo({ left: 0, behavior: 'instant' }));
    }
    await page
      .waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0))
      .catch(async (error) => {
        console.log(
          await page.locator('img').evaluateAll((els) =>
            els
              .filter((el) => !el.complete || !el.naturalWidth)
              .map((el) => ({
                src: el.src,
                loading: el.loading,
                rect: el.getBoundingClientRect().toJSON(),
              })),
          ),
        );
        throw error;
      });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    report.pages.push({
      route,
      status: r.status(),
      violations: result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    });
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const href of new Set(links)) {
      assert.ok(href.startsWith('/jolley-Doty'), `unprefixed link ${href}`);
      const linked = await context.request.get(origin + href);
      assert.equal(linked.status(), 200, href);
    }
  }
  await page.goto(base + '/books/');
  assert.equal(await page.getByRole('button', { name: 'Buy paperback via Ingram' }).count(), 4);
  assert.equal(
    await page.getByRole('button', { name: 'Buy paperback via Ingram' }).first().isDisabled(),
    true,
  );
  await page.goto(base + '/books/the-child-of-humanity-last-savior/');
  await page.getByRole('link', { name: 'Inquire about a signed copy' }).click();
  await page.waitForURL('**/contact/**');
  const prepare = page.getByRole('button', { name: 'Prepare email', exact: true });
  if (await prepare.count()) {
    await page.waitForFunction(() => document.querySelector('#subject')?.value === 'signed-copy');
    assert.ok((await page.locator('#message').inputValue()).includes('Last Savior'));
    await page.locator('#name').fill('A Reader');
    await page.locator('#email').fill('reader@example.org');
    await page.locator('input[name=consent]').check();
    await prepare.click();
    await page.getByRole('heading', { name: 'Your email draft is ready.' }).waitFor();
    assert.ok(
      (await page.getByRole('link', { name: 'Open email app' }).getAttribute('href')).startsWith(
        'mailto:',
      ),
    );
  } else {
    assert.ok((await page.getByRole('status').innerText()).includes('once confirmed'));
    assert.equal(await page.locator('.contact-form').count(), 0);
  }
  report.checks.push('Static query-string inquiry and disabled purchases verified');
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + '/');
    await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
    await page.waitForTimeout(200);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({ path: `artifacts/pages-home-${width}.png`, fullPage: false });
  }
  report.checks.push('No homepage overflow at 320, 390, 768, 1024, 1440px');
  const sitemap = await context.request.get(base + '/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  assert.ok(
    (await sitemap.text()).includes(
      'https://jay-rtl.github.io/jolley-Doty/books/the-child-of-humanity-last-savior',
    ),
  );
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://jay-rtl.github.io/jolley-Doty/',
  );
  report.checks.push('Production canonical and sitemap paths verified');
  const response = await context.request.get(base + '/api/contact/');
  assert.equal(response.status(), 404);
  report.checks.push('No contact API published on static hosting');
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await nojs.newPage();
  await fallback.goto(base + '/');
  assert.equal(await fallback.locator('h1').isVisible(), true);
  await nojs.close();
  report.checks.push('Prerendered content visible without JavaScript');
  assert.equal(report.errors.length, 0);
  assert.equal(report.failedAssets.length, 0);
  assert.equal(report.pages.flatMap((p) => p.violations).length, 0);
} finally {
  fs.writeFileSync('artifacts/pages-audit.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
