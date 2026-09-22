import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

// Cron endpoint to publish scheduled content
// Protect with a secret token
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  try {
    // Auth: either admin session or cron secret
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === "ADMIN";
    const authHeader = req.headers.get("authorization");
    const isCron = authHeader === `Bearer ${CRON_SECRET}`;

    if (!isAdmin && !isCron) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const scheduled = await prisma.contentPost.findMany({
      where: {
        scheduledAt: { lte: now },
        publishedAt: null,
      },
      take: 50,
    });

    for (const post of scheduled) {
      await prisma.contentPost.update({
        where: { id: post.id },
        data: { publishedAt: now },
      });
    }

    return NextResponse.json({ published: scheduled.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
