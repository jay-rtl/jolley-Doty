import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = 'https://jay-rtl.github.io/jolley-Doty';
const paths = [
  '',
  'about',
  'books',
  'news',
  'events',
  'contact',
  'media',
  'privacy',
  'purchase-information',
  'books/the-child-of-humanity-last-savior',
  'books/the-child-of-humanity-the-journey',
  'books/the-child-of-humanity-final-awakening',
  'books/poetry-and-satire-for-the-avant-garde',
];
const sitemap = await fs.readFile('out/sitemap.xml', 'utf8');
const titles = new Set();
const report = [];
for (const route of paths) {
  const html = await fs.readFile(`out/${route ? route + '/' : ''}index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `Unique title: ${route}`);
  titles.add(title);
  assert.ok(/<meta name="description" content="[^"]+"/.test(html));
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, `${origin}/${route ? route + '/' : ''}`);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*(?:noindex|nofollow)/.test(html));
  assert.ok(
    /<meta property="og:image" content="https:\/\/jay-rtl.github.io\/jolley-Doty\/images\/social-cover.jpg"/.test(
      html,
    ),
  );
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(/<h1(?:\s|>)/.test(html));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (match) => JSON.parse(match[1]),
  );
  for (const schema of schemas) assert.equal(schema['@context'], 'https://schema.org');
  if (route.startsWith('books/'))
    assert.ok(schemas.some((schema) => schema['@graph'].some((node) => node['@type'] === 'Book')));
  report.push({ route: '/' + route, title, canonical, structuredDataDocuments: schemas.length });
}
const robots = await fs.readFile('out/robots.txt', 'utf8');
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
await fs.writeFile('artifacts/seo-audit.json', JSON.stringify(report, null, 2));
console.log(
  `SEO export checks passed: ${report.length} public pages. External rich-result validation and indexing NOT TESTED.`,
);
