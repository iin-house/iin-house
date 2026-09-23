import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const createSchema = z.object({
  type: z.enum(["PHOTO", "VIDEO", "AUDIO", "TEXT"]),
  mediaUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  caption: z.string().max(2000).optional(),
  isPPV: z.boolean().optional(),
  ppvPrice: z.number().positive().optional(),
  scheduledAt: z.string().datetime().optional(),
  visibility: z.enum(["PUBLIC", "SUBSCRIBERS", "PPV"]).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }

    const { type, mediaUrl, thumbnailUrl, caption, isPPV, ppvPrice, scheduledAt, visibility } = parsed.data;

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) {
      return NextResponse.json({ error: "No creator profile" }, { status: 404 });
    }

    if (isPPV && (ppvPrice == null || ppvPrice <= 0)) {
      return NextResponse.json({ error: "PPV price required" }, { status: 400 });
    }

    const post = await prisma.contentPost.create({
      data: {
        creatorId: profile.id,
        type,
        mediaUrl,
        thumbnailUrl,
        caption,
        isPPV: isPPV ?? false,
        ppvPrice: isPPV ? ppvPrice : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: scheduledAt ? null : new Date(),
        visibility: visibility as any ?? "PUBLIC",
      },
    });

    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create post" }, { status: 500 });
  }
}
