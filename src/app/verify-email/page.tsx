import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string; status?: string } }) {
  const { token, status } = searchParams;

  // When arriving from the email link with a token
  if (token) {
    let record: any = null;
    try {
      record = await prisma.emailVerification.findUnique({ where: { token } });
    } catch {
      // DB unavailable
    }

    const isValid = record && !record.used && new Date(record.expiresAt) >= new Date();

    if (!isValid) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
          <div className="card p-8 max-w-sm text-center">
            <h1 className="text-xl font-bold mb-2">Link expired</h1>
            <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>This verification link has expired. Request a new one.</p>
            <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>Back to sign in</Link>
          </div>
        </div>
      );
    }

    try {
      await prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      });
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: { used: true },
      });
    } catch {
      // DB unavailable
    }

    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="card p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold mb-2">Email verified</h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>Your email has been confirmed. You can now sign in.</p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>Sign in</Link>
        </div>
      </div>
    );
  }

  // When redirected back with a status (no token)
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="card p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold mb-2">Email verified</h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>Your email has been confirmed.</p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="card p-8 max-w-sm text-center">
        <h1 className="text-xl font-bold mb-2">Invalid link</h1>
        <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>This verification link is missing or expired.</p>
        <Link href="/login" className="btn btn-primary" style={{ width: "100%" }}>Back to sign in</Link>
      </div>
    </div>
  );
}
