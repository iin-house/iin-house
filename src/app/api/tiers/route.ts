import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  currency: z.string().length(3).optional(),
  perksDescription: z.string().max(500).optional(),
  active: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
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
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No creator profile" }, { status: 400 });

    const tier = await prisma.subscriptionTier.create({
      data: {
        creatorId: profile.id,
        ...parsed.data,
        currency: parsed.data.currency ?? "INR",
      },
    });

    return NextResponse.json(tier);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, ...data } = parsed.data;
    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No creator profile" }, { status: 400 });

    const existing = await prisma.subscriptionTier.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== profile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const tier = await prisma.subscriptionTier.update({ where: { id }, data });
    return NextResponse.json(tier);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const profile = await prisma.creatorProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!profile) return NextResponse.json({ error: "No creator profile" }, { status: 400 });

    const existing = await prisma.subscriptionTier.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== profile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.subscriptionTier.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");

  if (creatorId) {
    const tiers = await prisma.subscriptionTier.findMany({
      where: { creatorId, active: true },
      orderBy: { price: "asc" },
    });
    return NextResponse.json(tiers);
  }

  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!profile) return NextResponse.json([]);

  const tiers = await prisma.subscriptionTier.findMany({
    where: { creatorId: profile.id },
    orderBy: { price: "asc" },
  });
  return NextResponse.json(tiers);
}
