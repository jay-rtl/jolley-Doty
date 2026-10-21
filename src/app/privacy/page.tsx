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
            Draft for owner review. The operator’s jurisdiction, contact information and inbox
            retention decisions still require confirmation.
          </p>
          <h2>Browsing this website</h2>
          <p>
            The application does not add analytics, advertising pixels or optional tracking cookies.
            Fonts and images are served with the site on GitHub Pages. The hosting provider may
            process technical request data under its own policies.
          </p>
          <h2>Contact inquiries</h2>
          <p>
            Contact is currently unavailable while the recipient address is being confirmed. No
            inquiry form is active until that address is supplied.
          </p>
          <p>
            Once enabled, the form prepares an email draft in your browser. Your name, reply email
            address, inquiry type and message are not submitted to or stored by this website.
            Selecting “Open email app” passes the draft to your configured email app. You must
            review and send the message yourself; opening a draft does not send it. “Copy email
            details” copies the draft to your clipboard only when selected.
          </p>
          <h2>Your email service</h2>
          <p>
            After you choose to send, your email service and the author’s inbox process the email
            under their respective policies. Inbox access and retention must be confirmed by the
            owner. This website cannot confirm that your email app opened or that an email was
            delivered. An email app and a confirmed recipient address are required for the draft
            link.
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
