import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { logAudit } from "@/lib/audit";

export default async function KYCPage() {
  const [pending, reviewed] = await Promise.all([
    prisma.ageVerification.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ageVerification.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { reviewedAt: "desc" },
      take: 20,
    }),
  ]);

  // Resolve user emails/phones in a single query
  const allUserIds = Array.from(new Set([...pending, ...reviewed].map((x) => x.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: allUserIds } },
    select: { id: true, email: true, phone: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>KYC Queue</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Age verification submissions</p>

        <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
          {pending.map((item) => (
            <div key={item.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{userById.get(item.userId)?.email ?? userById.get(item.userId)?.phone ?? item.userId}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Submitted {item.createdAt.toLocaleDateString()}</div>
                <a href={item.documentUrl} className="gradient-text" style={{ fontSize: 12, display: "block", marginTop: 4 }}>View document</a>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <form action={`/admin/kyc/${item.id}`} method="POST">
                  <input type="hidden" name="action" value="approve" />
                  <button type="submit" className="btn btn-primary btn-sm">Approve</button>
                </form>
                <form action={`/admin/kyc/${item.id}`} method="POST">
                  <input type="hidden" name="action" value="reject" />
                  <input type="hidden" name="notes" value="Rejected by admin" />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ color: "var(--danger)" }}>Reject</button>
                </form>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p style={{ color: "var(--text-3)" }}>No pending verifications</p>}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Reviewed</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {reviewed.map((item) => (
            <div key={item.id} style={{
              padding: "12px 16px",
              background: "var(--surface-2)",
              borderRadius: 12,
              fontSize: 13,
            }}>
              <span style={{ fontWeight: 500 }}>{userById.get(item.userId)?.email ?? userById.get(item.userId)?.phone ?? item.userId}</span>
              <span className={`badge ${item.status === "APPROVED" ? "badge-primary" : "badge-secondary"}`} style={{ marginLeft: 8 }}>
                {item.status}
              </span>
              <span style={{ color: "var(--text-3)", marginLeft: 8 }}>{item.reviewedAt?.toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
