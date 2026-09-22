"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";

export async function requestPayout(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "CREATOR") {
    return { error: "Forbidden" };
  }

  const amount = Number(formData.get("amount"));
  const periodStart = formData.get("periodStart") as string;
  const periodEnd = formData.get("periodEnd") as string;

  if (!amount || !periodStart || !periodEnd) {
    return { error: "Missing required fields" };
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!profile) return { error: "No creator profile" };

  const payout = await prisma.payout.create({
    data: {
      creatorId: profile.id,
      amount: String(amount),
      currency: "INR",
      reference: `${periodStart} → ${periodEnd}`,
      status: "PENDING",
    },
  });

  return { ok: true, payout };
}
