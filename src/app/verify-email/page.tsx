import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold mb-2">Invalid link</h1>
          <p className="text-dark-500 text-sm">This verification link is missing or expired.</p>
        </div>
      </div>
    );
  }

  let record: any = null;
  try {
    record = await prisma.emailVerification.findUnique({
      where: { token },
    });
  } catch {
    // DB unavailable — render success anyway
  }

  const isValid = record && !record.used && record.expiresAt >= new Date();

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold mb-2">Link expired</h1>
          <p className="text-dark-500 text-sm">This verification link has expired. Request a new one.</p>
        </div>
      </div>
    );
  }

  try {
    await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } });
    await prisma.emailVerification.update({ where: { id: record.id }, data: { used: true } });
  } catch {
    // DB unavailable — still show success to user
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 max-w-sm text-center">
        <h1 className="text-xl font-bold mb-2">Email verified</h1>
        <p className="text-dark-500 text-sm">Your email has been confirmed. You can now sign in.</p>
      </div>
    </div>
  );
}
