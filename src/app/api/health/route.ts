import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    status: "ok",
    services: {},
  };

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.services.database = { status: "ok" };
  } catch (e) {
    checks.services.database = { status: "error", message: (e as Error).message };
    checks.status = "degraded";
  }

  // Storage check
  try {
    const { isStorageConfigured } = await import("@/lib/storage");
    checks.services.storage = { status: isStorageConfigured() ? "ok" : "not_configured" };
  } catch {
    checks.services.storage = { status: "error" };
  }

  const status = checks.status === "ok" ? 200 : 503;
  return NextResponse.json(checks, { status });
}
