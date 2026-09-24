import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

// ── Schemas ────────────────────────────────────────────────────────────────

const listDisputesSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// ── GET /api/admin/disputes ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const parsed = listDisputesSchema.safeParse({
      status: url.searchParams.get("status") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
    }

    const { status, page = 1, limit = 25 } = parsed.data;
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true, phone: true } },
        },
      }),
      prisma.dispute.count({ where }),
    ]);

    return NextResponse.json({
      disputes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to fetch disputes" }, { status: 500 });
  }
}
