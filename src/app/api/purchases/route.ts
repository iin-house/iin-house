import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const purchases = await prisma.pPVPurchase.findMany({
    where: { subscriberId: userId },
    include: { content: { select: { id: true, type: true, caption: true, ppvPrice: true, createdAt: true, creator: { select: { displayName: true, userId: true } } } } },
    orderBy: { purchasedAt: "desc" },
  });

  return NextResponse.json({
    purchases: purchases.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      purchasedAt: p.purchasedAt,
      content: p.content,
    })),
  });
}
