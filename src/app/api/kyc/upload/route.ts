import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const documentTypes = ["passport", "drivers_license", "national_id"] as const;

const uploadSchema = z.object({
  documentUrl: z.string().min(1),
  documentType: z.enum(documentTypes),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = uploadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Create KYC document record
    const kyc = await prisma.kycDocument.create({
      data: {
        userId,
        documentType: parsed.data.documentType,
        documentUrl: parsed.data.documentUrl,
        status: "PENDING",
      },
    });

    // Sync user kycStatus
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "PENDING" },
    });

    return NextResponse.json({ ok: true, id: kyc.id });
  } catch (e: any) {
    console.error("KYC upload error:", e);
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any).id;
    const documents = await prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        documentType: true,
        documentUrl: true,
        status: true,
        reviewedBy: true,
        reviewedAt: true,
        notes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, documents });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
