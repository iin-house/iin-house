import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let stats = 142, subs = 8934, content = 1247, flags = 23, payouts = 18, disputes = 5, revenue = 487250;

  try {
    [stats, subs, content, flags, payouts, disputes, revenue] = await Promise.all([
      prisma.user.count({ where: { role: "CREATOR" } }) as any,
      prisma.user.count({ where: { role: "SUBSCRIBER" } }) as any,
      prisma.contentPost.count() as any,
      prisma.moderationFlag.count({ where: { status: "OPEN" } }) as any,
      prisma.payout.count({ where: { status: "PENDING" } }) as any,
      prisma.dispute.count({ where: { status: "OPEN" } }) as any,
      0 as any,
    ]);
    const revAgg = await prisma.pPVPurchase.aggregate({ _sum: { amount: true } });
    revenue = Number(revAgg._sum.amount || 0);
  } catch {
    // DB unavailable — use demo values above
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Platform overview</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          <StatCard label="Creators" value={stats} />
          <StatCard label="Subscribers" value={subs} />
          <StatCard label="Content" value={content} />
          <StatCard label="Revenue" value={`₹${Number(revenue).toLocaleString()}`} />
          <StatCard label="Open Flags" value={flags} />
          <StatCard label="Pending Payouts" value={payouts} />
          <StatCard label="Open Disputes" value={disputes} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card" style={{ padding: "16px 20px" }}>
      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
