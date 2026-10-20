import { PageHeading, EmptyState, ArrowLink } from '@/components/ui';
import { media } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Media Room',
  'Official videos, author conversations and media inquiries for Jalleh Doty.',
  '/media',
);
export default function Media() {
  return (
    <>
      <PageHeading label="BEYOND THE WRITTEN WORD" title="The media room.">
        <p>A space for book trailers, interviews, and author conversations.</p>
      </PageHeading>
      <section className="wrap section">
        {media.length ? (
          media.map((item) => (
            <article key={item.src}>
              <h2>{item.title}</h2>
              <video className="media-video" controls preload="none" poster={item.poster}>
                <source src={item.src} />
                <track kind="captions" src={item.captions} srcLang="en" label="English" default />
              </video>
            </article>
          ))
        ) : (
          <EmptyState label="WATCH & LISTEN" title="More stories to be shared.">
            No official videos have been supplied yet. Book trailers and author conversations will
            appear here when available.
          </EmptyState>
        )}
        <h2>Press &amp; speaking</h2>
        <p>
          Approved media downloads will be available here in future. For now, please inquire about
          interviews or press materials.
        </p>
        <ArrowLink href="/contact?subject=media">Make a media inquiry</ArrowLink>
      </section>
    </>
  );
}
