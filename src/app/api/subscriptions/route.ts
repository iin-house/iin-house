import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const subscribeSchema = z.object({
  creatorId: z.string().min(1),
  tierId: z.string().min(1),
});

const unsubscribeSchema = z.object({
  creatorId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { creatorId, tierId } = parsed.data;
    const subscriberId = (session.user as any).id;

    // Verify tier belongs to creator
    const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } });
    if (!tier || tier.creatorId !== creatorId) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.subscription.findFirst({
      where: { subscriberId, creatorId, status: "ACTIVE" },
    });
    if (existing) {
      // Tier switch
      if (existing.tierId !== tierId) {
        const updated = await prisma.subscription.update({
          where: { id: existing.id },
          data: { tierId, renewedAt: new Date() },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    const sub = await prisma.subscription.create({
      data: { subscriberId, creatorId, tierId, status: "ACTIVE" },
    });

    return NextResponse.json(sub);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { subId, tierId } = body;

    if (!subId) {
      return NextResponse.json({ error: "Missing subId" }, { status: 400 });
    }

    const sub = await prisma.subscription.findUnique({ where: { id: subId } });
    if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

    // Verify subscriber owns it
    if (sub.subscriberId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.subscription.update({
      where: { id: subId },
      data: { tierId, renewedAt: new Date() },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subId = new URL(req.url).searchParams.get("id");
  if (subId) {
    try {
      const sub = await prisma.subscription.findUnique({ where: { id: subId } });
      if (sub) await prisma.subscription.update({ where: { id: subId }, data: { status: "CANCELLED", cancelledAt: new Date() } });
    } catch { /* already cancelled */ }
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await req.json();
    const { creatorId } = body;
    await prisma.subscription.updateMany({
      where: { subscriberId: (session.user as any).id, creatorId, status: "ACTIVE" },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriberId = (session.user as any).id;
  const subs = await prisma.subscription.findMany({
    where: { subscriberId, status: "ACTIVE" },
    include: { tier: true, creator: { select: { displayName: true, profileImageUrl: true, userId: true } } },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ subscriptions: subs });
}
