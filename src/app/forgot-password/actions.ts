"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendEmail, passwordResetEmail } from "@/lib/email";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(10),
});

export async function requestPasswordReset(formData: FormData) {
  const parsed = requestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Enter a valid email" };

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: true }; // Don't reveal if email exists

  // Invalidate previous tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = (await import("crypto")).randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordReset.create({
    data: { userId: user.id, token, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password — iin house",
    html: passwordResetEmail(resetLink),
  });

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  const parsed = resetSchema.safeParse({ token, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const record = await prisma.passwordReset.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or expired. Request a new one." };
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });
  await prisma.passwordReset.update({
    where: { id: record.id },
    data: { used: true },
  });

  // Note: With JWT session strategy, sessions are stateless.
  // Client should clear cookies on the frontend after password reset.

  return { success: true };
}
