"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import { TrendingUp, Users, DollarSign, Eye } from "lucide-react";

type Stats = {
  totalCreators: number;
  totalSpent: number;
  ppvPurchases: number;
  totalViews: number;
  topCreators: any[];
  recentActivity: any[];
};

export default function SubscriberAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/billing").then(r => r.ok ? r.json() : null),
        fetch("/api/subscriber/stats").then(r => r.ok ? r.json() : null),
      ]).then(([billing, subscriberStats]) => {
        setStats({
          totalCreators: subscriberStats?.totalCreators ?? 0,
          totalSpent: billing?.totals?.totalSpent ?? 0,
          ppvPurchases: billing?.totals?.ppvCount ?? 0,
          totalViews: subscriberStats?.totalViews ?? 0,
          topCreators: subscriberStats?.topCreators ?? [],
          recentActivity: subscriberStats?.recentActivity ?? [],
        });
        setLoading(false);
      });
    }
  }, [status, router]);

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session || !stats) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '720px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '4px' }}>Your Insights</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '24px' }}>Your activity across the platform</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }} className="stagger">
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Creators</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.totalCreators}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Total spent</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>₹{stats.totalSpent.toLocaleString("en-IN")}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>PPV unlocked</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.ppvPurchases}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Top creators</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.topCreators.length}</div>
          </div>
        </div>

        {stats.topCreators.length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Your top creators</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.topCreators.map((c: any, i: number) => (
                <div key={c.id || i} className="list-row">
                  <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>{(c.displayName || 'C')[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.displayName || "Creator"}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{c.postCount ?? 0} posts · {c.subCount ?? 0} subs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.recentActivity.length > 0 && (
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Recent activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.recentActivity.slice(0, 10).map((a: any, i: number) => (
                <div key={i} className="list-row">
                  <div style={{ fontSize: 16, flexShrink: 0 }}>{a.icon ?? "•"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title || a.text || "Activity"}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{new Date(a.date || Date.now()).toLocaleDateString("en-IN")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
