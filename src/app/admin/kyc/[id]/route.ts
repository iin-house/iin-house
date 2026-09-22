import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { action, notes } = parsed.data;
    const kycId = params.id;

    const kyc = await prisma.ageVerification.findUnique({ where: { id: kycId } });
    if (!kyc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const reviewerId = (session.user as any).id;

    if (action === "approve") {
      await prisma.user.update({
        where: { id: kyc.userId },
        data: { ageVerified: true, kycStatus: "VERIFIED" },
      });
      await prisma.ageVerification.update({
        where: { id: kycId },
        data: { status: "APPROVED", reviewedBy: reviewerId, reviewedAt: new Date() },
      });
    } else {
      await prisma.ageVerification.update({
        where: { id: kycId },
        data: { status: "REJECTED", reviewedBy: reviewerId, reviewedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const items = await prisma.ageVerification.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    items.map((k) => ({
      id: k.id,
      userId: k.userId,
      documentUrl: k.documentUrl,
      status: k.status,
      createdAt: k.createdAt,
    }))
  );
}
