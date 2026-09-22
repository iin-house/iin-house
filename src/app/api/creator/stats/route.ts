import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { isDemoUser, getDemoStats } from "@/lib/demo-data";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const isDemo = isDemoUser(session.user.id);
  if (isDemo) return NextResponse.json(getDemoStats());

  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No creator profile" }, { status: 404 });

    const creatorContentIds = await prisma.contentPost.findMany({
      where: { creatorId: profile.id },
      select: { id: true },
    });
    const contentIdList = creatorContentIds.map((c) => c.id);

    const [activeSubs, ppvCount, ppvRevenue, totalPayouts, recentSubs] = await Promise.all([
      prisma.subscription.count({ where: { creatorId: profile.id, status: "ACTIVE" } }),
      prisma.pPVPurchase.count({ where: { contentId: { in: contentIdList } } }),
      prisma.pPVPurchase.aggregate({
        where: { contentId: { in: contentIdList } },
        _sum: { amount: true },
      }),
      prisma.payout.aggregate({
        where: { creatorId: profile.id, status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.subscription.findMany({
        where: { creatorId: profile.id },
        orderBy: { startedAt: "desc" },
        take: 5,
        include: { subscriber: { select: { email: true, phone: true } } },
      }),
    ]);

    return NextResponse.json({
      activeSubs: activeSubs,
      ppvPurchases: ppvCount,
      ppvRevenue: Number(ppvRevenue._sum.amount || 0),
      totalPayouts: Number(totalPayouts._sum.amount || 0),
      totalRevenue: Number(ppvRevenue._sum.amount || 0) + Number(totalPayouts._sum.amount || 0),
      recentSubs: recentSubs.map((s) => ({
        email: s.subscriber.email ?? s.subscriber.phone,
        date: s.startedAt.toLocaleDateString(),
      })),
    });
  } catch {
    return NextResponse.json(getDemoStats());
  }
}
