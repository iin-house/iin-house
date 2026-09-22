import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { applyWatermark } from "@/lib/watermark";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { generateUploadUrl } from "@/lib/storage";

const LOCAL_UPLOAD_DIR = join(process.cwd(), "..", "uploads");

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // JSON request: client wants a presigned URL
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { fileName, fileType } = body;
      if (!fileName || !fileType) {
        return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
      }
      const ext = fileName.split(".").pop() || "bin";
      const key = `uploads/${(session.user as any).id}/${randomUUID()}.${ext}`;

      const uploadUrl = await generateUploadUrl(key, fileType);
      if (uploadUrl) {
        return NextResponse.json({ ok: true, key, uploadUrl });
      }

      // Local fallback (dev only)
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
      url: `/uploads/${fileName}`,
      watermarked: isImage,
      size: processed.length,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message ?? "Upload failed" }, { status: 500 });
  }
}
