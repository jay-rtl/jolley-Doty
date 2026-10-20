import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, contactReady, emailBody } from '../src/lib/contact.mjs';
const valid = {
  name: 'A Reader',
  email: 'reader@example.org',
  subject: 'general',
  message: 'I would love to learn more about your books.',
  consent: true,
  website: '',
};
test('accepts a valid reader inquiry and trims whitespace', () => {
  const result = validateContact({ ...valid, name: '  A Reader  ' });
  assert.equal(result.success, true);
  assert.equal(result.data.name, 'A Reader');
});
test('rejects invalid email addresses and short messages', () => {
  const result = validateContact({ ...valid, email: 'not an email', message: 'short' });
  assert.equal(result.success, false);
  assert.ok(result.error.flatten().fieldErrors.email);
  assert.ok(result.error.flatten().fieldErrors.message);
});
test('requires a privacy acknowledgment and a permitted inquiry type', () => {
  assert.equal(validateContact({ ...valid, consent: false }).success, false);
  assert.equal(validateContact({ ...valid, subject: 'arbitrary' }).success, false);
});
test('rejects oversized content', () => {
  assert.equal(validateContact({ ...valid, message: 'x'.repeat(5001) }).success, false);
  assert.equal(validateContact({ ...valid, name: 'x'.repeat(101) }).success, false);
});
test('delivery stays off until all providers and privacy approval are configured', () => {
  assert.equal(contactReady({}), false);
  const configured = {
    RESEND_API_KEY: 'test',
    CONTACT_FROM_EMAIL: 'sender@example.org',
    CONTACT_TO_EMAIL: 'owner@example.org',
    CONTACT_HASH_SECRET: 'test-secret',
    UPSTASH_REDIS_REST_URL: 'https://redis.example.org',
    UPSTASH_REDIS_REST_TOKEN: 'test',
    CONTACT_PRIVACY_APPROVED: 'false',
  };
  assert.equal(contactReady(configured), false);
  assert.equal(contactReady({ ...configured, CONTACT_PRIVACY_APPROVED: 'true' }), true);
});
test('email body uses plain text and preserves correspondence', () => {
  assert.ok(emailBody(valid).includes(valid.message));
  assert.ok(emailBody(valid).includes(valid.email));
});
