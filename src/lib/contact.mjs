import { z } from 'zod';
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter at least 2 characters.')
    .max(100, 'Please keep your name under 100 characters.'),
  email: z.email('Please enter a valid email address.').max(254),
  subject: z.enum(['general', 'signed-copy', 'speaking', 'media', 'reader-review']),
  message: z
    .string()
    .trim()
    .min(20, 'Please write at least 20 characters.')
    .max(5000, 'Please keep your message under 5,000 characters.'),
  consent: z.literal(true, { error: 'Please acknowledge how your inquiry will be handled.' }),
  website: z.string().max(200).optional().default(''),
});
export function validateContact(input) {
  return contactSchema.safeParse(input);
}
export function contactReady(env = process.env) {
  return Boolean(
    env.RESEND_API_KEY &&
    env.CONTACT_FROM_EMAIL &&
    env.CONTACT_TO_EMAIL &&
    env.CONTACT_HASH_SECRET &&
    env.UPSTASH_REDIS_REST_URL &&
    env.UPSTASH_REDIS_REST_TOKEN &&
    env.CONTACT_PRIVACY_APPROVED === 'true',
  );
}
export function emailBody(data) {
  return [
    'Name: ' + data.name,
    'Reply email: ' + data.email,
    'Subject: ' + data.subject,
    '',
    data.message,
  ].join('\n');
}
