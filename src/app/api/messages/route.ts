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
  const receiverId = searchParams.get("receiverId");
  if (!receiverId) {
    return NextResponse.json({ error: "Missing receiverId" }, { status: 400 });
  }

  const userId = (session.user as any).id;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  // Mark messages as read
  await prisma.message.updateMany({
    where: { senderId: receiverId, receiverId: userId, read: false },
    data: { read: true, updatedAt: new Date() },
  });

  return NextResponse.json(messages);
}

const sendSchema = z.object({
  receiverId: z.string().min(1),
  body: z.string().min(1).max(2000),
  encrypted: z.boolean().optional(),
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
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { receiverId, body: msgBody, encrypted } = parsed.data;
    const senderId = (session.user as any).id;

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        body: msgBody,
        encrypted: encrypted ?? false,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to send message" }, { status: 500 });
  }
}
