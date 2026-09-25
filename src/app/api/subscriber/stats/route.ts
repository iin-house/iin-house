import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const [activeSubs, allCreators, recentPurchases, recentSubs] = await Promise.all([
    prisma.subscription.findMany({
      where: { subscriberId: userId, status: "ACTIVE" },
      include: {
        tier: true,
        creator: {
          include: {
            posts: { where: { publishedAt: { not: null } }, select: { id: true } },
            _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } },
          },
        },
      },
      orderBy: { startedAt: "desc" },
    }),
    prisma.creatorProfile.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.pPVPurchase.findMany({
      where: { subscriberId: userId },
      include: { content: { include: { creator: { select: { displayName: true, userId: true } } } } },
      orderBy: { purchasedAt: "desc" },
      take: 5,
    }),
    prisma.subscription.findMany({
      where: { subscriberId: userId },
      include: { tier: true, creator: { select: { displayName: true, userId: true } } },
      orderBy: { startedAt: "desc" },
      take: 5,
    }),
  ]);

  const totalCreators = activeSubs.length;
  const totalViews = activeSubs.reduce((sum, s) => sum + (s.creator.posts?.length ?? 0), 0);

  const topCreators = activeSubs.slice(0, 5).map(s => ({
    id: s.creator.id,
    displayName: s.creator.displayName,
    postCount: s.creator.posts?.length ?? 0,
    subCount: s.creator._count?.subscriptions ?? 0,
  }));

  const recentActivity = [
    ...recentPurchases.map(p => ({
      icon: "🔓",
      title: `Unlocked: ${p.content.caption?.slice(0, 40) ?? "Premium content"}`,
      date: p.purchasedAt,
    })),
    ...recentSubs.map(s => ({
      icon: "🔄",
      title: `Subscribed to ${s.creator.displayName}`,
      date: s.startedAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return NextResponse.json({
    totalCreators,
    totalViews,
    topCreators,
    recentActivity,
    allCreators,
  });
}
