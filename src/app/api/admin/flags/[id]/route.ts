import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

// ── Schemas ────────────────────────────────────────────────────────────────

const listFlagsSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const updateFlagSchema = z.object({
  status: z.enum(["APPROVED", "REMOVED", "DISMISSED", "OPEN"]),
});

// ── GET /api/admin/flags/[id] ───────────────────────────────────────────────
// (List is served by the parent route; this segment handles the individual flag)

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = updateFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { status: newStatus } = parsed.data;
    const flagId = params.id;
    const reviewerId = (session.user as any).id;

    const flag = await prisma.moderationFlag.findUnique({
      where: { id: flagId },
      include: { content: true },
    });

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    };

    if (newStatus === "REMOVED") {
      await prisma.contentPost.update({
        where: { id: flag.contentId },
        data: { publishedAt: null },
      });
    }

    await prisma.moderationFlag.update({
      where: { id: flagId },
      data: updateData,
    });

    await logAudit({
      userId: reviewerId,
      action: `FLAG_${newStatus}`,
      target: `flag:${flagId}`,
      metadata: { contentId: flag.contentId, reason: flag.reason },
    });

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update flag" }, { status: 500 });
  }
}

// ── POST /api/admin/flags/[id] ─────────────────────────────────────────────
// Handles HTML form submissions from the moderation page

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const rawStatus = formData.get("status");

  if (!rawStatus || typeof rawStatus !== "string") {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const parsed = updateFlagSchema.safeParse({ status: rawStatus });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const newStatus = parsed.data.status;
  const flagId = params.id;
  const reviewerId = (session.user as any).id;

  try {
    const flag = await prisma.moderationFlag.findUnique({
      where: { id: flagId },
      include: { content: true },
    });

    if (!flag) {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      status: newStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    };

    if (newStatus === "REMOVED") {
      await prisma.contentPost.update({
        where: { id: flag.contentId },
        data: { publishedAt: null },
      });
    }

    await prisma.moderationFlag.update({
      where: { id: flagId },
      data: updateData,
    });

    await logAudit({
      userId: reviewerId,
      action: `FLAG_${newStatus}`,
      target: `flag:${flagId}`,
      metadata: { contentId: flag.contentId, reason: flag.reason },
    });

    return NextResponse.redirect(new URL("/admin/moderation", req.url));
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update flag" }, { status: 500 });
  }
}
