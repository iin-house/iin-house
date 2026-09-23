"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type Tier = {
  id: string;
  name: string;
  price: number;
  currency: string;
  perksDescription?: string;
  active: boolean;
};

type Post = {
  id: string;
  type: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  isPPV: boolean;
  ppvPrice?: number;
  publishedAt?: string;
};

type CreatorProfile = {
  id: string;
  displayName: string;
  bio?: string;
  userId: string;
  tiers: Tier[];
  posts: Post[];
};

type User = {
  id: string;
  email?: string | null;
};

type ProfileData = {
  user: User;
  creatorProfile: CreatorProfile;
};

const palettes = [
  "linear-gradient(135deg, #9d174d, #be185d)",
  "linear-gradient(135deg, #7c3aed, #a78bfa)",
  "linear-gradient(135deg, #059669, #34d399)",
  "linear-gradient(135deg, #dc2626, #f87171)",
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch(`/api/profile/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!session?.user || !profile) return;
    fetch("/api/subscriptions")
      .then(r => r.ok ? r.json() : { subscriptions: [] })
      .then((data) => {
        const subs = data.subscriptions ?? [];
        setIsSubscribed(subs.some((s: any) => s.creator?.userId === profile.creatorProfile?.userId));
      });
  }, [session, profile]);

  const handleSubscribe = async () => {
    if (!selectedTier) return;
    setSubscribing(true);
    try {
      // Create Razorpay order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(selectedTier.price) }),
      });
      const order = await orderRes.json();
      if (!order.id) throw new Error("Failed to create payment order");

      // Open Razorpay checkout
      const { openRazorpayCheckout } = await import("@/lib/razorpay-client");
      await openRazorpayCheckout({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        onSuccess: async (payment: any) => {
          // Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: payment.razorpay_order_id,
              paymentId: payment.razorpay_payment_id,
              signature: payment.razorpay_signature,
            }),
          });
          const verify = await verifyRes.json();
          if (!verify.ok) throw new Error("Payment verification failed");

          // Create subscription
          const subRes = await fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ creatorId: profile!.creatorProfile.userId, tierId: selectedTier.id }),
          });
          if (!subRes.ok) throw new Error("Failed to create subscription");

          toast.success("Subscribed successfully!");
          setShowSubscribe(false);
          setIsSubscribed(true);
        },
        onFailure: () => toast.error("Payment failed or cancelled"),
      });
    } catch (e: any) {
      toast.error(e.message ?? "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!profile) return <div className="container" style={{ padding: 60 }}><p style={{ color: 'var(--text-3)' }}>Creator not found</p></div>;

  const { creatorProfile } = profile;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/feed" className="font-bold text-base gradient-text">iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/feed" className="nav-tab">Feed</Link>
            <Link href="/content-feed" className="nav-tab">Posts</Link>
            {session && <Link href="/subscriber/subscriptions" className="nav-tab">My Subs</Link>}
          </nav>
        </div>
      </header>

      {/* Cover */}
      <div style={{ height: 180, background: palettes[0] }} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: -40, marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: palettes[1],
            border: '3px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#fff', flexShrink: 0,
          }}>
            {creatorProfile.displayName[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>{creatorProfile.displayName}</h1>
            {creatorProfile.bio && <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{creatorProfile.bio}</p>}
          </div>
          {session && (session.user as any).id !== creatorProfile.userId && (
            isSubscribed ? (
              <button className="btn btn-secondary btn-sm" onClick={() => router.push('/subscriber/subscriptions')}>Subscribed</button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setShowSubscribe(true)}>Subscribe</button>
            )
          )}
        </div>

        {/* Tiers */}
        {creatorProfile.tiers.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Membership tiers</h2>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {creatorProfile.tiers.map((tier) => (
                <div key={tier.id} className="card" style={{ padding: "16px 20px", minWidth: 180, flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{tier.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>₹{Number(tier.price).toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>/mo</span></div>
                  {tier.perksDescription && (
                    <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>{tier.perksDescription}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Posts</h2>
          {creatorProfile.posts.length === 0 ? (
            <p style={{ color: 'var(--text-3)' }}>No posts yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {creatorProfile.posts.map((post) => (
                <div key={post.id} className="card card-interactive" style={{
                  aspectRatio: "3/4", background: post.mediaUrl || post.thumbnailUrl ? `url(${post.mediaUrl || post.thumbnailUrl}) center/cover` : palettes[Math.floor(Math.random() * palettes.length)],
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10,
                }}>
                  <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#fff' }}>
                    {post.isPPV && <span style={{ color: '#fbbf24' }}>🔒 PPV </span>}
                    {post.caption?.slice(0, 40)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
             onClick={() => !subscribing && setShowSubscribe(false)}>
          <div className="card" style={{ padding: 24, maxWidth: 400, width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Subscribe to {creatorProfile.displayName}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Choose a tier to unlock exclusive content</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {creatorProfile.tiers.filter(t => t.active).map(tier => (
                <button key={tier.id}
                  className={`card ${selectedTier?.id === tier.id ? '' : ''}`}
                  style={{
                    padding: '14px 16px', textAlign: 'left', cursor: 'pointer', border: selectedTier?.id === tier.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: selectedTier?.id === tier.id ? 'var(--accent-soft)' : 'var(--surface)',
                  }}
                  onClick={() => setSelectedTier(tier)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{tier.name}</div>
                      {tier.perksDescription && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{tier.perksDescription}</div>}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>₹{Number(tier.price)}/mo</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={!selectedTier || subscribing} onClick={handleSubscribe}>
                {subscribing ? "Processing…" : selectedTier ? `Pay ₹${Number(selectedTier.price)}/mo` : "Select a tier"}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowSubscribe(false)} disabled={subscribing}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
