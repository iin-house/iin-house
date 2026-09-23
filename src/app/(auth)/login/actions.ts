"use server";

import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";
import { limitAuthAttempts } from "@/lib/rate-limit";

export async function rateLimitedLogin(identifier: string, password: string) {
  // Rate limit by identifier (email or IP)
  const rateKey = identifier.includes("@") ? identifier : `phone:${identifier}`;
  const limit = await limitAuthAttempts(rateKey);
  if (!limit.success) {
    const retrySecs = Math.ceil((limit.retryAfter ?? 300) / 1000);
    return { error: `Too many attempts. Try again in ${retrySecs}s.`, locked: true };
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] },
  });

  if (!user) {
    return { error: "Invalid credentials", locked: false };
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid credentials", locked: false };
  }

  return {
    success: true,
    user: { id: user.id, email: user.email, role: user.role, name: user.email ?? user.phone },
  };
}
