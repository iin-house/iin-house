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
    const payoutId = params.id;

    const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
    if (!payout) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "approve") {
      await prisma.payout.update({
        where: { id: payoutId },
        data: { status: "COMPLETED", processedAt: new Date() },
      });
    } else {
      await prisma.payout.update({
        where: { id: payoutId },
        data: { status: "FAILED", processedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
