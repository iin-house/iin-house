import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export default async function PayoutsPage() {
  const payouts = await prisma.payout.findMany({
    orderBy: { requestedAt: "desc" },
    include: { creator: { select: { displayName: true, verificationStatus: true } } },
  });

  const totalPending = payouts.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + Number(p.amount), 0);
  const totalCompleted = payouts.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Payout Approval</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Review creator payout requests</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ padding: "16px 20px", flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Pending</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₹{totalPending.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: "16px 20px", flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Completed</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₹{totalCompleted.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {payouts.map((p) => (
            <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.creator.displayName}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                  ₹{Number(p.amount).toLocaleString()} — {p.requestedAt.toLocaleDateString()}
                </div>
              </div>
              <span className={`badge ${p.status === "PENDING" ? "badge-secondary" : p.status === "COMPLETED" ? "badge-primary" : "badge-secondary"}`}>
                {p.status}
              </span>
              {p.status === "PENDING" && (
                <form action={`/admin/payouts/${p.id}`} method="POST" style={{ display: "flex", gap: 6 }}>
                  <button type="submit" name="action" value="approve" className="btn btn-primary btn-sm">Approve</button>
                  <button type="submit" name="action" value="reject" className="btn btn-secondary btn-sm" style={{ color: "var(--danger)" }}>Reject</button>
                </form>
              )}
            </div>
          ))}
          {payouts.length === 0 && <p style={{ color: "var(--text-3)" }}>No payouts yet</p>}
        </div>
      </main>
    </div>
  );
}
