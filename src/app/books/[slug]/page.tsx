import Link from 'next/link';
import { notFound } from 'next/navigation';
import { books } from '@/lib/content';
import { pageMetadata, productionUrl } from '@/lib/site';
import { ArrowLink, BookCover, Eyebrow, PurchaseOptions } from '@/components/ui';
export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = books.find((b) => b.slug === slug);
  return book
    ? pageMetadata(`${book.title}: ${book.subtitle}`, book.description, `/books/${slug}`)
    : {};
}
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();
  const origin = productionUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Book',
        name: book.volume ? `${book.title}: ${book.subtitle}` : book.title,
        author: book.authors.map((name) => ({ '@type': 'Person', name })),
        description: book.description,
        ...(book.cover ? { image: `${origin}${book.cover}` } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
          { '@type': 'ListItem', position: 2, name: 'Books', item: `${origin}/books` },
          {
            '@type': 'ListItem',
            position: 3,
            name: book.subtitle,
            item: `${origin}/books/${slug}`,
          },
        ],
      },
    ],
  };
  return (
    <div className="wrap">
      {origin && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      )}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link prefetch={false} href="/">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link prefetch={false} href="/books">
          Books
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{book.subtitle}</span>
      </nav>
      <article className="detail-grid">
        <div className="detail-cover">
          <BookCover book={book} priority />
        </div>
        <div className="detail-copy">
          <Eyebrow>
            {book.volume
              ? `THE CHILD OF HUMANITY · BOOK ${book.volume}`
              : 'THE STANDALONE COLLECTION'}
          </Eyebrow>
          <h1>
            {book.title}
            {book.volume && <em>{book.subtitle}</em>}
          </h1>
          <p className="detail-authors">By {book.authors.join(' & ')}</p>
          <div className="detail-description">
            <p>{book.description}</p>
          </div>
          <dl className="detail-facts">
            <dt>Publication</dt>
            <dd>{book.volume ? `Series · Book ${book.volume}` : 'Standalone'}</dd>
            {book.genre && (
              <>
                <dt>Genre</dt>
                <dd>{book.genre}</dd>
              </>
            )}
            <dt>Editions</dt>
            <dd>
              {book.formats.length
                ? book.formats.join(', ')
                : 'Edition details awaiting confirmation'}
            </dd>
          </dl>
          <PurchaseOptions book={book} />
          <p className="signed-note">
            Signed copies are by arrangement. Availability and shipping must be confirmed with the
            author before any payment.
          </p>
          {book.sampleUrl && <ArrowLink href={book.sampleUrl}>Read a sample chapter</ArrowLink>}
          {book.reviews.length > 0 && (
            <section>
              <h2>From readers</h2>
              {book.reviews.map((review) => (
                <blockquote key={review.attribution}>
                  <p>{review.quote}</p>
                  <cite>{review.attribution}</cite>
                </blockquote>
              ))}
            </section>
          )}
        </div>
      </article>
      <aside className="related">
        <h2>Continue exploring.</h2>
        <div className="related-links">
          {books
            .filter((b) => b.slug !== slug)
            .map((b) => (
              <ArrowLink href={`/books/${b.slug}`} key={b.slug}>
                {b.volume ? b.subtitle : b.title}
              </ArrowLink>
            ))}
        </div>
      </aside>
    </div>
  );
}
