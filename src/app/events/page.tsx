import { PageHeading, EmptyState, ArrowLink } from '@/components/ui';
import { events } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Events & Conversations',
  'Find confirmed readings, author appearances and speaking events with Jalleh Doty.',
  '/events',
);
export default function Events() {
  return (
    <>
      <PageHeading label="MEET BETWEEN THE PAGES" title="Events & conversations.">
        <p>Readings, gatherings, and opportunities to connect.</p>
      </PageHeading>
      <section className="wrap section">
        {events.length ? (
          events.map((event) => (
            <article className="news-card" key={event.title}>
              <h2>{event.title}</h2>
              <p>
                <time dateTime={event.start}>{event.start}</time> · {event.location}
              </p>
              {event.url && (
                <a className="arrow-link" href={event.url} rel="noopener noreferrer">
                  Event details ↗
                </a>
              )}
            </article>
          ))
        ) : (
          <EmptyState label="THE CALENDAR" title="A future meeting of minds.">
            There are no announced events at present. Confirmed dates and details will be posted
            here when available.
          </EmptyState>
        )}
        <ArrowLink href="/contact?subject=speaking">Invite Jalleh to speak</ArrowLink>
      </section>
    </>
  );
}
