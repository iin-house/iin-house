import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

const docTypeLabels: Record<string, string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID Card",
};

export default async function KYCPage() {
  const [pending, reviewed] = await Promise.all([
    prisma.kycDocument.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, phone: true, role: true } },
      },
    }),
    prisma.kycDocument.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { reviewedAt: "desc" },
      take: 20,
      include: {
        user: { select: { id: true, email: true, phone: true, role: true } },
      },
    }),
  ]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>KYC Queue</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Identity verification submissions</p>

        <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
          {pending.map((item) => {
            const userLabel = item.user.email ?? item.user.phone ?? item.userId;
            const docLabel = docTypeLabels[item.documentType] ?? item.documentType;
            return (
              <div
                key={item.id}
                className="card"
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{userLabel}</span>
                    <span className="badge badge-secondary" style={{ fontSize: 11 }}>{docLabel}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>Submitted {item.createdAt.toLocaleDateString()}</div>
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-text"
                    style={{ fontSize: 12, display: "inline-block", marginTop: 4 }}
                  >
                    View document →
                  </a>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <form action={`/admin/kyc/${item.id}`} method="POST">
                    <input type="hidden" name="action" value="approve" />
                    <button type="submit" className="btn btn-primary btn-sm">Approve</button>
                  </form>
                  <form action={`/admin/kyc/${item.id}`} method="POST">
                    <input type="hidden" name="action" value="reject" />
                    <input type="hidden" name="notes" value="Document unclear or invalid" />
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ color: "var(--danger)" }}>Reject</button>
                  </form>
                </div>
              </div>
            );
          })}
          {pending.length === 0 && (
            <p style={{ color: "var(--text-3)", fontSize: 13 }}>No pending verifications</p>
          )}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Reviewed</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {reviewed.map((item) => {
            const userLabel = item.user.email ?? item.user.phone ?? item.userId;
            const docLabel = docTypeLabels[item.documentType] ?? item.documentType;
            return (
              <div
                key={item.id}
                style={{
                  padding: "12px 16px",
                  background: "var(--surface-2)",
                  borderRadius: 12,
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 500 }}>{userLabel}</span>
                <span className="badge badge-secondary" style={{ marginLeft: 8, fontSize: 11 }}>{docLabel}</span>
                <span className={`badge ${item.status === "APPROVED" ? "badge-primary" : "badge-secondary"}`} style={{ marginLeft: 6 }}>
                  {item.status}
                </span>
                <span style={{ color: "var(--text-3)", marginLeft: 8 }}>
                  {item.reviewedAt?.toLocaleDateString()}
                </span>
                {item.notes && (
                  <span style={{ color: "var(--text-3)", marginLeft: 8, fontStyle: "italic" }}>
                    — {item.notes}
                  </span>
                )}
              </div>
            );
          })}
          {reviewed.length === 0 && (
            <p style={{ color: "var(--text-3)", fontSize: 13 }}>No reviewed documents yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
