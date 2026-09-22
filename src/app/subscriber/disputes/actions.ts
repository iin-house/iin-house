"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { z } from "zod";

const disputeSchema = z.object({
  type: z.string().min(1).max(50),
  description: z.string().min(1).max(1000),
});

export async function submitDispute(data: { type: string; description: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = disputeSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const dispute = await prisma.dispute.create({
    data: {
      userId: (session.user as any).id,
      type: parsed.data.type,
      description: parsed.data.description,
      status: "OPEN",
    },
  });

  return { ok: true, dispute };
}
