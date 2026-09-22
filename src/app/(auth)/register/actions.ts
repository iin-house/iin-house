"use server";

import { prisma } from "@/lib/db";
import { hashPassword, isStrongPassword } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

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

    // TODO: Send verification email via Resend when email service is configured
    // await sendVerificationEmail(user.email, user.id);

    redirect("/login");
  } catch (e: any) {
    if (e.code === "P2002") {
      return { error: "Email or phone already registered" };
    }
    return { error: e.message ?? "Registration failed" };
  }
}
