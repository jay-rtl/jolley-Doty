import { PageHeading } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Privacy Notice',
  'Information about data handling and the planned contact service on Jalleh Doty’s author website.',
  '/privacy',
);
export default function Privacy() {
  return (
    <>
      <PageHeading label="YOUR INFORMATION" title="Privacy notice." />
      <div className="wrap">
        <article className="prose">
          <p className="notice">
            Draft for owner review. The operator’s jurisdiction, contact information, retention
            period and service-provider agreements must be confirmed before contact submissions are
            enabled or the site launches.
          </p>
          <h2>Browsing this website</h2>
          <p>
            The application does not add analytics, advertising pixels or optional tracking cookies.
            Fonts and images are served locally. The eventual hosting provider may process technical
            request data; its policies and log retention must be confirmed before launch.
          </p>
          <h2>Contact inquiries</h2>
          <p>
            The contact service is currently unavailable. When configured, the form will send your
            name, email address, inquiry type and message through Resend to the author’s designated
            inbox. The application does not store inquiry content in its own database. Access and
            retention in the inbox and email service must be set by the owner.
          </p>
          <h2>Spam prevention</h2>
          <p>
            The planned service uses a hidden spam field, validation and request limits. For rate
            limiting, an IP-derived keyed hash is held in Upstash Redis for ten minutes. The
            deployment must provide a trusted client IP address. Raw IP addresses are not stored by
            the application’s rate limiter.
          </p>
          <h2>Reader reviews</h2>
          <p>
            Submitted reviews remain private pending moderation. Permission must be obtained before
            publishing a reader’s words or identifying information.
          </p>
          <h2>Retailers &amp; payments</h2>
          <p>
            Purchases are not enabled. Once verified retailer links are added, purchases will be
            handled by those retailers under their own terms. Direct payment services require
            separate setup and disclosures before activation.
          </p>
          <h2>Decisions required before launch</h2>
          <p>
            The owner must approve a privacy contact, operating jurisdiction, data-retention period,
            provider choices, applicable rights process and final notice. This draft describes the
            implementation; it is not a legal compliance certification.
          </p>
        </article>
      </div>
    </>
  );
}
