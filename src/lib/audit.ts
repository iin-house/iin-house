import { prisma } from "./db";

export async function logAudit(params: {
  userId?: string;
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const { userId, ...rest } = params;
  const data: Record<string, unknown> = { ...rest };
  if (userId !== undefined) data.userId = userId;
  await prisma.auditLog.create({ data: data as any });
}
