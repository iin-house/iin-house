"use client";

export interface OpenCheckoutParams {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
}

let scriptLoaded = false;
let loadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (scriptLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => { scriptLoaded = true; resolve(); };
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function openRazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  name = "iin house",
  description,
  prefill,
  onSuccess,
  onFailure,
}: OpenCheckoutParams): Promise<void> {
  await loadRazorpayScript();

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    onFailure?.(new Error("Razorpay key not configured"));
    return;
  }

  const options: any = {
    key: keyId,
    order_id: orderId,
    amount,
    currency,
    name,
    description: description || "Subscription payment",
    prefill: prefill || {},
    handler: onSuccess,
  };

  try {
    // @ts-ignore - Razorpay loaded from CDN
    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on("payment.failed", onFailure);
  } catch (e: any) {
    onFailure?.(e);
  }
}
