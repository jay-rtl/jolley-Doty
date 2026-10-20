import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Motion } from '@/components/motion';
import { productionUrl } from '@/lib/site';
import { assetPath } from '@/lib/paths';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(productionUrl() ?? 'http://localhost:3000'),
  title: { default: 'Jalleh Doty | Author & Storyteller', template: '%s | Jalleh Doty' },
  description:
    'Explore the writing of Jalleh Doty, The Child of Humanity series with Pari Adli, and Poetry and Satire for the Avant-Garde.',
  applicationName: 'Jalleh Doty',
  icons: { icon: assetPath('/icon.svg') },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'"
        />
      </head>
      <body id="top" className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
