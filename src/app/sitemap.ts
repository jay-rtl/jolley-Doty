import type { MetadataRoute } from 'next';
import { productionUrl } from '@/lib/site';
import { books, articles } from '@/lib/content';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = productionUrl();
  if (!origin) return [];
  return [
    '',
    '/about',
    '/books',
    '/news',
    '/events',
    '/contact',
    '/media',
    '/privacy',
    '/purchase-information',
    ...books.map((b) => `/books/${b.slug}`),
    ...articles.map((a) => `/news/${a.slug}`),
  ].map((path) => ({ url: `${origin}${path}/` }));
}
