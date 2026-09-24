import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { onPayoutProcessed } from "@/lib/email-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CRON_SECRET = process.env.CRON_PAYOUT_SECRET ?? process.env.CRON_SECRET;
const BATCH_SIZE = 50;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "ADMIN";

    const authHeader = req.headers.get("authorization");
    const isCron = authHeader === `Bearer ${CRON_SECRET}`;

    if (!isAdmin && !isCron) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pending = await prisma.payout.findMany({
      where: { status: "PENDING" },
      take: BATCH_SIZE,
      include: {
        creator: {
          include: { user: { select: { email: true } } },
        },
      },
      orderBy: { requestedAt: "asc" },
    });

    if (pending.length === 0) {
      return NextResponse.json({ processed: 0, totalAmount: "0" });
    }

    const now = new Date();
    let totalAmount = 0;

    for (const payout of pending) {
      await prisma.payout.update({
        where: { id: payout.id },
        data: { status: "COMPLETED", processedAt: now },
      });

      totalAmount += Number(payout.amount);

      const creatorEmail = payout.creator?.user?.email;
      if (creatorEmail) {
        await onPayoutProcessed(
          creatorEmail,
          payout.amount.toString(),
          payout.reference ?? now.toLocaleDateString(),
        ).catch((e: any) =>
          console.error("[cron] payout email failed:", e.message),
        );
      }
    }

    return NextResponse.json({
      processed: pending.length,
      totalAmount: totalAmount.toFixed(2),
    });
  } catch (e: any) {
    console.error("[cron] process-payouts error:", e);
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
