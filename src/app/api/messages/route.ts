import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get("userId");
  if (!otherUserId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: { sentAt: "asc" },
  });

  // Mark as read
  await prisma.message.updateMany({
    where: { senderId: otherUserId, recipientId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json(messages);
}

const sendSchema = z.object({
  recipientId: z.string().min(1),
  content: z.string().min(1).max(2000),
  isPaid: z.boolean().optional(),
  price: z.number().positive().optional(),
  isPPV: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { recipientId, content, isPaid, price, isPPV } = parsed.data;

    const message = await prisma.message.create({
      data: {
        senderId: (session.user as any).id,
        recipientId,
        content,
        isPaid: isPaid ?? false,
        price: price ?? null,
        isPPV: isPPV ?? false,
      },
    });

    return NextResponse.json(message);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed" }, { status: 500 });
  }
}
