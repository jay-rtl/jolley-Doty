import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Run against a LOCAL fixture build with NEXT_PUBLIC_CONTACT_EMAIL=author@example.test.
// This never opens a mail app, sends mail, or changes the user's real clipboard.
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const requests = [];
page.on('request', (r) => {
  if (r.method() === 'POST') requests.push(r.url());
});
const report = { checks: [], requests };
const base = 'http://127.0.0.1:3000/jolley-Doty';
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + '/contact/?subject=signed-copy&book=Last%20Savior');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('#subject').inputValue(), 'signed-copy');
    await page.locator('#name').fill('  ');
    await page.locator('#email').fill('reader@example.org');
    await page.locator('input[name=consent]').check();
    await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
    assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#name').evaluate((el) => el === document.activeElement), true);
    await page.locator('#name').fill('A Reader');
    await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
    await page.getByRole('heading', { name: 'Your email draft is ready.' }).waitFor();
    const href = await page.getByRole('link', { name: 'Open email app' }).getAttribute('href');
    const mail = new URL(href);
    assert.equal(decodeURIComponent(mail.pathname), 'author@example.test');
    assert.ok(mail.searchParams.get('body').includes('Last Savior'));
    assert.deepEqual([...mail.searchParams.keys()], ['subject', 'body']);
    assert.equal(
      await page.locator('#email-draft').evaluate((el) => el === document.activeElement),
      true,
    );
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__copied = text;
          },
        },
      }),
    );
    await page.getByRole('button', { name: 'Copy email details' }).click();
    assert.ok((await page.evaluate(() => window.__copied)).includes('reader@example.org'));
    await page.evaluate(() =>
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            throw Error('Blocked for fallback test');
          },
        },
      }),
    );
    await page.getByRole('button', { name: 'Copy email details' }).click();
    assert.equal(
      await page
        .locator('#email-draft-details')
        .evaluate((el) => el.selectionEnd - el.selectionStart === el.value.length),
      true,
    );
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    assert.deepEqual(
      axe.violations.map(({ id, nodes }) => ({ id, nodes })),
      [],
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await page.screenshot({ path: `artifacts/manual-email-${width}.png`, fullPage: true });
    await page
      .locator('#message')
      .fill('An updated inquiry about a signed copy and shipping arrangements.');
    assert.equal(await page.locator('#email-draft').count(), 0);
    assert.equal(await page.getByRole('link', { name: 'Open email app' }).count(), 0);
    report.checks.push({
      width,
      validation: true,
      draft: true,
      clipboardStub: true,
      copyFallback: true,
      staleDraftRemoved: true,
      axeViolations: 0,
    });
  }
  assert.equal(requests.length, 0);
  assert.equal(page.url().includes('reader@example.org'), false);
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const nj = await nojs.newPage();
  await nj.goto(base + '/contact/');
  assert.equal(await nj.getByRole('button', { name: 'Prepare email' }).isDisabled(), true);
  await nojs.close();
  report.checks.push({
    noAutomaticRequests: true,
    noPersonalDataInPageUrl: true,
    noJsSubmissionDisabled: true,
    realEmailClientDelivery: 'NOT TESTED',
  });
} finally {
  fs.writeFileSync('artifacts/manual-email-audit.json', JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
