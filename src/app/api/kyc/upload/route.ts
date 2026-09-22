import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const uploadSchema = z.object({
  documentUrl: z.string().min(1),
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
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Update user KYC status
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "PENDING" },
    });

    // Create KYC verification record
    const kyc = await prisma.ageVerification.create({
      data: {
        userId,
        documentUrl: parsed.data.documentUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, id: kyc.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
