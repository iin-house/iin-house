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

  const metrics = stats ? [
    { label: "This month", value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K` },
    { label: "Last month", value: "₹21.8K" },
    { label: "Total earned", value: "₹2.1L" },
  ] : [
    { label: "This month", value: "—" },
    { label: "Last month", value: "—" },
    { label: "Total earned", value: "—" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '800px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Earnings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Revenue breakdown and analytics</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }} className="stagger">
          {metrics.map(m => (
            <div key={m.label} className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Revenue Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', width: '80px' }}>Subscriptions</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #ec4899, #db2777)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, width: '50px', textAlign: 'right' }}>72%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', width: '80px' }}>PPV</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, width: '50px', textAlign: 'right' }}>20%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', width: '80px' }}>Tips</span>
              <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '8%', height: '100%', background: 'linear-gradient(90deg, #059669, #34d399)', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, width: '50px', textAlign: 'right' }}>8%</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Transaction History</h3>
          <div className="list-row">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>💳</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Subscriptions</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Jan 2026 · 847 payments</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>+₹18,200</span>
          </div>
          <div className="list-row">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>💎</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>PPV Purchases</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Jan 2026 · 156 purchases</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>+₹6,300</span>
          </div>
        </div>
      </main>
    </div>
  );
}
