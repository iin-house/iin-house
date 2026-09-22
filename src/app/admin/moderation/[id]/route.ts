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
    const flagId = params.id;
    const reviewerId = (session.user as any).id;

    if (action === "approve") {
      await prisma.moderationFlag.update({
        where: { id: flagId },
        data: { status: "RESOLVED", reviewedBy: reviewerId, reviewedAt: new Date() },
      });
      // Hide the flagged content
      const flag = await prisma.moderationFlag.findUnique({ where: { id: flagId } });
      if (flag) {
        await prisma.contentPost.update({
          where: { id: flag.contentId },
          data: { publishedAt: null },
        });
      }
    } else {
      await prisma.moderationFlag.update({
        where: { id: flagId },
        data: { status: "DISMISSED", reviewedBy: reviewerId, reviewedAt: new Date() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
