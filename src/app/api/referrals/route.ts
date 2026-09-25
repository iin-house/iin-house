import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  let referral = await prisma.referral.findUnique({ where: { userId } });
  if (!referral) {
    referral = await prisma.referral.create({
      data: { userId, code: generateCode() },
    });
  }

  const referredUsers = await prisma.referralUse.findMany({
    where: { referrerId: userId },
    include: { referrer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    code: referral.code,
    totalUses: referral.totalUses,
    totalEarnings: Number(referral.totalEarnings),
    referredUsers: referredUsers.map(u => ({
      id: u.userId,
      name: (u.referrer as any)?.email || "User",
      date: u.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { code } = body;

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const referral = await prisma.referral.findUnique({ where: { code: code.toUpperCase() } });
  if (!referral) return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });

  if (referral.userId === (session.user as any).id) return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });

  const existing = await prisma.referralUse.findUnique({
    where: { referrerId_userId: { referrerId: referral.userId, userId: (session.user as any).id } },
  });
  if (existing) return NextResponse.json({ error: "Already used this code" }, { status: 409 });

  const REWARD = 100; // ₹100 per referral
  await prisma.referralUse.create({
    data: {
      referrerId: referral.userId,
      userId: (session.user as any).id,
      reward: REWARD,
    },
  });

  await prisma.referral.update({
    where: { id: referral.id },
    data: { totalUses: { increment: 1 }, totalEarnings: { increment: REWARD } },
  });

  return NextResponse.json({ success: true, reward: REWARD });
}
