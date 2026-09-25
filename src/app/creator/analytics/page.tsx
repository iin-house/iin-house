"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import { TrendingUp, Users, DollarSign, Eye, BarChart3, Clock, ArrowUpRight } from "lucide-react";

type PostStats = { id: string; caption: string; type: string; views: number; publishedAt: string | null; scheduledAt?: string | null };
type TierData = { id: string; name: string; price: number; subscribers: number };

export default function CreatorAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostStats[]>([]);
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/creator/content").then(r => r.ok ? r.json() : { posts: [] }),
        fetch("/api/creator/stats").then(r => r.ok ? r.json() : null),
      ]).then(([contentData, statsData]) => {
        setPosts(contentData.posts ?? []);
        setTiers(statsData?.tierBreakdown ?? []);
        setLoading(false);
      });
    }
  }, [status, router]);

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const published = posts.filter(p => p.publishedAt).length;
  const scheduled = posts.filter(p => !p.publishedAt && (p as any).scheduledAt).length;
  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '720px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '24px' }}>Track your content performance</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }} className="stagger">
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Total views</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{totalViews.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Published</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{published}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Scheduled</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{scheduled}</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Total posts</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{posts.length}</div>
          </div>
        </div>

        {tiers.length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Tier Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tiers.map((tier: any) => (
                <div key={tier.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', width: '80px' }}>{tier.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)', width: '60px' }}>₹{Number(tier.price).toLocaleString()}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--surface-3)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, tier.subscribers * 10)}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #db2777)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, width: '60px', textAlign: 'right' }}>{tier.subscribers} subs</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {topPosts.length > 0 && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--sep)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Top performing posts</h3>
            </div>
            {topPosts.map((post, i) => (
              <div key={post.id} className="list-row" style={{ padding: '12px 20px', borderBottom: i < topPosts.length - 1 ? '0.5px solid var(--sep)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.caption?.slice(0, 50) || "Untitled"}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{post.type}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>{post.views.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
