import Image from 'next/image';
import { PageHeading, ArrowLink, Eyebrow } from '@/components/ui';
import { bio } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
import { assetPath } from '@/lib/paths';
export const metadata = pageMetadata(
  'About the Author',
  'Meet Jalleh Doty, author of The Child of Humanity series with Pari Adli and Poetry and Satire for the Avant-Garde.',
  '/about',
);
export default function About() {
  return (
    <>
      <PageHeading label="ABOUT THE AUTHOR" title="Jalleh Doty.">
        <p>Jalleh Doty · Author &amp; storyteller</p>
      </PageHeading>
      <section className="wrap section about-page">
        <div className="author-grid">
          <div className="author-image">
            <Image
              src={assetPath('/images/author.webp')}
              alt="Official author portrait of Jalleh Doty"
              width={900}
              height={1350}
              priority
              sizes="(max-width: 760px) 90vw, 450px"
            />
          </div>
          <div className="author-copy">
            <Eyebrow>WRITING FOR THE PEOPLE</Eyebrow>
            <h2>Writing for the people.</h2>
            <p>{bio}</p>
            <p>
              Her ambition is to bring the first book of her series to a wider readership, and to
              invite readers into the worlds she has spent years imagining.
            </p>
            <p className="author-signature">Jalleh Doty</p>
            <ArrowLink href="/books">Explore the writing</ArrowLink>
          </div>
        </div>
      </section>
      <section className="wrap quote-feature" aria-label="From Jalleh">
        <blockquote className="author-quote">
          “Retain an open mind in the realm of possibilities.”<cite>JALLEH DOTY</cite>
        </blockquote>
      </section>
      <div className="contact-invitation wrap">
        <div>
          <Eyebrow>A NOTE TO THE AUTHOR</Eyebrow>
          <h2>
            Words start <em>conversations.</em>
          </h2>
          <p>For reader correspondence, media and speaking inquiries.</p>
        </div>
        <ArrowLink href="/contact">Get in touch</ArrowLink>
      </div>
    </>
  );
}
