import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await prisma.user.count({ where: { role: "CREATOR" } });
  const subs = await prisma.user.count({ where: { role: "SUBSCRIBER" } });
  const content = await prisma.contentPost.count();
  const flags = await prisma.moderationFlag.count({ where: { status: "OPEN" } });
  const payouts = await prisma.payout.count({ where: { status: "PENDING" } });
  const disputes = await prisma.dispute.count({ where: { status: "OPEN" } });

  const revenue = await prisma.pPVPurchase.aggregate({ _sum: { amount: true } });

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
          <StatCard label="Revenue" value={`₹${Number(revenue._sum.amount || 0).toLocaleString()}`} />
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
