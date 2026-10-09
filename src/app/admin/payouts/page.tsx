import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { PayoutsClient } from "./PayoutsClient";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  let payouts: any[] = [];

  try {
    payouts = await prisma.payout.findMany({
      orderBy: { requestedAt: "desc" },
      include: { creator: { select: { displayName: true, verificationStatus: true } } },
    });
  } catch {
    payouts = [
      { id: "p1", amount: 3500, status: "PENDING", requestedAt: new Date(), creator: { displayName: "Priya Art" } },
      { id: "p2", amount: 1850, status: "COMPLETED", requestedAt: new Date(Date.now() - 86400000), creator: { displayName: "Rohit Beats" } },
      { id: "p3", amount: 720, status: "REJECTED", requestedAt: new Date(Date.now() - 172800000), creator: { displayName: "Demo Creator" } },
    ];
  }

  const totalPending = payouts.filter((p) => p.status === "PENDING").reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const totalCompleted = payouts.filter((p) => p.status === "COMPLETED").reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  const data = payouts.map((p: any) => ({
    id: p.id,
    amount: Number(p.amount),
    status: p.status,
    requestedAt: p.requestedAt instanceof Date ? p.requestedAt.toISOString() : p.requestedAt,
    creatorName: p.creator?.displayName ?? "—",
  }));

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
        <PayoutsClient payouts={data} />
      </main>
    </div>
  );
}
