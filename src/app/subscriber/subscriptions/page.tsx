"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/subscriptions")
        .then(r => r.ok ? r.json() : { subscriptions: [] })
        .then((data) => { setSubscriptions(data.subscriptions ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const cancel = async (subId: string) => {
    await fetch(`/api/subscriptions?id=${subId}`, { method: "DELETE" });
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    toast.success("Subscription cancelled");
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/feed" style={{ fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none' }}>← Back</Link>
          <span className="gradient-text font-bold text-base">iin house</span>
          <div style={{ width: '40px' }} />
        </div>
      </header>
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Subscriptions</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Manage your active subscriptions</p>

        {subscriptions.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No active subscriptions</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Browse creators to find your next favorite.</p>
            <Link href="/feed" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex', textDecoration: 'none' }}>Browse creators</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {subscriptions.map((sub: any) => (
              <div key={sub.id} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{sub.creator?.displayName ?? 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: '2px' }}>
                      {sub.tier?.name ?? 'Tier'} · ₹{Number(sub.tier?.price ?? 0)}/mo · Since {new Date(sub.startedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button onClick={() => cancel(sub.id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
