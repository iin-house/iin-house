import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { prisma } from "@/lib/db";
import { createRazorpayRefund } from "@/lib/razorpay";
import { logAudit } from "@/lib/audit";

/**
 * Issue a refund for a PPV purchase
 * Only admins and the purchasing user (within 48h) can refund
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { purchaseId, reason } = body;
    if (!purchaseId) {
      return NextResponse.json({ error: "Missing purchaseId" }, { status: 400 });
    }

    const purchase = await prisma.pPVPurchase.findUnique({
      where: { id: purchaseId },
      include: { content: { select: { ppvPrice: true, creatorId: true } } },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    const isAdmin = (session.user as any).role === "ADMIN";
    const isOwner = purchase.subscriberId === session.user.id;
    const within48h = (Date.now() - new Date(purchase.purchasedAt).getTime()) < 48 * 60 * 60 * 1000;

    if (!isAdmin && !(isOwner && within48h)) {
      return NextResponse.json({ error: "Not authorized to refund this purchase" }, { status: 403 });
    }

    if (purchase.refunded) {
      return NextResponse.json({ error: "Already refunded" }, { status: 409 });
    }

    // Create Razorpay refund
    const amountPaise = Math.round(Number(purchase.amount) * 100);
    const refund = await createRazorpayRefund(purchase.paymentId || "", amountPaise, reason);

    if (!refund) {
      return NextResponse.json({ error: "Refund failed with payment provider" }, { status: 500 });
    }

    // Record refund
    await prisma.pPVPurchase.update({
      where: { id: purchaseId },
      data: { refunded: true, refundedAt: new Date() },
    });

    await logAudit({
      userId: session.user.id,
      action: "REFUND_ISSUED",
      target: `purchase:${purchaseId}`,
      metadata: { amount: Number(purchase.amount), reason, refundId: refund.id },
    });

    return NextResponse.json({ ok: true, refundId: refund.id, amount: Number(purchase.amount) });
  } catch (e: any) {
    console.error("[refund] error:", e);
    return NextResponse.json({ error: e.message ?? "Refund failed" }, { status: 500 });
  }
}

/**
 * List refunds (admin only)
 */
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(_req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const refunds = await prisma.pPVPurchase.findMany({
    where: { refunded: true },
    include: {
      content: { select: { caption: true } },
      subscriber: { select: { email: true } },
    },
    orderBy: { refundedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.pPVPurchase.count({ where: { refunded: true } });

  return NextResponse.json({
    refunds: refunds.map((r) => ({
      id: r.id,
      amount: Number(r.amount),
      refundedAt: r.refundedAt,
      contentCaption: r.content?.caption?.slice(0, 60),
      subscriberEmail: r.subscriber?.email,
    })),
    total,
    page,
    limit,
  });
}
