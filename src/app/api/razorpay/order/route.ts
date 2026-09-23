import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { createRazorpayOrder } from "@/lib/razorpay";
import { rateLimit, limitSubscriptionCreate, limitMediaUpload } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, amount, creatorId, tierId, contentId } = body;

  if (!type || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Rate limit
  const limit = type === "content"
    ? await limitMediaUpload(session.user.id)
    : await limitSubscriptionCreate(session.user.id);
  if (!limit.success) {
    return NextResponse.json({ error: `Too many requests. Try again in ${Math.ceil((limit.retryAfter ?? 60) / 1000)}s.` }, { status: 429 });
  }

  const order = await createRazorpayOrder({
    amount,
    currency: "INR",
    receipt: `${type}_${session.user.id}_${Date.now()}`,
    notes: {
      userId: session.user.id,
      type,
      ...(creatorId && { creatorId }),
      ...(tierId && { tierId }),
      ...(contentId && { contentId }),
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
