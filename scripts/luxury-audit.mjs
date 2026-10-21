import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = (process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3000/jolley-Doty').replace(/\/$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const report = { base, checks: [], errors: [] };
page.on('pageerror', (error) => report.errors.push(error.message));

async function settled() {
  await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
  await page.waitForLoadState('networkidle');
}
async function noOverflow() {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
async function axe() {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  assert.deepEqual(
    results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
    [],
  );
}

try {
  await page.goto(base + '/');
  await settled();
  assert.equal(await page.locator('.exhibition-panel').count(), 3);
  await page.getByRole('button', { name: 'Show 03 Final Awakening, Book 3' }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[aria-label="Show 03 Final Awakening, Book 3"]')
        ?.getAttribute('aria-pressed') === 'true',
  );
  await page.waitForTimeout(800);
  const position = await page
    .locator('.exhibition-track')
    .evaluate((el) => el.scrollLeft / el.clientWidth);
  assert.ok(Math.abs(position - 2) < 0.02);
  assert.equal(
    await page.getByRole('button', { name: 'Next book', exact: true }).isDisabled(),
    true,
  );
  await axe();
  await page.screenshot({ path: 'artifacts/luxury-third-book.png' });
  await page.getByRole('button', { name: 'Previous book', exact: true }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[aria-label="Show 02 The Journey, Book 2"]')
        ?.getAttribute('aria-pressed') === 'true',
  );
  await page.getByRole('button', { name: 'Show 01 Last Savior, Book 1' }).click();
  await page.waitForTimeout(900);
  await page.locator('.exhibition-track').focus();
  await page.keyboard.press('End');
  await page.waitForTimeout(900);
  assert.ok(
    await page.locator('.exhibition-track').evaluate((el) => el.scrollLeft > el.clientWidth),
  );
  report.checks.push(
    'Desktop direct/next/previous browsing, active volume, boundaries, native keyboard scrolling and third-volume axe',
  );

  // Tablet has a disclosure menu and all three books remain in document order.
  for (const width of [1024, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + '/');
    await settled();
    await noOverflow();
    await page.screenshot({ path: `artifacts/luxury-hero-${width}.png` });
    if (width <= 900) {
      assert.equal(await page.locator('.exhibition-controls').isVisible(), false);
      const panels = await page
        .locator('.exhibition-panel')
        .evaluateAll((els) =>
          els.map((el) => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })),
        );
      assert.ok(panels[0].y < panels[1].y && panels[1].y < panels[2].y);
      assert.equal(panels[0].x, panels[2].x);
      const toggle = page.locator('.menu-toggle');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.waitForFunction(
        () => getComputedStyle(document.querySelector('#primary-navigation')).opacity === '1',
      );
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Home');
      await page.keyboard.press('Escape');
      assert.equal(
        await page
          .getByRole('button', { name: 'Open navigation' })
          .evaluate((el) => el === document.activeElement),
        true,
      );
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.evaluate(() => {
        window.__navigationProbe = 'retained';
      });
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'About', exact: true })
        .click();
      await page.waitForURL('**/about/');
      assert.equal(await page.evaluate(() => window.__navigationProbe), 'retained');
      assert.equal(
        await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'),
        'false',
      );
    }
  }
  report.checks.push(
    '1024/900/768/390/320px no overflow; tablet/mobile stacked books; menu Tab, Escape/focus return and route close',
  );

  for (const route of ['/', '/books/', '/about/', '/news/', '/events/', '/contact/']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + route);
    await page.waitForLoadState('networkidle');
    if (route === '/') await settled();
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(1300);
    await noOverflow();
    await axe();
    await page.screenshot({
      path: `artifacts/luxury-mobile-${route === '/' ? 'home' : route.split('/')[1]}.png`,
      fullPage: true,
    });
  }
  report.checks.push(
    'Six key mobile pages: axe zero violations, no overflow, rendered screenshots',
  );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base + '/');
  await settled();
  await page.getByRole('button', { name: 'Show 03 Final Awakening, Book 3' }).click();
  assert.ok(
    await page
      .locator('.exhibition-track')
      .evaluate((el) => Math.abs(el.scrollLeft / el.clientWidth - 2) < 0.02),
  );
  assert.equal(await page.locator('.reading-progress').isVisible(), false);
  assert.equal(
    await page
      .locator('.hero-cover-link .book-object')
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).isIdentity),
    true,
  );
  report.checks.push(
    'Reduced-motion instant browsing, no decorative transforms or reading-progress animation',
  );

  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await nojs.newPage();
  await fallback.goto(base + '/');
  assert.equal(
    await fallback.getByRole('navigation', { name: 'Page navigation' }).isVisible(),
    true,
  );
  assert.equal(await fallback.locator('h1').isVisible(), true);
  assert.equal(await fallback.locator('.exhibition-panel').count(), 3);
  await fallback
    .getByRole('navigation', { name: 'Page navigation' })
    .getByRole('link', { name: 'Books', exact: true })
    .click();
  await fallback.waitForURL('**/books/');
  await nojs.close();
  report.checks.push('No-JS mobile navigation, primary content and all book records preserved');
  assert.deepEqual(report.errors, []);
} finally {
  fs.writeFileSync('artifacts/luxury-audit.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
