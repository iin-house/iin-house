"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { Share2, Copy, Users, Gift, CheckCircle2 } from "lucide-react";

type Referral = {
  id: string;
  code: string;
  totalUses: number;
  totalEarnings: number;
  referredUsers: Array<{ id: string; name: string; date: string }>;
};

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/referrals")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setReferral(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const copyCode = async () => {
    if (!referral) return;
    try {
      await navigator.clipboard.writeText(referral.code);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '600px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>Refer & Earn</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '24px' }}>Share your code and earn rewards when friends join</p>

        {referral && (
          <>
            <div className="card" style={{ padding: '24px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(236,72,153,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Gift size={28} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>Your referral code</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Share this with friends</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  flex: 1, background: 'var(--surface-3)', borderRadius: '12px', padding: '14px 18px',
                  fontSize: '22px', fontWeight: 800, letterSpacing: '0.1em', textAlign: 'center',
                  color: 'var(--primary)',
                }}>
                  {referral.code}
                </div>
                <button onClick={copyCode} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Copy size={16} /> Copy
                </button>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{referral.totalUses}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Referrals</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>₹{referral.totalEarnings.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Earned</div>
                </div>
              </div>
            </div>

            {referral.referredUsers.length > 0 && (
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--sep)' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Referred users</h3>
                </div>
                {referral.referredUsers.map((u, i) => (
                  <div key={u.id} className="list-row" style={{ padding: '12px 20px', borderBottom: i < referral.referredUsers.length - 1 ? '0.5px solid var(--sep)' : 'none' }}>
                    <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>{u.name?.[0]?.toUpperCase() || 'U'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{u.name || "User"}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Joined {new Date(u.date).toLocaleDateString("en-IN")}</div>
                    </div>
                    <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
