import Link from 'next/link';
import { ArrowLink, BookCover, Eyebrow, PageHeading, PurchaseOptions } from '@/components/ui';
import { series, standalone } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'The Books',
  'Explore The Child of Humanity series by Jalleh Doty and Pari Adli, and Poetry and Satire for the Avant-Garde.',
  '/books',
);
export default function BooksPage() {
  return (
    <>
      <PageHeading label="JALLEH DOTY & PARI ADLI" title="The books.">
        <p>The Child of Humanity, in reading order. Paperback editions.</p>
      </PageHeading>
      <section className="wrap section books-page">
        <Eyebrow>THE SERIES · JALLEH DOTY &amp; PARI ADLI</Eyebrow>
        <h2>
          The Child of <em>Humanity</em>
        </h2>
        <div className="series-grid">
          {series.map((book, i) => (
            <article className="series-book" key={book.slug}>
              <Link
                prefetch={false}
                href={`/books/${book.slug}`}
                className={`cover-stage cover-stage-${i + 1}`}
                aria-label={`Read about ${book.subtitle}`}
              >
                <span className="stage-volume">0{book.volume}</span>
                <BookCover book={book} />
              </Link>
              <div className="book-caption">
                <div>
                  <span className="eyebrow">BOOK {book.volume}</span>
                  <h3>{book.subtitle}</h3>
                  <p>{book.authors.join(' & ')}</p>
                </div>
                <ArrowLink href={`/books/${book.slug}`}>Explore book</ArrowLink>
              </div>
              <PurchaseOptions book={book} compact />
            </article>
          ))}
        </div>
        <p className="reading-note">
          <span>READING ORDER</span>Last Savior (Book 1) → The Journey (Book 2) → Final Awakening
          (Book 3).
        </p>
        <article className="catalog-standalone">
          <BookCover book={standalone} />
          <div>
            <Eyebrow>THE STANDALONE COLLECTION</Eyebrow>
            <h2>
              Poetry &amp; Satire
              <br />
              <em>for the Avant-Garde</em>
            </h2>
            <p>{standalone.description}</p>
            <ArrowLink href={`/books/${standalone.slug}`}>Explore the collection</ArrowLink>
            <PurchaseOptions book={standalone} compact />
          </div>
        </article>
      </section>
    </>
  );
}
