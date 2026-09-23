/**
 * Razorpay payment integration for Indian market (UPI, cards, netbanking, wallets)
 */

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface CreateOrderParams {
  amount: number; // in rupees (paise calculated internally)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

let razorpayKeyId: string | null = null;
let razorpayKeySecret: string | null = null;

function getCredentials(): { keyId: string; keySecret: string } | null {
  if (!razorpayKeyId) {
    razorpayKeyId = process.env.RAZORPAY_KEY_ID ?? null;
    razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET ?? null;
  }
  if (!razorpayKeyId || !razorpayKeySecret) return null;
  return { keyId: razorpayKeyId, keySecret: razorpayKeySecret };
}

export function getRazorpayKeyId(): string | null {
  return process.env.RAZORPAY_KEY_ID ?? null;
}

/**
 * Create a Razorpay order for subscription or one-time payment
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrder | null> {
  const creds = getCredentials();
  if (!creds) return null;

  const amountPaise = Math.round(params.amount * 100);

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: params.currency ?? "INR",
        receipt: params.receipt ?? `order_${Date.now()}`,
        notes: params.notes ?? {},
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("[razorpay] Order creation failed:", err);
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      status: data.status,
    };
  } catch (e) {
    console.error("[razorpay] Order creation error:", e);
    return null;
  }
}

/**
 * Verify a Razorpay payment signature
 * Uses HMAC-SHA256 of `${orderId}|${paymentId}` with the key secret
 */
export async function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): Promise<boolean> {
  const creds = getCredentials();
  if (!creds) return false;

  try {
    const { createHmac } = await import("crypto");
    const hmac = createHmac("sha256", creds.keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const computed = hmac.digest("hex");
    return computed === signature;
  } catch {
    return false;
  }
}

/**
 * Fetch a Razorpay payment by ID
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<any> {
  const creds = getCredentials();
  if (!creds) return null;

  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function isRazorpayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}
