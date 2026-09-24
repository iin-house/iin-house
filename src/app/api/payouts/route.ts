import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { isDemoUser } from "@/lib/demo-data";
import { onPayoutRequested } from "@/lib/email-events";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  const status = searchParams.get("status");
  if (status) where.status = status;

  if (isDemoUser(session.user.id)) {
    const { getDemoPayouts } = await import("@/lib/demo-data");
    const demo = getDemoPayouts().history;
    const total = demo.length;
    const start = (page - 1) * limit;
    return NextResponse.json({ payouts: demo.slice(start, start + limit), total, page, limit });
  }

  try {
    const [payouts, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        orderBy: { requestedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { creator: { select: { displayName: true } } },
      }),
      prisma.payout.count({ where }),
    ]);

    return NextResponse.json({ payouts, total, page, limit });
  } catch {
    const { getDemoPayouts } = await import("@/lib/demo-data");
    const demo = getDemoPayouts().history;
    const total = demo.length;
    const start = (page - 1) * limit;
    return NextResponse.json({ payouts: demo.slice(start, start + limit), total, page, limit });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json() as { amount: number; periodStart?: string; periodEnd?: string };
    const { amount, periodStart, periodEnd } = body;

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No creator profile" }, { status: 400 });

    const payout = await prisma.payout.create({
      data: {
        creatorId: profile.id,
        amount: String(amount),
        currency: "INR",
        reference: `${periodStart ?? ""} → ${periodEnd ?? ""}`,
        status: "PENDING",
      },
    });

    // Notify creator via email
    const creatorEmail = (session.user as any).email;
    if (creatorEmail) {
      await onPayoutRequested(creatorEmail, payout.amount.toString()).catch(
        (e: any) => console.error("[payouts] email failed:", e.message),
      );
    }

    return NextResponse.json(payout);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
