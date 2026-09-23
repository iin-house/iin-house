import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        creatorProfile: {
          include: {
            tiers: { where: { active: true }, orderBy: { price: "asc" } },
            posts: {
              where: { publishedAt: { not: null }, isPPV: false },
              orderBy: { publishedAt: "desc" },
              take: 12,
            },
          },
        },
      },
    });

    if (!user?.creatorProfile) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      creatorProfile: user.creatorProfile,
    });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
