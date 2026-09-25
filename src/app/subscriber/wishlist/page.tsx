"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { Heart, CheckCircle2 } from "lucide-react";

type Creator = {
  id: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  tiers: any[];
  user: { id: string };
};

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/wishlist?counts=true")
        .then(r => r.ok ? r.json() : { wishlist: [] })
        .then(d => { setWishlist(d.wishlist ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const remove = async (creatorId: string) => {
    await fetch(`/api/wishlist?creatorId=${creatorId}`, { method: "DELETE" });
    setWishlist(prev => prev.filter(w => w.creatorId !== creatorId));
    toast.success("Removed from wishlist");
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>Saved Creators</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '24px' }}>Your wishlist of creators to follow</p>

        {wishlist.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💝</div>
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No saved creators yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Browse creators and save them to your wishlist.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {wishlist.map((item: any) => {
              const c: Creator = item.creator;
              return (
                <div key={item.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link href={`/profile/${c.user.id}`} style={{ flexShrink: 0, textDecoration: 'none' }}>
                    <div className="avatar avatar-md" style={{
                      background: c.profileImageUrl ? `url(${c.profileImageUrl}) center/cover` : 'linear-gradient(135deg, #9d174d, #be185d)',
                    }}>
                      {!c.profileImageUrl && c.displayName[0]?.toUpperCase()}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/profile/${c.user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{c.displayName}</div>
                    </Link>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.bio?.slice(0, 60) || "No bio"}</div>
                    {c.tiers.length > 0 && (
                      <div style={{ marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className="badge badge-primary" style={{ fontSize: '10px' }}>From ₹{Number(c.tiers[0].price)}/mo</span>
                        <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => remove(c.user.id)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }} title="Remove">
                      <Heart size={18} style={{ fill: 'var(--danger)', color: 'var(--danger)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
