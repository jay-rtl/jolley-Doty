import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Book } from '@/lib/content';
import { assetPath } from '@/lib/paths';
export function ArrowLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link prefetch={false} href={href} className={`arrow-link ${className}`}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link prefetch={false} href={href} className={`button ${secondary ? 'button-outline' : ''}`}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span aria-hidden="true" />
      {children}
    </p>
  );
}
export function PageHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-heading wrap">
      <Eyebrow>{label}</Eyebrow>
      <h1>{title}</h1>
      {children && <div className="page-intro">{children}</div>}
    </header>
  );
}
export function BookCover({ book, priority = false }: { book: Book; priority?: boolean }) {
  return (
    <div className={`book-object ${!book.cover ? 'book-placeholder' : ''}`}>
      {book.cover ? (
        <img
          src={assetPath(book.cover)}
          srcSet={[
            ...[320, 480, 640]
              .filter((width) => width <= (book.coverWidth || 0))
              .map(
                (width) =>
                  `${assetPath(book.cover!.replace('/images/', '/images/responsive/').replace('.webp', `-${width}.webp`))} ${width}w`,
              ),
            `${assetPath(book.cover)} ${book.coverWidth}w`,
          ].join(', ')}
          alt={`${book.title}${book.volume ? `: ${book.subtitle}, Book ${book.volume}` : ''}, by ${book.authors.join(' and ')}`}
          width={book.coverWidth}
          height={book.coverHeight}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes="(max-width: 650px) 220px, 280px"
        />
      ) : (
        <div>
          <span>JALLEH DOTY</span>
          <p>
            Poetry
            <br />
            &amp; Satire
          </p>
          <small>for the Avant-Garde</small>
          <span className="placeholder-label">Official cover forthcoming</span>
        </div>
      )}
    </div>
  );
}
export function PurchaseOptions({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <div className="purchase-options">
      <span className="format-label">Paperback</span>
      {book.ingramUrl ? (
        <a className="button" href={book.ingramUrl} target="_blank" rel="noopener noreferrer">
          Buy paperback via Ingram <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : (
        <div className="pending-purchase">
          <button
            className="button"
            type="button"
            disabled
            aria-describedby={compact ? undefined : `ingram-${book.slug}`}
            title="Ingram purchase link coming soon"
          >
            Buy paperback via Ingram <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          {!compact && <p id={`ingram-${book.slug}`}>Ingram purchase link coming soon.</p>}
        </div>
      )}
      {book.retailerUrl && (
        <a className="arrow-link" href={book.retailerUrl} target="_blank" rel="noopener noreferrer">
          View another retailer <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {!compact && (
        <ArrowLink href={`/contact?subject=signed-copy&book=${encodeURIComponent(book.subtitle)}`}>
          Inquire about a signed copy
        </ArrowLink>
      )}
    </div>
  );
}
export function EmptyState({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
