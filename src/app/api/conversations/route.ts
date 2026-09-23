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

  const userId = (session.user as any).id;
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const otherIds = new Set<string>();
  for (const m of messages) {
    if (m.senderId !== userId) otherIds.add(m.senderId);
    if (m.receiverId !== userId) otherIds.add(m.receiverId);
  }

  const users = await prisma.user.findMany({
    where: { id: { in: Array.from(otherIds) } },
    select: { id: true, email: true, phone: true },
  });
  const nameMap = new Map(users.map((u) => [u.id, u.email ?? u.phone ?? "Unknown"]));

  const seen = new Set<string>();
  const result: Array<{
    otherId: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
  }> = [];

  for (const m of messages) {
    const otherId = m.senderId === userId ? m.receiverId : m.senderId;
    if (seen.has(otherId)) continue;
    seen.add(otherId);

    const unread = await prisma.message.count({
      where: { senderId: otherId, receiverId: userId, read: false },
    });

    result.push({
      otherId,
      name: nameMap.get(otherId) ?? "Unknown",
      lastMessage: m.body.slice(0, 60),
      time: m.createdAt.toLocaleDateString(),
      unread,
    });
  }

  return NextResponse.json(result);
}
