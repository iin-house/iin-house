import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SUBSCRIBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = (session.user as any).id;

  const [activeSubs, ppvPurchases] = await Promise.all([
    prisma.subscription.count({
      where: { subscriberId: userId, status: "ACTIVE" },
    }),
    prisma.pPVPurchase.count({ where: { subscriberId: userId } }),
  ]);

  return NextResponse.json({
    activeSubs,
    ppvPurchases,
  });
}
