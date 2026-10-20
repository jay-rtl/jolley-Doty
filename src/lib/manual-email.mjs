import { z } from 'zod';
import { validateContact } from './contact.mjs';

const labels = {
  general: 'General correspondence',
  'signed-copy': 'Signed copy inquiry',
  speaking: 'Speaking and event invitation',
  media: 'Media and press inquiry',
  'reader-review': 'Reader review submission',
};
export function recipientAddress(value) {
  const result = z.email().safeParse(typeof value === 'string' ? value.trim() : '');
  return result.success ? result.data : null;
}
export function manualEmailDraft(input, recipient) {
  const address = recipientAddress(recipient);
  const result = validateContact(input);
  if (!address || !result.success || result.data.website) return null;
  const data = result.data;
  const subject = `${labels[data.subject]} - Jalleh Doty website`;
  const body = [
    data.message,
    '',
    `Name: ${data.name}`,
    `Reply email: ${data.email}`,
    `Inquiry: ${labels[data.subject]}`,
  ]
    .join('\r\n')
    .replace(/\r\n|\r|\n/g, '\r\n');
  const to = encodeURIComponent(address).replace(/%40/g, '@');
  return {
    to: address,
    subject,
    body,
    href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    copyText: `To: ${address}\nSubject: ${subject}\n\n${body}`,
  };
}
