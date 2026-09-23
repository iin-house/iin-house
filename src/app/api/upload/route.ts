import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync, createReadStream, statSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { applyWatermark } from "@/lib/watermark";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { getSignedUploadUrl } from "@/lib/storage";
import { prisma } from "@/lib/db";
import { extname } from "path";

const LOCAL_UPLOAD_DIR = join(process.cwd(), "..", "uploads");
const EXT_MIME: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".gif": "image/gif", ".webp": "image/webp", ".mp4": "video/mp4",
  ".webm": "video/webm", ".mp3": "audio/mpeg", ".wav": "audio/wav",
  ".pdf": "application/pdf",
};

/**
 * Serve uploaded file with visibility enforcement
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  if (key.includes("..") || key.includes("//")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const filePath = join(LOCAL_UPLOAD_DIR, key);
  if (!existsSync(filePath)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ext = extname(key).toLowerCase();
  const contentType = EXT_MIME[ext] || "application/octet-stream";

  // Enforce visibility for content posts
  try {
    const post = await prisma.contentPost.findFirst({
      where: {
        OR: [
          { mediaUrl: { contains: key } },
          { thumbnailUrl: { contains: key } },
        ],
      },
      include: { creator: { select: { userId: true } } },
    });

    if (post) {
      const viewerId = session?.user ? (session.user as any).id : null;
      const userRole = session?.user ? (session.user as any).role : null;

      if (post.visibility === "PPV" || post.isPPV) {
        if (!viewerId) return NextResponse.json({ error: "Auth required" }, { status: 401 });
        const unlocked = await prisma.pPVPurchase.findUnique({
          where: { subscriberId_contentId: { subscriberId: viewerId, contentId: post.id } },
        });
        if (!unlocked && post.creator.userId !== viewerId && userRole !== "ADMIN") {
          return NextResponse.json({ error: "Purchase required" }, { status: 402 });
        }
      } else if (post.visibility === "SUBSCRIBERS") {
        if (!viewerId || (post.creator.userId !== viewerId && userRole !== "ADMIN")) {
          const sub = viewerId ? await prisma.subscription.findFirst({
            where: { subscriberId: viewerId, creatorId: post.creatorId, status: "ACTIVE" },
          }) : null;
          if (!sub) return NextResponse.json({ error: "Subscription required" }, { status: 402 });
        }
      }
    }
  } catch {
    // Fail open for dev
  }

  const stat = statSync(filePath);
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Content-Length", String(stat.size));
  headers.set("Cache-Control", "private, no-store");

  const stream = createReadStream(filePath);
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });
  return new Response(webStream, { headers });
}

/**
 * POST - presigned URL (JSON) or direct multipart upload
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { fileName, fileType } = body;
      if (!fileName || !fileType) {
        return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
      }
      const ext = fileName.split(".").pop() || "bin";
      const key = `uploads/${(session.user as any).id}/${randomUUID()}.${ext}`;

      const uploadUrl = await getSignedUploadUrl(key, fileType);
      if (uploadUrl) {
        return NextResponse.json({ ok: true, key, uploadUrl });
      }

      return NextResponse.json({
        ok: true,
        key,
        uploadUrl: `/api/upload?key=${encodeURIComponent(key)}`,
      });
    }

    // Multipart upload (direct to server)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${randomUUID()}.${ext}`;
    const key = `uploads/${(session.user as any).id}/${fileName}`;

    const isImage = file.type.startsWith("image/");
    const rawBuf = Buffer.from(await file.arrayBuffer());
    let processed = rawBuf;

    if (isImage) {
      processed = await applyWatermark(rawBuf);
    }

    if (!existsSync(LOCAL_UPLOAD_DIR)) mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
    const filePath = join(LOCAL_UPLOAD_DIR, fileName);
    writeFileSync(filePath, processed);

    return NextResponse.json({
      ok: true,
      key,
      url: `/api/upload?key=${encodeURIComponent(key)}`,
      watermarked: isImage,
      size: processed.length,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message ?? "Upload failed" }, { status: 500 });
  }
}
