"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { ArrowUpDown, X } from "lucide-react";

type Subscription = {
  id: string;
  tier: { id: string; name: string; price: number; currency: string };
  creator: { displayName: string; userId: string };
  startedAt: string;
  status: string;
};

type TierOption = {
  id: string;
  name: string;
  price: number;
  currency: string;
};

export default function ManageSubscriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);
  const [allTiers, setAllTiers] = useState<Record<string, TierOption[]>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/subscriptions").then(r => r.ok ? r.json() : { subscriptions: [] }),
        fetch("/api/tiers").then(r => r.ok ? r.json() : []),
      ]).then(([subsData, tiersData]) => {
        const subs = (subsData.subscriptions ?? []).filter((s: Subscription) => s.status === "ACTIVE");
        setSubscriptions(subs);

        const tiersByCreator: Record<string, TierOption[]> = {};
        (tiersData as TierOption[]).forEach((t: any) => {
          if (!tiersByCreator[t.creatorId]) tiersByCreator[t.creatorId] = [];
          tiersByCreator[t.creatorId].push(t);
        });
        setAllTiers(tiersByCreator);
        setLoading(false);
      });
    }
  }, [status, router]);

  const handleSwitch = async (subId: string, tierId: string) => {
    setSwitching(subId);
    try {
      const res = await fetch(`/api/subscriptions?id=${subId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to switch tier");
      }
      toast.success("Tier switched successfully");
      setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, tier: (s.tier as any) } : s));
      setSwitching(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to switch tier");
      setSwitching(null);
    }
  };

  const handleCancel = async (subId: string) => {
    if (!confirm("Cancel this subscription? You'll lose access at the end of your billing period.")) return;
    await fetch(`/api/subscriptions?id=${subId}`, { method: "DELETE" });
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    toast.success("Subscription cancelled");
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>Manage Subscriptions</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '24px' }}>Upgrade, downgrade, or cancel</p>

        {subscriptions.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
            <p style={{ fontSize: '14px', fontWeight: 500 }}>No active subscriptions</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Browse creators to start subscribing.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subscriptions.map(sub => {
              const creatorTiers = allTiers[sub.creator.userId] || [];
              const canSwitch = creatorTiers.length > 1;

              return (
                <div key={sub.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{sub.creator.displayName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                        {sub.tier.name} · ₹{Number(sub.tier.price).toLocaleString()}/mo · Since {new Date(sub.startedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <button onClick={() => handleCancel(sub.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>

                  {canSwitch && (
                    <div style={{ borderTop: '0.5px solid var(--sep)', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Switch tier</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {creatorTiers.map(tier => (
                          <button
                            key={tier.id}
                            onClick={() => handleSwitch(sub.id, tier.id)}
                            disabled={switching === sub.id}
                            className={`btn btn-sm ${tier.id === sub.tier.id ? "btn-primary" : "btn-secondary"}`}
                            style={{ borderRadius: '10px', fontSize: '12px' }}
                          >
                            {switching === sub.id ? "…" : tier.name}
                            <span style={{ opacity: 0.7 }}>₹{Number(tier.price).toLocaleString()}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
