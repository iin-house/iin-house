import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

// ── Schemas ────────────────────────────────────────────────────────────────

const listFlagsSchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// ── GET /api/admin/flags ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const parsed = listFlagsSchema.safeParse({
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

    const [flags, total] = await Promise.all([
      prisma.moderationFlag.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          content: {
            include: {
              creator: { include: { user: { select: { email: true } } } },
            },
          },
          flagger: { select: { email: true } },
          reviewer: { select: { email: true } },
        },
      }),
      prisma.moderationFlag.count({ where }),
    ]);

    return NextResponse.json({
      flags,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to fetch flags" }, { status: 500 });
  }
}
