'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Books', '/books'],
  ['News', '/news'],
  ['Events', '/events'],
  ['Contact', '/contact'],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link prefetch={false} className="wordmark" href="/">
            Jalleh Doty<span>AUTHOR &amp; STORYTELLER</span>
          </Link>
          <button
            className="menu-toggle"
            ref={toggle}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav
            id="primary-navigation"
            aria-label="Main navigation"
            className={open ? 'navigation is-open' : 'navigation'}
          >
            {links.map(([label, href]) => (
              <Link
                prefetch={false}
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link prefetch={false} href="/books" className="header-cta">
            Discover the books <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <noscript>
        <nav className="nojs-navigation" aria-label="Page navigation">
          {links.map(([label, href]) => (
            <Link prefetch={false} key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </noscript>
    </>
  );
}
