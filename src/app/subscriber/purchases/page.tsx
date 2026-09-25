"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PurchasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/purchases")
        .then(r => r.ok ? r.json() : { purchases: [] })
        .then((data) => { setPurchases(data.purchases ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

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
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>My Purchases</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Pay-per-view content you've unlocked</p>

        {purchases.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No purchases yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Unlock exclusive content from creators.</p>
            <Link href="/feed" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Browse creators</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {purchases.map((purchase: any) => (
              <Link key={purchase.id} href={`/profile/${purchase.content?.creator?.userId ?? purchase.creatorId}`} className="card" style={{ padding: '16px 20px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {purchase.content?.caption?.slice(0, 60) ?? 'Content'} {purchase.content?.caption?.length > 60 ? '…' : ''}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: '2px' }}>
                  {purchase.content?.type ?? 'Post'} · ₹{Number(purchase.content?.ppvPrice ?? purchase.amount ?? 0)} · {new Date(purchase.purchasedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
