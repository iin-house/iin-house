import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  let creators = 142, subscribers = 8934, totalContent = 1247, totalRevenue = 487250, pendingPayouts = 18, disputes = 5;

  try {
    [creators, subscribers, totalContent, pendingPayouts, disputes] = await Promise.all([
      prisma.user.count({ where: { role: "CREATOR" } }) as any,
      prisma.user.count({ where: { role: "SUBSCRIBER" } }) as any,
      prisma.contentPost.count() as any,
      prisma.payout.count({ where: { status: "PENDING" } }) as any,
      prisma.dispute.count({ where: { status: "OPEN" } }) as any,
    ]);
    const revAgg = await prisma.pPVPurchase.aggregate({ _sum: { amount: true } });
    totalRevenue = Number(revAgg._sum.amount || 0);
  } catch {
    // DB unavailable — use demo values
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <AdminNav />
      <main className="container" style={{ padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Platform Analytics</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24 }}>Key metrics and trends</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
          <StatCard label="Creators" value={creators} />
          <StatCard label="Subscribers" value={subscribers} />
          <StatCard label="Total Content" value={totalContent} />
          <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
          <StatCard label="Pending Payouts" value={pendingPayouts} />
          <StatCard label="Open Disputes" value={disputes} />
        </div>

        <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Growth Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ padding: "16px", background: "var(--surface-3)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Avg. Subscriptions per Creator</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{creators ? Math.round(subscribers / creators) : 0}</div>
            </div>
            <div style={{ padding: "16px", background: "var(--surface-3)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Content per Creator</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{creators ? Math.round(totalContent / creators) : 0}</div>
            </div>
            <div style={{ padding: "16px", background: "var(--surface-3)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Avg. PPV Revenue</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>₹{Math.round(totalRevenue / Math.max(totalContent, 1))}</div>
            </div>
          </div>
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
