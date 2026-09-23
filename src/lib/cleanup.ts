import { prisma } from "@/lib/db";

/**
 * Delete PasswordReset records older than 24 hours.
 *
 * Call from a cron job to prevent the table from growing indefinitely.
 *
 * @returns The number of records deleted
 */
export async function cleanupExpiredResets(): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await prisma.passwordReset.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });

  return result.count;
}
