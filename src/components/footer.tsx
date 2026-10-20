import Link from 'next/link';
import { socialLinks } from '@/lib/content';
export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div className="footer-top">
        <Link className="wordmark" href="/">
          Jalleh Doty<span>AUTHOR</span>
        </Link>
        <p>
          Retain an open mind
          <br />
          in the realm of possibilities.
        </p>
        <div className="footer-links">
          <Link href="/books">The books</Link>
          <Link href="/about">The author</Link>
          <Link href="/media">Media</Link>
          <Link href="/contact">Get in touch ↗</Link>
          {socialLinks.map((link) => (
            <a key={link.label} href={link.url} rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Jalleh Doty. All rights reserved.</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/purchase-information">Purchase information</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
