"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CreatorNav } from "@/components/CreatorNav";
import { Users, DollarSign, Shield, MessageCircle, TrendingUp, ArrowUpRight } from "lucide-react";

type Stats = {
  activeSubs: number;
  ppvPurchases: number;
  totalRevenue: number;
  totalPayouts: number;
  ppvRevenue: number;
  recentSubs: Array<{ email: string | null; date: string }>;
};

export default function CreatorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/creator/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); });
  }, [status]);

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  const metrics = [
    { label: "Revenue", value: stats ? `₹${(stats.totalRevenue / 1000).toFixed(1)}K` : "—", icon: DollarSign, trend: "+12.5%" },
    { label: "Subscribers", value: stats?.activeSubs.toLocaleString() ?? "—", icon: Users, trend: "+8.2%" },
    { label: "Posts", value: stats?.ppvPurchases.toLocaleString() ?? "—", icon: TrendingUp, trend: "this week" },
    { label: "Verified", value: "KYC ✓", icon: Shield, trend: "Approved" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ padding: '28px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Welcome back, Creator</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px', marginBottom: '28px'
        }} className="stagger">
          {metrics.map(m => (
            <div key={m.label} className="card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>{m.label}</span>
                <m.icon size={14} style={{ color: 'var(--text-4)' }} />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>{m.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ArrowUpRight size={11} /> {m.trend}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Recent subscribers</h3>
            {!stats ? (
              <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading…</p>
            ) : stats.recentSubs.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>No subscribers yet.</p>
            ) : (
              <div>
                {stats.recentSubs.map((s, i) => (
                  <div key={i} className="list-row">
                    <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                      {(s.email?.[0] || 'S').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Joined Gold tier</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Quick actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              <Link href="/creator/upload" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                + New post
              </Link>
              <Link href="/creator/tiers" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Manage tiers
              </Link>
              <Link href="/creator/earnings" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View earnings
              </Link>
              <Link href="/creator/payouts" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Request payout
              </Link>
            </div>
            <div className="sep" style={{ margin: '16px 0' }} />
            <Link href="/creator/messages" className="list-row">
              <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
                <MessageCircle size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>New messages</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>3 unread</div>
              </div>
              <span className="badge badge-primary">3</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
