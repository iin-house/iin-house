import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

// ── Schemas ────────────────────────────────────────────────────────────────

const listDisputesSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const updateDisputeSchema = z.object({
  status: z.enum(["RESOLVED", "REJECTED"]),
  resolution: z.string().max(1000).optional(),
});

// ── GET /api/admin/flags/[id] (list handled by parent) ─────────────────────

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
    const parsed = updateDisputeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { status: newStatus, resolution } = parsed.data;
    const disputeId = params.id;
    const resolverId = (session.user as any).id;

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: newStatus,
        resolvedBy: resolverId,
        resolvedAt: new Date(),
        ...(resolution && { resolution }),
      },
    });

    await logAudit({
      userId: resolverId,
      action: `DISPUTE_${newStatus}`,
      target: `dispute:${disputeId}`,
      metadata: { type: dispute.type, description: dispute.description },
    });

    return NextResponse.json({ ok: true, dispute: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update dispute" }, { status: 500 });
  }
}

// ── POST /api/admin/disputes/[id] ──────────────────────────────────────────
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
  const rawResolution = formData.get("resolution");

  if (!rawStatus || typeof rawStatus !== "string") {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const parsed = updateDisputeSchema.safeParse({
    status: rawStatus,
    resolution: typeof rawResolution === "string" ? rawResolution : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { status: newStatus, resolution } = parsed.data;
  const disputeId = params.id;
  const resolverId = (session.user as any).id;

  try {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: newStatus,
        resolvedBy: resolverId,
        resolvedAt: new Date(),
        ...(resolution && { resolution }),
      },
    });

    await logAudit({
      userId: resolverId,
      action: `DISPUTE_${newStatus}`,
      target: `dispute:${disputeId}`,
      metadata: { type: dispute.type, description: dispute.description },
    });

    return NextResponse.redirect(new URL("/admin/moderation", req.url));
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update dispute" }, { status: 500 });
  }
}
