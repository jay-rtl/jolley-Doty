import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const report = { checks: [], errors };
const base = 'http://127.0.0.1:3000';
const transform = (selector) =>
  page
    .locator(selector)
    .first()
    .evaluate((element) => getComputedStyle(element).transform);
try {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.intro === 'running');
  const first = await transform('.title-word');
  await page.waitForTimeout(250);
  const second = await transform('.title-word');
  assert.notEqual(first, second, 'hero words must visibly animate over time');
  await page.screenshot({ path: 'artifacts/motion-hero-during.png' });
  await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
  await page.screenshot({ path: 'artifacts/motion-hero-complete.png' });
  report.checks.push({ test: 'hero word transforms change over time and settle', passed: true });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Skip introduction' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
  assert.equal(await page.getByRole('button', { name: 'Skip introduction' }).count(), 0);
  report.checks.push({
    test: 'intro replays on reload in the same session and can be skipped',
    passed: true,
  });

  const stage = page.locator('.series-grid .cover-stage').first();
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const resting = await transform('.series-grid .book-object');
  const box = await stage.boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3);
  await page.waitForTimeout(600);
  const hovering = await transform('.series-grid .book-object');
  assert.notEqual(resting, hovering, 'book must respond to pointer');
  await page.mouse.move(10, 500);
  await page.waitForTimeout(700);
  const released = await transform('.series-grid .book-object');
  assert.notEqual(hovering, released, 'book must return when pointer leaves');
  report.checks.push({
    test: 'GSAP book depth responds to pointer and resets on leave',
    passed: true,
  });

  const progress = await transform('.reading-progress');
  assert.ok(progress !== 'none');
  const xScale = await page
    .locator('.reading-progress')
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
  assert.ok(xScale > 0 && xScale < 1);
  report.checks.push({ test: 'reading-progress line tracks actual scroll position', passed: true });

  await page.locator('.author-image').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  const authorTransform = await transform('.author-image img');
  assert.notEqual(authorTransform, 'none');
  report.checks.push({ test: 'desktop portrait has scroll-driven parallax', passed: true });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'reduced');
  assert.equal(
    await page
      .locator('.author-image img')
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).isIdentity),
    true,
  );
  assert.equal(await page.locator('.reading-progress').isVisible(), false);
  assert.equal(await page.locator('h1').isVisible(), true);
  report.checks.push({
    test: 'changing reduced-motion live reverts parallax and preserves content',
    passed: true,
  });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'full');
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Books', exact: true })
    .click();
  await page.waitForURL('**/books');
  await page.waitForTimeout(1400);
  assert.equal(await page.locator('.hero-stage').count(), 0);
  assert.equal(await page.locator('h1').isVisible(), true);
  report.checks.push({
    test: 'route change disposes hero motion and reveals supporting page',
    passed: true,
  });

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await touch.newPage();
  await mobile.goto(base);
  await mobile.waitForFunction(() => document.documentElement.dataset.intro === 'complete');
  await mobile.locator('.author-image').scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(1300);
  assert.equal(
    await mobile.locator('.author-image img').evaluate((el) => getComputedStyle(el).transform),
    'none',
  );
  await touch.close();
  report.checks.push({
    test: 'touch viewport uses entrance/reveals without desktop parallax',
    passed: true,
  });
  assert.equal(errors.length, 0, 'runtime errors');
} finally {
  fs.writeFileSync('artifacts/motion-audit.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
