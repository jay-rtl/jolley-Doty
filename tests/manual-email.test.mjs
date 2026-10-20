import { test } from 'node:test';
import assert from 'node:assert/strict';
import { manualEmailDraft, recipientAddress } from '../src/lib/manual-email.mjs';
const input = {
  name: 'A Reader',
  email: 'reader@example.org',
  subject: 'signed-copy',
  message: 'Could I arrange a signed copy of Last Savior?',
  consent: true,
  website: '',
};
test('manual draft preserves the verified recipient, subject and plain-text inquiry', () => {
  const draft = manualEmailDraft(input, 'author@example.test');
  assert.equal(draft.to, 'author@example.test');
  const url = new URL(draft.href);
  assert.equal(decodeURIComponent(url.pathname), 'author@example.test');
  assert.equal(url.searchParams.get('subject'), 'Signed copy inquiry - Jalleh Doty website');
  assert.ok(url.searchParams.get('body').includes(input.message));
  assert.ok(draft.copyText.includes(input.email));
});
test('missing, invalid and injected recipients never generate email links', () => {
  for (const to of [
    '',
    null,
    undefined,
    'not email',
    'author@example.test?bcc=other@example.org',
    'author@example.test\r\nBcc: other@example.org',
  ]) {
    assert.equal(recipientAddress(to), null);
    assert.equal(manualEmailDraft(input, to), null);
  }
});
test('user text cannot create BCC, CC or subject headers', () => {
  const draft = manualEmailDraft(
    {
      ...input,
      message: 'A question &bcc=other@example.org\nsubject=Changed\n<script>alert(1)</script>',
    },
    'author@example.test',
  );
  const url = new URL(draft.href);
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.ok(url.searchParams.get('body').includes('<script>'));
  assert.equal(url.searchParams.has('bcc'), false);
});
test('invalid form data and missing acknowledgment do not produce a draft', () => {
  assert.equal(manualEmailDraft({ ...input, message: 'short' }, 'author@example.test'), null);
  assert.equal(manualEmailDraft({ ...input, consent: false }, 'author@example.test'), null);
  assert.equal(manualEmailDraft({ ...input, email: 'invalid' }, 'author@example.test'), null);
});
test('Unicode, ampersands, plus and question marks round-trip without corrupting the message', () => {
  const message = 'Kumusta Jalleh — a question about humanity & hope + possibility? Salamat!';
  const draft = manualEmailDraft({ ...input, message }, 'author+books@example.test');
  assert.equal(decodeURIComponent(new URL(draft.href).pathname), 'author+books@example.test');
  assert.ok(new URL(draft.href).searchParams.get('body').startsWith(message));
  assert.ok(draft.body.includes('\r\n'));
});
