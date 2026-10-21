import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarGroups, eventDate } from '../src/lib/events.mjs';

test('calendar keeps ongoing and all-day events upcoming, sorted by start; past events newest first', () => {
  const old = { title: 'Older', start: '2026-09-01' };
  const recent = { title: 'Recent', start: '2026-10-19' };
  const today = { title: 'All day', start: '2026-10-20' };
  const ongoing = { title: 'Ongoing', start: '2026-10-18', end: '2026-10-21' };
  const later = { title: 'Later', start: '2026-11-01' };
  assert.deepEqual(
    calendarGroups([later, old, today, recent, ongoing], new Date('2026-10-20T18:00:00Z')),
    {
      upcoming: [ongoing, today, later],
      past: [recent, old],
    },
  );
});

test('calendar preserves empty states and rejects dates that cannot be published', () => {
  assert.deepEqual(calendarGroups([]), { upcoming: [], past: [] });
  assert.throws(() => calendarGroups([{ start: 'not-a-date' }]));
  assert.throws(() => calendarGroups([{ start: '2026-02-30' }]));
  assert.equal(eventDate('2026-10-20'), 'October 20, 2026');
});
