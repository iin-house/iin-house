import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { getSignedDownloadUrl, getSignedUploadUrl, getPublicUrl, isStorageConfigured } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // Check subscriber has access (creator content or own content)
  const post = await prisma.contentPost.findFirst({
    where: { OR: [{ mediaUrl: key }, { thumbnailUrl: key }, { watermarkedUrl: key }] },
    include: { creator: { include: { user: true } } },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = post.creatorId === session.user.id;
  const isCreator = session.user.role === "CREATOR" || session.user.role === "ADMIN";

  // Subscribers can only view content they have access to
  if (!isOwner && !isCreator) {
    if (post.isPPV) {
      const purchase = await prisma.pPVPurchase.findUnique({
        where: { subscriberId_contentId: { subscriberId: session.user.id, contentId: post.id } },
      });
      if (!purchase) return NextResponse.json({ error: "Purchase required" }, { status: 403 });
    }
    const sub = await prisma.subscription.findFirst({
      where: { subscriberId: session.user.id, creatorId: post.creatorId, status: "ACTIVE" },
    });
    if (!sub) return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  // If real S3 storage is configured, redirect to signed URL
  if (isStorageConfigured()) {
    const signedUrl = await getSignedDownloadUrl(key);
    if (signedUrl) {
      return NextResponse.redirect(new URL(signedUrl, req.url));
    }
  }

  // Dev/local fallback — redirect to public upload path
  return NextResponse.redirect(new URL(`/uploads/${key.split("/").pop()}`, req.url));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { contentType } = body;
  if (!contentType) return NextResponse.json({ error: "Missing contentType" }, { status: 400 });

  const ext = contentType.split("/")[1] ?? "bin";
  const key = `uploads/${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // If S3 configured, return a real signed upload URL
  if (isStorageConfigured()) {
    const result = await getSignedUploadUrl(key, contentType);
    if (result) {
      return NextResponse.json({ key, uploadUrl: result, publicUrl: getPublicUrl(key) });
    }
  }

  // Dev fallback
  return NextResponse.json({ key, uploadUrl: `/api/upload?key=${encodeURIComponent(key)}` });
}
