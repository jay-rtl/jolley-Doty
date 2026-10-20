import type { Metadata } from 'next';
export function productionUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    ['localhost', 'example.com', 'www.example.com'].includes(url.hostname)
  )
    throw new Error('NEXT_PUBLIC_SITE_URL must be the verified production HTTPS origin.');
  return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
}
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const origin = productionUrl();
  const canonicalPath = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return {
    title,
    description,
    ...(origin ? { alternates: { canonical: `${origin}${canonicalPath}` } } : {}),
    openGraph: {
      title: `${title} | Jalleh Doty`,
      description,
      type: 'website',
      ...(origin
        ? {
            url: `${origin}${canonicalPath}`,
            images: [
              {
                url: `${origin}/images/social-cover.jpg`,
                width: 1200,
                height: 630,
                alt: 'Jalleh Doty — The Child of Humanity',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Jalleh Doty`,
      description,
      ...(origin ? { images: [`${origin}/images/social-cover.jpg`] } : {}),
    },
  };
}
