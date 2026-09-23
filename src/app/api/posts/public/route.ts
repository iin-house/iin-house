import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const subscriberId = session?.user ? (session.user as any).id : null;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const cursor = searchParams.get("cursor");

  try {
    const posts = await prisma.contentPost.findMany({
      where: {
        publishedAt: { not: null },
        OR: [
          { visibility: "PUBLIC" as any },
          ...(subscriberId
            ? [
                {
                  visibility: "SUBSCRIBERS" as any,
                  creator: {
                    subscriptions: {
                      some: { subscriberId, status: "ACTIVE" as any },
                    },
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        creator: {
          include: { user: { select: { id: true, email: true } } },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const filtered = items.map((p) => ({
      id: p.id,
      type: p.type,
      mediaUrl: p.mediaUrl,
      thumbnailUrl: p.thumbnailUrl,
      caption: p.caption,
      isPPV: p.isPPV,
      ppvPrice: p.ppvPrice ? Number(p.ppvPrice) : null,
      visibility: p.visibility,
      publishedAt: p.publishedAt,
      creator: {
        id: (p.creator as any).id,
        displayName: (p.creator as any).displayName,
        userId: (p.creator as any).userId,
      },
    }));

    return NextResponse.json({ posts: filtered, nextCursor });
  } catch (e: any) {
    return NextResponse.json({ posts: [], nextCursor: null });
  }
}
