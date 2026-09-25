import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: (session.user as any).id,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: (session.user as any).id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, title, body: bodyText, link } = body;

  if (!type || !title || !bodyText) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      userId: (session.user as any).id,
      type,
      title,
      body: bodyText,
      link: link ?? null,
    },
  });

  return NextResponse.json(notification);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { notificationId, read } = body;

  if (notificationId) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: read ?? true },
    });
    return NextResponse.json({ ok: true });
  }

  // Mark all as read
  await prisma.notification.updateMany({
    where: { userId: (session.user as any).id, read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.notification.delete({ where: { id: id } });
  } else {
    await prisma.notification.deleteMany({
      where: { userId: (session.user as any).id },
    });
  }

  return NextResponse.json({ ok: true });
}
