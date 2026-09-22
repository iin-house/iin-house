import { prisma } from "./db";

export async function getUserStats(creatorId: string) {
  const [subs, ppvCount, ppvAgg, payoutAgg] = await Promise.all([
    prisma.subscription.count({ where: { creatorId, status: "ACTIVE" } }),
    prisma.pPVPurchase.count({ where: { content: { creatorId } } }),
    prisma.pPVPurchase.aggregate({
      where: { content: { creatorId } },
      _sum: { amount: true },
    }),
    prisma.payout.aggregate({
      where: { creatorId, status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  const ppvRevenue = Number(ppvAgg._sum.amount || 0);
  const payoutRevenue = Number(payoutAgg._sum.amount || 0);

  return {
    activeSubs: subs,
    ppvPurchases: ppvCount,
    totalRevenue: ppvRevenue + payoutRevenue,
    avgPPV: ppvCount ? Number((ppvRevenue / ppvCount).toFixed(2)) : 0,
  };
}

export async function getPlatformStats() {
  const [creators, subscribers, content, totalRevenue, pendingPayouts] = await Promise.all([
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { role: "SUBSCRIBER" } }),
    prisma.contentPost.count(),
    prisma.pPVPurchase.aggregate({ _sum: { amount: true } }),
    prisma.payout.count({ where: { status: "PENDING" } }),
  ]);

  return {
    creators,
    subscribers,
    totalContent: content,
    totalRevenue: Number(totalRevenue._sum.amount || 0),
    pendingPayouts,
  };
}
