import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerification.upsert({
      where: { userId: user.id },
      update: { token, expiresAt, used: false },
      create: { userId: user.id, token, expiresAt },
    });

    // In production: send email with verification link
    // For now, return the token so it can be tested
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
    return NextResponse.json({ ok: true, verifyUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
