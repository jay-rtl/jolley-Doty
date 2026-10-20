import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://127.0.0.1:3000';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
await page.addInitScript(() => {
  window.__lab = { lcp: 0, cls: 0 };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) window.__lab.lcp = entry.startTime;
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.__lab.cls += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
fs.mkdirSync('artifacts', { recursive: true });
const report = { browser: browser.version(), pages: [], api: [], interactions: [], errors };
const paths = [
  '/',
  '/about',
  '/books',
  '/books/the-child-of-humanity-last-savior',
  '/books/the-child-of-humanity-the-journey',
  '/books/the-child-of-humanity-final-awakening',
  '/books/poetry-and-satire-for-the-avant-garde',
  '/news',
  '/events',
  '/media',
  '/contact',
  '/privacy',
  '/purchase-information',
];
const internalLinks = new Set();
async function fullScreenshot(page, path) {
  await page.evaluate(async () => {
    for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight) {
      scrollTo(0, top);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  });
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path, fullPage: true });
}
try {
  for (const path of paths) {
    const response = await page.goto(base + path);
    await page.waitForLoadState('networkidle');
    if (path === '/')
      await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
    else await page.waitForTimeout(1000);
    assert.equal(response.status(), 200, path);
    assert.ok(await page.locator('h1').textContent());
    assert.ok(await page.title());
    assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href'))))
      internalLinks.add(href);
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const badImages = await page
      .locator('img')
      .evaluateAll((imgs) =>
        imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
      );
    report.pages.push({
      path,
      status: response.status(),
      title: await page.title(),
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
      badImages,
    });
  }
  for (const href of internalLinks) {
    const r = await context.request.get(base + href);
    assert.equal(r.status(), 200, href);
  }
  await page.goto(base + '/books');
  assert.equal(await page.getByRole('button', { name: 'Buy paperback via Ingram' }).count(), 4);
  for (const button of await page.getByRole('button', { name: 'Buy paperback via Ingram' }).all()) {
    assert.equal(await button.isDisabled(), true);
  }
  assert.deepEqual(await page.locator('.series-grid h3').allTextContents(), [
    'Last Savior',
    'The Journey',
    'Final Awakening',
  ]);
  assert.equal(await page.locator('.format-label').filter({ hasText: 'Paperback' }).count(), 4);
  report.interactions.push({
    test: 'three books in reading order; four paperback-only Ingram options disabled until URLs supplied',
    passed: true,
  });
  report.interactions.push({
    test: 'all discovered internal link destinations return 200',
    count: internalLinks.size,
    passed: true,
  });
  const headers = (await context.request.get(base)).headers();
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['x-frame-options'], 'DENY');
  assert.ok(headers['content-security-policy'].includes("frame-ancestors 'none'"));
  report.interactions.push({
    test: 'security headers present in production response',
    passed: true,
  });
  const introContext = await browser.newContext();
  const introPage = await introContext.newPage();
  await introPage.goto(base, { waitUntil: 'domcontentloaded' });
  await introPage.getByRole('button', { name: 'Skip introduction' }).click({ timeout: 3000 });
  assert.equal(await introPage.getByRole('button', { name: 'Skip introduction' }).count(), 0);
  await introContext.close();
  report.interactions.push({ test: 'first-visit introduction can be skipped', passed: true });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.goto(base);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    report.interactions.push({ width, overflow });
    await fullScreenshot(page, `artifacts/home-${width}.png`);
    if (width === 1440)
      report.localLab = await page.evaluate(() => ({
        largestContentfulPaintMs: window.__lab.lcp,
        cumulativeLayoutShift: window.__lab.cls,
        context:
          'Local production server, warm cache, desktop Edge, no network or CPU throttling. INP and field metrics not measured.',
      }));
  }
  for (const path of paths) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    report.interactions.push({ path, width: 390, overflow });
    if (
      ['/about', '/books', '/contact', '/books/the-child-of-humanity-final-awakening'].includes(
        path,
      )
    ) {
      await page.screenshot({
        path: `artifacts/mobile-${path.split('/').at(-1)}.png`,
        fullPage: true,
      });
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      report.pages.push({
        path,
        width: 390,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
        badImages: [],
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(
    await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded'),
    'true',
  );
  await page.keyboard.press('Escape');
  assert.equal(
    await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'),
    'false',
  );
  report.interactions.push({ test: 'mobile navigation opens and Escape closes', passed: true });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Books', exact: true })
    .click();
  await page.waitForURL('**/books');
  assert.equal(new URL(page.url()).pathname, '/books');
  report.interactions.push({ test: 'mobile navigation changes route', passed: true });
  await page.goto(base + '/books/the-child-of-humanity-final-awakening');
  await page.getByRole('link', { name: 'Inquire about a signed copy' }).click();
  await page.waitForURL('**/contact?**');
  assert.equal(await page.locator('#subject').inputValue(), 'signed-copy');
  assert.ok((await page.locator('#message').inputValue()).includes('Final Awakening'));
  assert.equal(await page.getByRole('button', { name: 'Contact opening soon' }).isDisabled(), true);
  report.interactions.push({
    test: 'signed-copy inquiry prefilled; unavailable contact cannot submit',
    passed: true,
  });
  await page.goto(base);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
  report.interactions.push({ test: 'keyboard skip link is first focus target', passed: true });
  const reduced = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const rp = await reduced.newPage();
  await rp.goto(base);
  await rp.waitForFunction(() => document.documentElement.dataset.motion === 'reduced');
  assert.equal(
    await rp.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    'auto',
  );
  assert.equal(await rp.locator('h1').isVisible(), true);
  await reduced.close();
  report.interactions.push({
    test: 'reduced motion preserves content and removes smooth scrolling',
    passed: true,
  });
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const nj = await nojs.newPage();
  await nj.goto(base);
  assert.equal(await nj.locator('h1').isVisible(), true);
  await nojs.close();
  report.interactions.push({ test: 'primary content available without JavaScript', passed: true });
  const valid = {
    name: 'Test Reader',
    email: 'reader@example.org',
    subject: 'general',
    message: 'This is a local verification message, not a real email.',
    consent: true,
    website: '',
  };
  for (const item of [
    { name: 'missing origin', headers: {}, body: valid, status: 403 },
    {
      name: 'foreign origin',
      headers: { origin: 'https://other.example.org' },
      body: valid,
      status: 403,
    },
    { name: 'invalid payload', headers: { origin: base }, body: {}, status: 400 },
    {
      name: 'honeypot',
      headers: { origin: base },
      body: { ...valid, website: 'https://spam.example.org' },
      status: 400,
    },
    { name: 'unconfigured delivery', headers: { origin: base }, body: valid, status: 503 },
    {
      name: 'oversized body',
      headers: { origin: base },
      body: { ...valid, message: 'x'.repeat(25000) },
      status: 413,
    },
  ]) {
    const response = await context.request.post(base + '/api/contact', {
      headers: { 'Content-Type': 'application/json', ...item.headers },
      data: item.body,
    });
    report.api.push({ test: item.name, status: response.status(), expected: item.status });
    assert.equal(response.status(), item.status);
  }
  const robots = await context.request.get(base + '/robots.txt');
  assert.ok((await robots.text()).includes('Allow: /'));
  const sitemap = await context.request.get(base + '/sitemap.xml');
  assert.ok(!(await sitemap.text()).includes('localhost'));
  const missing = await page.goto(base + '/books/does-not-exist');
  assert.equal(missing.status(), 404);
  report.interactions.push({
    test: 'robots allows public pages, no invented sitemap domain, unknown book returns 404',
    passed: true,
  });
} finally {
  fs.writeFileSync('artifacts/browser-audit.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
assert.equal(errors.length, 0, 'runtime errors');
assert.equal(report.pages.flatMap((p) => p.violations).length, 0, 'accessibility violations');
assert.equal(report.pages.flatMap((p) => p.badImages).length, 0, 'broken images');
assert.equal(report.interactions.filter((i) => i.overflow).length, 0, 'horizontal overflow');
