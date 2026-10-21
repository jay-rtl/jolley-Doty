import { PageHeading, EmptyState, ArrowLink } from '@/components/ui';
import { events } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
import { calendarGroups, eventDate } from '@/lib/events.mjs';
export const metadata = pageMetadata(
  'Events & Conversations',
  'Find confirmed readings, author appearances and speaking events with Jalleh Doty.',
  '/events',
);
export default function Events() {
  const groups = calendarGroups(events);
  return (
    <>
      <PageHeading label="MEET BETWEEN THE PAGES" title="Events & conversations.">
        <p>Readings, gatherings, and opportunities to connect.</p>
      </PageHeading>
      <section className="wrap section">
        {events.length ? (
          (['upcoming', 'past'] as const).map(
            (group) =>
              groups[group].length > 0 && (
                <section className="event-group" key={group} aria-labelledby={`events-${group}`}>
                  <h2 id={`events-${group}`}>
                    {group === 'upcoming' ? 'Upcoming conversations.' : 'Past gatherings.'}
                  </h2>
                  {groups[group].map((event) => (
                    <article className="news-card" key={`${event.title}-${event.start}`}>
                      <time className="event-date" dateTime={event.start}>
                        {eventDate(event.start)}
                      </time>
                      <h3>{event.title}</h3>
                      <p>{event.location}</p>
                      {event.url && (
                        <a className="arrow-link" href={event.url} rel="noopener noreferrer">
                          Event details ↗
                        </a>
                      )}
                    </article>
                  ))}
                </section>
              ),
          )
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
