import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const includeCounts = searchParams.get("counts") === "true";
  const userId = (session.user as any).id;

  const wishlist = await prisma.wishlist.findMany({
    where: { subscriberId: userId },
    include: {
      creator: {
        include: {
          user: { select: { id: true, email: true } },
          tiers: { where: { active: true }, orderBy: { price: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let counts: Record<string, number> = {};
  if (includeCounts) {
    const allSubs = await prisma.subscription.findMany({
      where: { subscriberId: userId, status: "ACTIVE" },
      select: { creatorId: true },
    });
    const subIds = new Set(allSubs.map(s => s.creatorId));
    counts = Object.fromEntries(wishlist.map(w => [w.creatorId, subIds.has(w.creatorId) ? 1 : 0]));
  }

  return NextResponse.json({
    wishlist: wishlist.map(w => ({
      id: w.id,
      createdAt: w.createdAt,
      creator: w.creator,
    })),
    counts,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { creatorId } = body;

  if (!creatorId) {
    return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });
  }

  const result = await prisma.wishlist.create({
    data: {
      subscriberId: (session.user as any).id,
      creatorId,
    },
    include: {
      creator: {
        include: {
          user: { select: { id: true, email: true } },
          tiers: { where: { active: true } },
        },
      },
    },
  });

  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");

  if (creatorId) {
    await prisma.wishlist.deleteMany({
      where: { subscriberId: (session.user as any).id, creatorId },
    });
  }

  return NextResponse.json({ ok: true });
}
