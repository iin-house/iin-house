import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { logAudit } from "@/lib/audit";

const unlockSchema = z.object({
  contentId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = unlockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { contentId } = parsed.data;
    const subscriberId = (session.user as any).id;

    const post = await prisma.contentPost.findUnique({ where: { id: contentId } });
    if (!post) return NextResponse.json({ error: "Content not found" }, { status: 404 });
    if (!post.isPPV) return NextResponse.json({ error: "Content is not PPV" }, { status: 400 });

    const existing = await prisma.pPVPurchase.findUnique({
      where: { subscriberId_contentId: { subscriberId, contentId } },
    });
    if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 409 });

    const purchase = await prisma.pPVPurchase.create({
      data: { subscriberId, contentId, amount: post.ppvPrice ?? 0 },
    });

    await logAudit({
      userId: subscriberId,
      action: "PPV_PURCHASE",
      target: `content:${contentId}`,
      metadata: { amount: Number(post.ppvPrice ?? 0) },
    });

    return NextResponse.json(purchase);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
