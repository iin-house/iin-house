import { NextRequest, NextResponse } from "next/server";
import { applyWatermark, verifyMediaUrl } from "@/lib/watermark";
import { prisma } from "@/lib/db";
import { getObjectStream as getSignedUrl } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const userId = searchParams.get("user");
  const sig = searchParams.get("sig");
  const ts = searchParams.get("ts");

  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  // If signed, verify the signature
  if (sig && userId && ts) {
    const valid = verifyMediaUrl(key, userId, sig, Number(ts));
    if (!valid) return NextResponse.json({ error: "Invalid or expired URL" }, { status: 403 });
  }

  try {
    // Try S3 first if configured
    const stream = await getSignedUrl(key);
    if (stream) {
      return new NextResponse(stream, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "private, max-age=3600",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  } catch {
    // Fall through to local filesystem
  }

  // Fallback: serve from local uploads directory (dev only)
  const fs = await import("fs");
  const path = await import("path");
  const UPLOAD_DIR = path.join(process.cwd(), "..", "uploads");
  const filePath = path.join(UPLOAD_DIR, key.split("/").pop() || "");
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
