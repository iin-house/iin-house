import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const contentId = searchParams.get("content");
  const drmScheme = searchParams.get("drm") || "widevine";

  if (!contentId) return NextResponse.json({ error: "Missing content" }, { status: 400 });

  // Verify content is accessible by this user (subscribed / purchased)
  const post = await prisma.contentPost.findUnique({ where: { id: contentId } });
  if (!post) return NextResponse.json({ error: "Content not found" }, { status: 404 });

  // Simple gate: PPV requires purchase, tier-locked requires subscription
  if (post.isPPV) {
    const purchased = await prisma.pPVPurchase.findFirst({
      where: { contentId: post.id, subscriberId: session.user.id },
    });
    if (!purchased) return NextResponse.json({ error: "PPV unlock required" }, { status: 403 });
  } else if (post.visibility !== "PUBLIC") {
    const subscribed = await prisma.subscription.findFirst({
      where: {
        subscriberId: session.user.id,
        creatorId: post.creatorId,
        status: "ACTIVE",
      },
    });
    if (!subscribed) return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  try {
    const { DRMService } = await import("@/lib/drm");
    const drm = new DRMService(process.env.DRM_PROVIDER || "dev");
    const license = await drm.requestLicense(contentId, session.user.id, drmScheme);
    return NextResponse.json(license);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "License request failed" }, { status: 500 });
  }
}
