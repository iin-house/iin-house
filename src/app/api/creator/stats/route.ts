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

    const [activeSubs, monthlySubRevenue, ppvCount, ppvRevenue, totalPayouts, recentSubs, tierBreakdown] = await Promise.all([
      prisma.subscription.count({ where: { creatorId: profile.id, status: "ACTIVE" } }),
      prisma.subscriptionTier.aggregate({
        where: { creatorId: profile.id, active: true },
        _sum: { price: true },
      }),
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
        include: { subscriber: { select: { email: true, phone: true } }, tier: { select: { name: true, price: true } } },
      }),
      prisma.subscriptionTier.findMany({
        where: { creatorId: profile.id },
        include: {
          _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } },
        },
        orderBy: { price: "asc" },
      }),
    ]);

    const monthlySubTotal = Number(monthlySubRevenue._sum.price || 0) * activeSubs;
    const ppvTotal = Number(ppvRevenue._sum.amount || 0);
    const totalRevenue = ppvTotal + monthlySubTotal;
    const completedPayouts = Number(totalPayouts._sum.amount || 0);

    return NextResponse.json({
      activeSubs,
      ppvPurchases: ppvCount,
      ppvRevenue: ppvTotal,
      monthlySubRevenue: monthlySubTotal,
      totalRevenue,
      totalPayouts: completedPayouts,
      pendingPayout: Math.max(0, totalRevenue - completedPayouts),
      recentSubs: recentSubs.map((s) => ({
        email: s.subscriber.email ?? s.subscriber.phone,
        date: s.startedAt.toLocaleDateString("en-IN"),
        tier: s.tier?.name,
        tierPrice: s.tier?.price ? Number(s.tier.price) : 0,
      })),
      tierBreakdown: tierBreakdown.map(t => ({
        id: t.id,
        name: t.name,
        price: Number(t.price),
        subscribers: t._count.subscriptions,
      })),
    });
  } catch {
    return NextResponse.json(getDemoStats());
  }
}
