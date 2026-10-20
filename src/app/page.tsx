import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink, BookCover, ButtonLink, Eyebrow, PurchaseOptions } from '@/components/ui';
import { series, standalone, bio, articles, events } from '@/lib/content';
import { pageMetadata, productionUrl } from '@/lib/site';
import { assetPath } from '@/lib/paths';

export const metadata = {
  ...pageMetadata(
    'Author & Storyteller',
    'Meet Jalleh Doty and explore The Child of Humanity series with Pari Adli. Discover Last Savior, The Journey and Final Awakening in paperback.',
    '/',
  ),
  title: { absolute: 'Jalleh Doty | Author & Storyteller' },
};

export default function Home() {
  const origin = productionUrl();
  return (
    <>
      {origin && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                { '@type': 'WebSite', name: 'Jalleh Doty', url: origin },
                {
                  '@type': 'Person',
                  name: 'Jalleh Doty',
                  url: `${origin}/about`,
                  image: `${origin}/images/author.webp`,
                  description: bio,
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <Eyebrow>THE WRITING OF JALLEH DOTY</Eyebrow>
            <h1 aria-label="Jalleh Doty">
              <span className="title-clip">
                <span className="title-word">Jalleh</span>
              </span>{' '}
              <span className="title-clip">
                <span className="title-word title-word-italic">Doty.</span>
              </span>
            </h1>
            <p className="hero-tagline">
              “Retain an open mind
              <br />
              in the realm of possibilities.”
            </p>
            <p className="hero-description">
              Author of <em>The Child of Humanity</em> series with Pari Adli, and{' '}
              <em>Poetry and Satire for the Avant-Garde.</em>
            </p>
            <div className="hero-actions">
              <ButtonLink href="#books">Browse the books</ButtonLink>
              <ArrowLink href="/about">About Jalleh</ArrowLink>
            </div>
            <div className="hero-motion-controls" data-intro-controls />
          </div>
          <div className="hero-feature">
            <div className="hero-feature-topline">
              <span>THE CHILD OF HUMANITY</span>
              <span>01 / 03</span>
            </div>
            <div className="hero-stage">
              <svg className="journey-line" viewBox="0 0 500 510" fill="none" aria-hidden="true">
                <path
                  d="M30 405C-25 255 410 65 460 175S80 490 55 323"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle cx="460" cy="175" r="4" fill="currentColor" />
                <circle cx="55" cy="323" r="4" fill="currentColor" />
              </svg>
              <span className="hero-stage-index" aria-hidden="true">
                I.
              </span>
              <div className="hero-companion hero-companion-three" aria-hidden="true">
                <BookCover book={series[2]} priority />
              </div>
              <div className="hero-companion hero-companion-two" aria-hidden="true">
                <BookCover book={series[1]} priority />
              </div>
              <Link
                href={`/books/${series[0].slug}`}
                className="hero-cover-link"
                aria-label="Discover Last Savior, Book 1"
              >
                <BookCover book={series[0]} priority />
              </Link>
            </div>
            <div className="hero-feature-caption">
              <div>
                <span>BEGIN WITH BOOK ONE</span>
                <h2>Last Savior</h2>
              </div>
              <ArrowLink href={`/books/${series[0].slug}`}>View book</ArrowLink>
            </div>
          </div>
          <a className="hero-scroll-note" href="#books">
            <span className="scroll-track" aria-hidden="true">
              <span />
            </span>
            <span>SCROLL TO EXPLORE THE BOOKS</span>
          </a>
        </div>
      </section>
      <section className="section wrap series-section" id="books">
        <div className="series-rule" aria-hidden="true" />
        <div className="section-heading" data-reveal>
          <div>
            <Eyebrow>THREE BOOKS. READ IN ORDER.</Eyebrow>
            <h2>The Child of Humanity</h2>
          </div>
          <p className="section-heading-description">
            A series by Jalleh Doty &amp; Pari Adli.
            <br />
            Available format: paperback.
          </p>
        </div>
        <div className="series-grid">
          {series.map((book, i) => (
            <article className="series-book" key={book.slug} data-reveal>
              <Link
                href={`/books/${book.slug}`}
                className={`cover-stage cover-stage-${i + 1}`}
                aria-label={`Explore ${book.subtitle}, Book ${book.volume}`}
              >
                <span className="shelf-number" aria-hidden="true">
                  0{book.volume}
                </span>
                <BookCover book={book} />
              </Link>
              <div className="book-caption">
                <div>
                  <span className="eyebrow">BOOK {book.volume}</span>
                  <h3>
                    <Link href={`/books/${book.slug}`}>{book.subtitle}</Link>
                  </h3>
                </div>
                <ArrowLink href={`/books/${book.slug}`}>Details</ArrowLink>
              </div>
              <PurchaseOptions book={book} compact />
            </article>
          ))}
        </div>
        <p className="reading-note">
          <span>READING ORDER</span>Last Savior → The Journey → Final Awakening
        </p>
      </section>
      <section className="author-section">
        <div className="wrap author-grid">
          <div className="author-image" data-reveal>
            <Image
              src={assetPath('/images/author.webp')}
              alt="Jalleh Doty, author"
              width={900}
              height={1350}
              sizes="(max-width: 760px) 90vw, 420px"
            />
          </div>
          <div className="author-copy" data-reveal>
            <Eyebrow>ABOUT THE AUTHOR</Eyebrow>
            <h2>
              A life in <em>words.</em>
            </h2>
            <p>
              Jalleh Doty has spent approximately twenty years writing, with an ambition to bring
              her work to a wider readership.
            </p>
            <p>
              She writes <em>The Child of Humanity</em> series with Pari Adli. Her earlier work
              includes <em>Poetry and Satire for the Avant-Garde.</em>
            </p>
            <ArrowLink href="/about">More about Jalleh</ArrowLink>
            <span className="author-byline">
              Jalleh Doty <span>AUTHOR</span>
            </span>
          </div>
        </div>
      </section>
      <section className="standalone-section wrap section" data-reveal>
        <span className="eyebrow">ALSO BY JALLEH DOTY</span>
        <div className="standalone-copy">
          <h2>
            Poetry and Satire
            <br />
            <em>for the Avant-Garde</em>
          </h2>
          <p>
            Jalleh’s earlier standalone collection. Official cover and full description to follow.
          </p>
          <ArrowLink href={`/books/${standalone.slug}`}>About the collection</ArrowLink>
        </div>
      </section>
      <section className="journal-section">
        <div className="wrap section">
          <div className="section-heading">
            <div>
              <Eyebrow>UPDATES</Eyebrow>
              <h2>News &amp; events</h2>
            </div>
          </div>
          <div className="journal-rows">
            <article>
              <span className="journal-label">News</span>
              <p>
                {articles[0]?.excerpt ??
                  'No announcements at the moment. New book updates will be posted here.'}
              </p>
              <ArrowLink href="/news">All news</ArrowLink>
            </article>
            <article>
              <span className="journal-label">Events</span>
              <p>
                {events[0]
                  ? `${events[0].title} · ${events[0].location}`
                  : 'No upcoming dates announced. Contact Jalleh about readings and speaking invitations.'}
              </p>
              <ArrowLink href="/events">View events</ArrowLink>
            </article>
          </div>
        </div>
      </section>
      <section className="contact-invitation wrap">
        <div>
          <Eyebrow>CORRESPONDENCE</Eyebrow>
          <h2>Write to Jalleh.</h2>
          <p>Reader letters, speaking invitations and signed-copy inquiries.</p>
        </div>
        <ButtonLink href="/contact">Get in touch</ButtonLink>
      </section>
    </>
  );
}
