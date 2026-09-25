import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: (session.user as any).id },
  });

  if (!profile) return NextResponse.json({ posts: [] });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const visibility = searchParams.get("visibility");

  const where: any = { creatorId: profile.id };
  if (visibility) where.visibility = visibility;

  const posts = await prisma.contentPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      type: p.type,
      caption: p.caption,
      mediaUrl: p.mediaUrl,
      thumbnailUrl: p.thumbnailUrl,
      isPPV: p.isPPV,
      ppvPrice: p.ppvPrice ? Number(p.ppvPrice) : null,
      visibility: p.visibility,
      scheduledAt: p.scheduledAt,
      publishedAt: p.publishedAt,
      views: p.views,
      createdAt: p.createdAt,
    })),
  });
}
