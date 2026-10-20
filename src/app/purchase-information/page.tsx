import { PageHeading, ArrowLink } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Purchase Information',
  'Book purchase availability, retailer referrals and signed-copy arrangements for Jalleh Doty.',
  '/purchase-information',
);
export default function PurchaseInformation() {
  return (
    <>
      <PageHeading label="BOOKS & ARRANGEMENTS" title="Purchase information." />
      <div className="wrap">
        <article className="prose">
          <h2>Retailer purchases</h2>
          <p>
            This website features paperback editions only. Ingram purchase links will be enabled
            once the author supplies the correct URL for each book. Orders placed through those
            links will be handled externally, including payment and fulfillment.
          </p>
          <h2>Direct purchases</h2>
          <p>
            Direct checkout is not available. Stripe and PayPal can be integrated once merchant
            accounts, products, currency, prices, tax treatment, fulfillment, shipping rates and
            return terms have been approved. No preorders are offered.
          </p>
          <h2>Signed copies by arrangement</h2>
          <p>
            You may inquire about a signed copy. Availability and shipping arrangements must be
            confirmed with the author before any payment. An inquiry is not an order, reservation or
            guarantee of availability.
          </p>
          <ArrowLink href="/contact?subject=signed-copy">Ask about a signed copy</ArrowLink>
          <h2>Shipping, returns &amp; promotions</h2>
          <p>
            No shipping charges, return terms, bundles or promotional prices are currently offered
            on this site. These will be published after owner approval and before direct sales are
            enabled.
          </p>
        </article>
      </div>
    </>
  );
}
