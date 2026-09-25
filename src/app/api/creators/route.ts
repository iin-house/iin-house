import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDemoCreators } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();

    const where: any = { verificationStatus: "VERIFIED" };

    if (q) {
      where.OR = [
        { displayName: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category && category !== "All") {
      where.category = category.toUpperCase();
    }

    const creators = await prisma.creatorProfile.findMany({
      where,
      include: {
        tiers: { where: { active: true } },
        user: { select: { id: true, email: true, phone: true } },
        posts: {
          where: { publishedAt: { not: null } },
          take: 3,
          orderBy: { publishedAt: "desc" },
        },
      },
      take: 24,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(creators);
  } catch {
    return NextResponse.json(getDemoCreators());
  }
}
