import Image from 'next/image';
import Link from 'next/link';
import { ArrowLink, BookCover, ButtonLink, Eyebrow } from '@/components/ui';
import { series, standalone, bio, articles, events } from '@/lib/content';
import { pageMetadata, productionUrl } from '@/lib/site';
import { assetPath } from '@/lib/paths';
import { BookExhibition } from '@/components/book-exhibition';
import { calendarGroups } from '@/lib/events.mjs';

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
  const nextEvent = calendarGroups(events).upcoming[0];
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
          <div className="hero-masthead">
            <div className="hero-edition">
              <Eyebrow>THE WRITING OF</Eyebrow>
              <span>AUTHOR &amp; STORYTELLER</span>
            </div>
            <h1 aria-label="Jalleh Doty">
              <span className="title-clip">
                <span className="title-word">Jalleh</span>
              </span>{' '}
              <span className="title-clip">
                <span className="title-word title-word-italic">Doty.</span>
              </span>
            </h1>
          </div>
          <div className="hero-body">
            <div className="hero-copy">
              <p className="hero-tagline">
                “Retain an open mind
                <br /> in the realm of
                <br />
                <em>possibilities.</em>”
              </p>
              <p className="hero-description">
                Explore <em>The Child of Humanity</em>, a series written with Pari Adli, and the
                earlier collection <em>Poetry and Satire for the Avant-Garde.</em>
              </p>
              <div className="hero-actions">
                <ButtonLink href="#books">Discover the books</ButtonLink>
                <ArrowLink href="/about">Meet Jalleh</ArrowLink>
              </div>
              <div className="hero-motion-controls" data-intro-controls />
            </div>
            <div className="hero-feature">
              <div className="hero-feature-topline">
                <span>THE CHILD OF HUMANITY</span>
                <span>BOOKS I — III</span>
              </div>
              <div className="hero-stage">
                <div className="hero-companion hero-companion-three" aria-hidden="true">
                  <BookCover book={series[2]} priority />
                </div>
                <div className="hero-companion hero-companion-two" aria-hidden="true">
                  <BookCover book={series[1]} priority />
                </div>
                <Link
                  prefetch={false}
                  href={`/books/${series[0].slug}`}
                  className="hero-cover-link"
                  aria-label="Discover Last Savior, Book 1"
                >
                  <BookCover book={series[0]} priority />
                </Link>
              </div>
              <div className="hero-feature-caption">
                <span>JALLEH DOTY &amp; PARI ADLI</span>
                <ArrowLink href={`/books/${series[0].slug}`}>Begin with Last Savior</ArrowLink>
              </div>
            </div>
          </div>
          <div className="hero-colophon">
            <span>FICTION · POETRY · SATIRE</span>
            <a className="hero-scroll-note" href="#books">
              <span className="scroll-track" aria-hidden="true">
                <span />
              </span>
              <span>EXPLORE THE WRITING</span>
            </a>
          </div>
        </div>
      </section>
      <section className="section wrap series-section" id="books">
        <div className="series-rule" aria-hidden="true" />
        <div className="section-heading">
          <div>
            <Eyebrow>THE COLLECTED SERIES</Eyebrow>
            <h2>
              The Child of <em>Humanity.</em>
            </h2>
          </div>
          <p className="section-heading-description">
            By Jalleh Doty &amp; Pari Adli.
            <br />
            Paperback editions.
          </p>
        </div>
        <BookExhibition />
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
            <span className="portrait-caption">JALLEH DOTY · AUTHOR &amp; STORYTELLER</span>
          </div>
          <div className="author-copy" data-reveal>
            <Eyebrow>ABOUT THE AUTHOR</Eyebrow>
            <h2>
              Writing for
              <br />
              <em>the people.</em>
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
            An earlier standalone collection by Jalleh Doty, beyond The Child of Humanity series.
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
                {nextEvent
                  ? `${nextEvent.title} · ${nextEvent.location}`
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
