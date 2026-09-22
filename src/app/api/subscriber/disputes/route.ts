import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

const createSchema = z.object({
  userId: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { userId, type, description } = parsed.data;
    const dispute = await prisma.dispute.create({
      data: {
        userId,
        type,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json(dispute);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  const disputes = await prisma.dispute.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(disputes);
}
