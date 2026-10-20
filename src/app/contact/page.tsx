import { PageHeading, Eyebrow } from '@/components/ui';
import { ContactForm, ContactInquiry } from '@/components/contact-form';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site';
import { contactEmail } from '@/lib/content';
import { recipientAddress } from '@/lib/manual-email.mjs';
export const metadata = pageMetadata(
  'Contact',
  'Contact Jalleh Doty for reader correspondence, signed-copy inquiries, media and speaking invitations.',
  '/contact',
);
export default function Contact() {
  const recipient = recipientAddress(contactEmail);
  return (
    <>
      <PageHeading label="CORRESPONDENCE" title="Contact Jalleh.">
        <p>Reader letters, thoughtful questions, and invitations are welcome.</p>
      </PageHeading>
      <div className="wrap contact-grid">
        <aside className="contact-info">
          <Eyebrow>GET IN TOUCH</Eyebrow>
          <h2>Reader letters &amp; inquiries.</h2>
          <p>Use this space for general correspondence, event invitations or media requests.</p>
          {recipient && (
            <p className="contact-recipient">
              Email:{' '}
              <a href={`mailto:${encodeURIComponent(recipient).replace(/%40/g, '@')}`}>
                {recipient}
              </a>
            </p>
          )}
          <h3>Something personal.</h3>
          <p>
            Interested in a signed copy? Please mention the book and your destination country.
            Availability and shipping arrangements must be confirmed with the author before payment.
          </p>
          <h3>A note from a reader.</h3>
          <p>
            Reader reviews may be submitted here. Reviews are privately reviewed before any
            publication, and permission will be requested before your words or name are shared.
          </p>
          <p className="inline-note">
            Please don’t send a full postal address or payment information in your first message.
          </p>
        </aside>
        <Suspense
          fallback={
            <ContactForm ready={Boolean(recipient)} initialSubject="general" initialBook="" />
          }
        >
          <ContactInquiry />
        </Suspense>
      </div>
    </>
  );
}
