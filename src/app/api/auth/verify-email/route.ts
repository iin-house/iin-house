import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyEmail as verifyEmailToken } from "@/app/(auth)/register/actions";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?status=invalid", req.url));
  }

  const result = await verifyEmailToken(token);

  if (result.error) {
    return NextResponse.redirect(new URL("/verify-email?status=expired", req.url));
  }

  return NextResponse.redirect(new URL("/verify-email?status=success", req.url));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ verified: true });
  }

  // Generate and send verification token
  const verifyToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await prisma.emailVerification.upsert({
      where: { userId: user.id },
      create: { userId: user.id, token: verifyToken, expiresAt },
      update: { token: verifyToken, expiresAt, used: false },
    });
  } catch {
    return NextResponse.json({ error: "Could not create verification token" }, { status: 500 });
  }

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verifyToken}`;
  const { sendEmail, verifyEmailHtml } = await import("@/lib/email");
  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: verifyEmailHtml(verifyToken, user.email ?? "there"),
  }).catch(() => {});

  return NextResponse.json({ verified: false, message: `Verification email sent. Check your inbox.` });
}
