import type { MetadataRoute } from 'next';
import { productionUrl } from '@/lib/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  const origin = productionUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
