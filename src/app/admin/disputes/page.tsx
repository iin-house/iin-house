import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function DisputesPage() {
  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Disputes</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Billing and content disputes</p>

        <div style={{ display: "grid", gap: 12 }}>
          {disputes.map((d) => (
            <div key={d.id} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{d.type}: {d.description.slice(0, 100)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {d.userId} — {d.createdAt.toLocaleDateString()}
                  </div>
                  {d.resolution && (
                    <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4, padding: "8px 12px", background: "var(--surface-3)", borderRadius: 8 }}>
                      Resolution: {d.resolution}
                    </div>
                  )}
                </div>
                <span className={`badge ${d.status === "OPEN" ? "badge-secondary" : "badge-primary"}`}>
                  {d.status}
                </span>
              </div>
              {d.status === "OPEN" && (
                <form action={`/admin/disputes/${d.id}`} method="POST" style={{ marginTop: 12 }}>
                  <input type="hidden" name="resolution" value="Resolved by admin" />
                  <button type="submit" className="btn btn-primary btn-sm">Resolve</button>
                </form>
              )}
            </div>
          ))}
          {disputes.length === 0 && <p style={{ color: "var(--text-3)" }}>No disputes</p>}
        </div>
      </main>
    </div>
  );
}
