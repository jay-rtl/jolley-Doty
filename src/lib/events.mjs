function timestamp(value, endOfDay = false) {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value))
    throw new Error('Events require an ISO date.');
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Events require a valid date.');
  if (value.length === 10 && date.toISOString().slice(0, 10) !== value)
    throw new Error('Invalid calendar date.');
  return date.getTime() + (endOfDay && value.length === 10 ? 86_399_999 : 0);
}

// Static Pages evaluates this at build time; rebuild after calendar changes.
/** @template {{ start: string, end?: string }} T
 * @param {T[]} events
 */
export function calendarGroups(events, now = new Date()) {
  const dated = events.map((event) => ({
    event,
    start: timestamp(event.start),
    end: timestamp(event.end || event.start, true),
  }));
  return {
    upcoming: dated
      .filter(({ end }) => end >= now.getTime())
      .sort((a, b) => a.start - b.start)
      .map(({ event }) => event),
    past: dated
      .filter(({ end }) => end < now.getTime())
      .sort((a, b) => b.start - a.start)
      .map(({ event }) => event),
  };
}

export function eventDate(value) {
  timestamp(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
