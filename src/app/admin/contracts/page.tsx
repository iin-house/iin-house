import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export default async function ContractsPage() {
  const contracts = await prisma.contract.findMany({
    include: { creators: { select: { displayName: true, verificationStatus: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Contracts & Revenue Splits</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Manage creator agreements and platform revenue splits</p>

        <div style={{ display: "grid", gap: 12 }}>
          {contracts.map((c) => (
            <div key={c.id} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>v{c.termsVersion}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {c.creators.map((cr) => cr.displayName).join(", ")} — {Number(c.revenueSplitPct)}% / 20% platform
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                    {c.signedAt ? `Signed ${c.signedAt.toLocaleDateString()}` : "Not signed"}
                  </div>
                </div>
                <a href={c.documentUrl} className="btn btn-secondary btn-sm">View</a>
              </div>
            </div>
          ))}
          {contracts.length === 0 && <p style={{ color: "var(--text-3)" }}>No contracts yet</p>}
        </div>
      </main>
    </div>
  );
}
