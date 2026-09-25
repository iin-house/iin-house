import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.contentPost.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          include: {
            user: { select: { id: true, email: true } },
            tiers: { where: { active: true }, orderBy: { price: "asc" } },
            subscriptions: { select: { subscriberId: true, status: true } },
          },
        },
        ppvBuyers: { where: { subscriberId: (await getServerSession(authOptions))?.user?.id } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const isOwner = session?.user && post.creator.userId === (session.user as any).id;
    const isSubscriber = session?.user && post.creator.subscriptions?.some(
      (s: any) => s.subscriberId === (session.user as any).id && s.status === "ACTIVE"
    );
    const hasPurchased = (post.ppvBuyers ?? []).length > 0;

    let canView = false;
    if (post.visibility === "PUBLIC") canView = true;
    if (post.visibility === "SUBSCRIBERS" && isSubscriber) canView = true;
    if (isOwner) canView = true;
    if (post.isPPV && hasPurchased) canView = true;

    const { ppvBuyers: _ppv, creator: c, ...postData } = post as any;

    return NextResponse.json({
      ...postData,
      creator: {
        id: c.id,
        displayName: c.displayName,
        profileImageUrl: c.profileImageUrl,
        userId: c.userId,
        tiers: c.tiers.map((t: any) => ({ id: t.id, name: t.name, price: Number(t.price), currency: t.currency })),
      },
      canView,
      isOwner,
      isSubscriber,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

    const post = await prisma.contentPost.findUnique({ where: { id: params.id } });
    if (!post || post.creatorId !== profile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await prisma.contentPost.update({
      where: { id: params.id },
      data: {
        caption: body.caption ?? post.caption,
        visibility: body.visibility ?? post.visibility,
        isPPV: body.isPPV ?? post.isPPV,
        ppvPrice: body.ppvPrice ?? post.ppvPrice,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : post.scheduledAt,
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

    const post = await prisma.contentPost.findUnique({ where: { id: params.id } });
    if (!post || post.creatorId !== profile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.contentPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Delete failed" }, { status: 500 });
  }
}
