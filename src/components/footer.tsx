import Link from 'next/link';
import { socialLinks } from '@/lib/content';
export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div className="footer-top">
        <p>
          Retain an open mind
          <br />
          in the realm of possibilities.
        </p>
        <div className="footer-links">
          <Link prefetch={false} href="/books">
            The books
          </Link>
          <Link prefetch={false} href="/about">
            The author
          </Link>
          <Link prefetch={false} href="/media">
            Media
          </Link>
          <Link prefetch={false} href="/contact">
            Get in touch ↗
          </Link>
          {socialLinks.map((link) => (
            <a key={link.label} href={link.url} rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <Link prefetch={false} href="/" className="footer-masthead" aria-label="Jalleh Doty home">
        Jalleh <em>Doty.</em>
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Jalleh Doty. All rights reserved.</span>
        <div>
          <Link prefetch={false} href="/privacy">
            Privacy
          </Link>
          <Link prefetch={false} href="/purchase-information">
            Purchase information
          </Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
