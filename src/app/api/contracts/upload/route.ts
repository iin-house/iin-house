import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("type");

    if (contentType === "document") {
      // Handle document upload for contracts
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

      // Upload to storage
      const { writeFileSync, existsSync, mkdirSync } = await import("fs");
      const { join } = await import("path");
      const UPLOAD_DIR = join(process.cwd(), "..", "uploads", "contracts");
      if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

      const bytes = new Uint8Array(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      writeFileSync(join(UPLOAD_DIR, fileName), bytes);

      return NextResponse.json({ url: `/uploads/contracts/${fileName}` });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
