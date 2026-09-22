/**
 * Payment service with Stripe integration
 */

import Stripe from "stripe";

let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
  }
  return stripe;
}

export interface PaymentResult {
  success: boolean;
  clientSecret?: string;
  transactionId?: string;
  error?: string;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

export async function createCheckoutSession(params: {
  priceId: string;
  userId: string;
  creatorId: string;
  tierId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<PaymentResult> {
  const stripeClient = getStripe();
  if (!stripeClient) {
    return { success: false, error: "Payment provider not configured" };
  }

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: params.priceId, quantity: 1 }],
      client_reference_id: params.userId,
      metadata: { creatorId: params.creatorId, tierId: params.tierId },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    } as any);

    return { success: true, clientSecret: session.client_secret ?? undefined, transactionId: session.id };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Payment failed" };
  }
}

export async function createPPVCheckoutSession(params: {
  amount: number;
  currency: string;
  contentId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<PaymentResult> {
  const stripeClient = getStripe();
  if (!stripeClient) {
    return { success: false, error: "Payment provider not configured" };
  }

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: { name: "Pay-per-view content" },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      client_reference_id: params.userId,
      metadata: { contentId: params.contentId },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    } as any);

    return { success: true, clientSecret: session.client_secret ?? undefined, transactionId: session.id };
  } catch (e: any) {
    return { success: false, error: e.message ?? "Payment failed" };
  }
}

export async function verifyWebhook(body: string, signature: string): Promise<Stripe.Event | null> {
  const stripeClient = getStripe();
  if (!stripeClient || !process.env.STRIPE_WEBHOOK_SECRET) return null;

  try {
    return stripeClient.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return null;
  }
}

export function getPaymentClient() {
  return getStripe();
}
