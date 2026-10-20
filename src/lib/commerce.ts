// Inactive configuration. No orders or payments are accepted by this release.
// Implement server checkout, signed webhooks, tax, fulfillment and refund flows
// only after owner approval. Amounts must be in minor currency units.
export type ShippingRate = {
  id: string;
  label: string;
  countries: string[];
  amountMinor: number;
  currency: string;
};
export type BundlePromotion = {
  bookSlugs: string[];
  approvedDiscountPercent: number;
  startsAt?: string;
  endsAt?: string;
};
export const commerce: {
  enabled: false;
  merchant: 'stripe' | 'paypal' | null;
  shippingWorkflow: 'manual' | null;
  shippingRates: ShippingRate[];
  promotions: BundlePromotion[];
} = { enabled: false, merchant: null, shippingWorkflow: null, shippingRates: [], promotions: [] };
