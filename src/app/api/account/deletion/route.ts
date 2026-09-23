import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

/**
 * Request account deletion — schedules deletion in 30 days (grace period)
 * GET returns current deletion status
 * POST schedules deletion
 * DELETE cancels scheduled deletion
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const deletionAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: { deletionScheduledAt: deletionAt },
    });

    await logAudit({
      userId,
      action: "ACCOUNT_DELETION_REQUESTED",
      target: `user:${userId}`,
      metadata: { deletionAt: deletionAt.toISOString() },
    });

    return NextResponse.json({
      ok: true,
      message: "Account deletion scheduled in 30 days. You can cancel anytime before then.",
      deletionAt: deletionAt.toISOString(),
    });
  } catch (e: any) {
    console.error("[account] deletion request error:", e);
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;

    await prisma.user.update({
      where: { id: userId },
      data: { deletionScheduledAt: null },
    });

    await logAudit({
      userId,
      action: "ACCOUNT_DELETION_CANCELLED",
      target: `user:${userId}`,
    });

    return NextResponse.json({ ok: true, message: "Deletion cancelled." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

/**
 * Request data export — generates downloadable archive of user data
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true, role: true, createdAt: true,
        deletionScheduledAt: true, termsAcceptedAt: true, termsVersion: true,
        dataExportRequestedAt: true,
        creatorProfile: {
          select: {
            displayName: true, bio: true, revenueSplitPct: true, gstin: true,
            tiers: { select: { name: true, price: true } },
          },
        },
        subscriptions: {
          select: { status: true, startedAt: true, renewedAt: true, tier: { select: { name: true, price: true } } },
        },
        ppvPurchases: {
          select: { amount: true, purchasedAt: true, content: { select: { type: true, caption: true } } },
        },
      },
    });

    // Mark export as requested
    if (!user?.dataExportRequestedAt) {
      await prisma.user.update({
        where: { id: userId },
        data: { dataExportRequestedAt: new Date() },
      });
    }

    await logAudit({
      userId,
      action: "DATA_EXPORT_REQUESTED",
      target: `user:${userId}`,
    });

    return NextResponse.json({
      ok: true,
      data: {
        account: { email: user?.email, phone: user?.phone, role: user?.role, createdAt: user?.createdAt },
        profile: user?.creatorProfile,
        subscriptions: user?.subscriptions,
        purchases: user?.ppvPurchases?.map(p => ({
          amount: Number(p.amount),
          purchasedAt: p.purchasedAt,
          contentType: p.content?.type,
          caption: p.content?.caption?.slice(0, 60),
        })),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
