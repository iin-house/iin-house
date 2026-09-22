import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const flagSchema = z.object({
  contentId: z.string().min(1),
  reason: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = flagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { contentId, reason } = parsed.data;

    await prisma.moderationFlag.create({
      data: {
        contentId,
        flaggedBy: (session.user as any).id,
        reason,
        status: "OPEN",
      },
    });

    await logAudit({
      userId: (session.user as any).id,
      action: "CONTENT_FLAG",
      target: `content:${contentId}`,
      metadata: { reason },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create flag" }, { status: 500 });
  }
}
