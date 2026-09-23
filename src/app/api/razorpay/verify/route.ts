import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, creatorId, tierId, contentId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Verify signature
  const valid = await verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  try {
    if (type === "subscription" && creatorId && tierId) {
      await prisma.subscription.create({
        data: {
          subscriberId: session.user.id,
          creatorId,
          tierId,
          status: "ACTIVE",
          startedAt: new Date(),
          renewedAt: new Date(),
        },
      });
    } else if (type === "content" && contentId) {
      const post = await prisma.contentPost.findUnique({ where: { id: contentId } });
      if (post) {
        await prisma.pPVPurchase.create({
          data: {
            subscriberId: session.user.id,
            contentId,
            amount: post.ppvPrice ?? 0,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[razorpay] verification error:", e);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
