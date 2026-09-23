"use server";

import { prisma } from "@/lib/db";
import { hashPassword, isStrongPassword } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendEmail, welcomeEmail, verifyEmailHtml } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(10),
  role: z.enum(["CREATOR", "SUBSCRIBER"]),
  displayName: z.string().optional().or(z.literal("")),
});

export async function register(data: {
  email?: string;
  phone?: string;
  password: string;
  role: "CREATOR" | "SUBSCRIBER";
  displayName?: string;
}) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, phone, password, role, displayName } = parsed.data;
  const cleanEmail = email || undefined;
  const cleanPhone = phone || undefined;

  if (!cleanEmail && !cleanPhone) return { error: "Email or phone required" };
  if (!isStrongPassword(password)) return { error: "Password too weak — use 10+ characters with mixed case, numbers, and symbols" };

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role,
        creatorProfile: role === "CREATOR" ? {
          create: { displayName: displayName || cleanEmail || cleanPhone || "Creator" },
        } : undefined,
      },
    });

    if (cleanEmail) {
      // Send welcome email
      sendEmail({
        to: cleanEmail,
        subject: "Welcome to iin house",
        html: welcomeEmail(displayName || cleanEmail),
      }).catch((err) => console.error("[register] welcome email failed:", err));

      // Send verification email
      const verifyToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      try {
        await prisma.emailVerification.create({
          data: {
            userId: user.id,
            token: verifyToken,
            expiresAt,
          },
        });
        sendEmail({
          to: cleanEmail,
          subject: "Verify your email",
          html: verifyEmailHtml(verifyToken, displayName || cleanEmail),
        }).catch((err) => console.error("[register] verify email failed:", err));
      } catch (err) {
        console.error("[register] could not create email verification:", err);
      }
    }

    redirect("/login?registered=true");
  } catch (e: any) {
    if (e.code === "P2002") {
      return { error: "Email or phone already registered" };
    }
    return { error: e.message ?? "Registration failed" };
  }
}

export async function verifyEmail(token: string) {
  if (!token) return { error: "Token required" };

  try {
    const record = await prisma.emailVerification.findUnique({ where: { token } });
    if (!record || record.used) return { error: "Invalid or already used token" };
    if (new Date(record.expiresAt) < new Date()) return { error: "Token expired" };

    await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } });
    await prisma.emailVerification.update({ where: { id: record.id }, data: { used: true } });

    return { success: true };
  } catch (e: any) {
    return { error: e.message ?? "Verification failed" };
  }
}
