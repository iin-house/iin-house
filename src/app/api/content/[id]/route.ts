import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const actionSchema = z.object({
  action: z.enum(["publish", "remove", "delete"]),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { action } = parsed.data;
    const contentId = params.id;

    const post = await prisma.contentPost.findUnique({
      where: { id: contentId },
      include: { creator: true },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Verify ownership
    if (post.creator.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "publish") {
      await prisma.contentPost.update({
        where: { id: contentId },
        data: { publishedAt: new Date() },
      });
    } else if (action === "remove") {
      await prisma.contentPost.update({
        where: { id: contentId },
        data: { publishedAt: null },
      });
    } else if (action === "delete") {
      await prisma.contentPost.delete({ where: { id: contentId } });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.contentPost.findUnique({
    where: { id: params.id },
    include: {
      creator: { select: { id: true, displayName: true, userId: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Access check: PPV requires purchase, tier-locked requires subscription
  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  if (post.isPPV) {
    const purchased = await prisma.pPVPurchase.findFirst({
      where: { contentId: post.id, subscriberId: userId },
    });
    if (!purchased && userRole !== "CREATOR" && post.creator.userId !== userId) {
      return NextResponse.json({ error: "PPV unlock required", post: { ...post, mediaUrl: null } }, { status: 403 });
    }
  } else if (post.tierVisibility !== "PUBLIC" && userRole !== "CREATOR" && post.creator.userId !== userId) {
    const subscribed = await prisma.subscription.findFirst({
      where: { subscriberId: userId, creatorId: post.creatorId, status: "ACTIVE" },
    });
    if (!subscribed) {
      return NextResponse.json({ error: "Subscription required", post: { ...post, mediaUrl: null } }, { status: 403 });
    }
  }

  // Increment views
  await prisma.contentPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(post);
}
