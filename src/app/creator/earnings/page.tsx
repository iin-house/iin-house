"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EarningsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetch("/api/creator/stats").then(r => r.ok ? r.json() : null).then(d => { if (d) setStats(d); });
  }, [status]);

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  const totalRevenue = stats?.totalRevenue ?? 0;
  const ppvRevenue = stats?.ppvRevenue ?? 0;
  const subRevenue = stats?.monthlySubRevenue ?? 0;
  const pendingPayout = stats?.pendingPayout ?? 0;
  const completedPayouts = stats?.totalPayouts ?? 0;
  const total = totalRevenue || 1;

  const metrics = [
    { label: "Total revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}` },
    { label: "Subscriptions", value: `₹${subRevenue.toLocaleString("en-IN")}` },
    { label: "PPV sales", value: `₹${ppvRevenue.toLocaleString("en-IN")}` },
    { label: "Paid out", value: `₹${completedPayouts.toLocaleString("en-IN")}` },
    { label: "Pending", value: `₹${pendingPayout.toLocaleString("en-IN")}` },
  ];

  const subPct = totalRevenue > 0 ? (subRevenue / total * 100) : 0;
  const ppvPct = totalRevenue > 0 ? (ppvRevenue / total * 100) : 0;
  const tiers = stats?.tierBreakdown ?? [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '800px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Earnings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Revenue breakdown and analytics</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }} className="stagger">
          {metrics.map(m => (
            <div key={m.label} className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{m.value}</div>
            </div>
          ))}
        </div>

        {tiers.length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Tier Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tiers.map((t: any) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', width: '90px' }}>{t.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)', width: '60px' }}>₹{Number(t.price).toLocaleString()}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(t.subscribers / (stats?.activeSubs || 1)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #db2777)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, width: '70px', textAlign: 'right' }}>{t.subscribers} subs</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Revenue Mix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', width: '80px' }}>Subscriptions</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${subPct}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #db2777)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, width: '45px', textAlign: 'right' }}>{subPct.toFixed(0)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', width: '80px' }}>PPV</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${ppvPct}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, width: '45px', textAlign: 'right' }}>{ppvPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent Activity</h3>
          {stats?.recentSubs?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentSubs.map((sub: any, i: number) => (
                <div key={i} className="list-row">
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{sub.email || 'Anonymous'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{sub.tier ?? 'Subscription'} · {sub.date}</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>+₹{sub.tierPrice?.toLocaleString() ?? '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>No recent activity</p>
          )}
        </div>
      </main>
    </div>
  );
}
