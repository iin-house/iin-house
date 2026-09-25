import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const [subscriptions, purchases, payouts] = await Promise.all([
    prisma.subscription.findMany({
      where: { subscriberId: userId },
      include: { tier: true, creator: { select: { displayName: true, userId: true } } },
      orderBy: { startedAt: "desc" },
    }),
    prisma.pPVPurchase.findMany({
      where: { subscriberId: userId },
      include: { content: { select: { id: true, caption: true, type: true, ppvPrice: true, createdAt: true, creator: { select: { displayName: true } } } } },
      orderBy: { purchasedAt: "desc" },
    }),
    prisma.payout.findMany({
      where: { creator: { userId } },
      include: { creator: { select: { displayName: true } } },
      orderBy: { requestedAt: "desc" },
    }),
  ]);

  const invoiceEntries = [
    ...subscriptions.map(s => ({
      id: `sub-${s.id}`,
      type: "subscription",
      title: `${s.creator.displayName} · ${s.tier.name}`,
      amount: Number(s.tier.price),
      date: s.startedAt,
      status: s.status === "ACTIVE" ? "active" : "cancelled",
      icon: "🔄",
      detail: `₹${Number(s.tier.price).toLocaleString()}/month`,
    })),
    ...purchases.map(p => ({
      id: `ppv-${p.id}`,
      type: "ppv",
      title: p.content.caption?.slice(0, 50) ?? "Premium content",
      amount: Number(p.amount),
      date: p.purchasedAt,
      status: "completed",
      icon: "🔓",
      detail: `${p.content.type} · ${p.content.creator.displayName}`,
    })),
    ...payouts.map(p => ({
      id: `payout-${p.id}`,
      type: "payout",
      title: `Payout to ${p.creator?.displayName ?? "you"}`,
      amount: Number(p.amount),
      date: p.requestedAt,
      status: p.status === "COMPLETED" ? "completed" : "pending",
      icon: p.status === "COMPLETED" ? "✓" : "⏳",
      detail: p.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = [...subscriptions, ...purchases].reduce((sum, item) => sum + (Number((item as any).tier?.price ?? (item as any).amount ?? 0)), 0);
  const activeSubs = subscriptions.filter(s => s.status === "ACTIVE").length;
  const ppvCount = purchases.length;

  return NextResponse.json({
    invoices: invoiceEntries,
    totals: {
      totalSpent,
      activeSubs,
      ppvCount,
      totalPayouts: payouts.filter(p => p.status === "COMPLETED").reduce((s, p) => s + Number(p.amount), 0),
      pendingPayouts: payouts.filter(p => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0),
    },
  });
}
