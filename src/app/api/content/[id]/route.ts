import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

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
