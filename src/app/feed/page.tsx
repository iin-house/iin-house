"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type Category = "All" | "Art" | "Music" | "Fitness" | "Tech" | "Lifestyle" | "Photography";

const CATEGORIES: Category[] = ["All", "Art", "Music", "Fitness", "Tech", "Lifestyle", "Photography"];

type Tier = { id: string; name: string; price: number | string; currency: string; active: boolean };
type Post = { id: string; mediaUrl?: string | null; isPPV?: boolean; ppvPrice?: number | string; publishedAt: string | Date };
type CreatorUser = { id: string; email: string | null; phone?: string | null };
type Creator = {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  verificationStatus?: string;
  category?: string | null;
  user: CreatorUser;
  tiers: Tier[];
  posts: Post[];
};

const PALETTES = [
  "linear-gradient(135deg, #9d174d, #be185d)",
  "linear-gradient(135deg, #7c3aed, #a78bfa)",
  "linear-gradient(135deg, #059669, #34d399)",
  "linear-gradient(135deg, #dc2626, #f87171)",
  "linear-gradient(135deg, #2563eb, #60a5fa)",
  "linear-gradient(135deg, #ea580c, #fb923c)",
];

export default function SubscriberFeed() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce the search input by 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch creators from API whenever filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category !== "All") params.set("category", category);

    fetch(`/api/creators${params.toString() ? `?${params}` : ""}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Creator[]) => {
        if (cancelled) return;
        setCreators(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCreators([]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [debouncedQuery, category]);

  const emptyMessage = useMemo(() => {
    if (debouncedQuery && category !== "All") return `No creators matching "${debouncedQuery}" in ${category}`;
    if (debouncedQuery) return `No creators matching "${debouncedQuery}"`;
    if (category !== "All") return `No ${category} creators yet`;
    return null;
  }, [debouncedQuery, category]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/" className="font-bold text-base gradient-text">iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="nav-tab active">Feed</span>
            <Link href="/content-feed" className="nav-tab">Posts</Link>
            <Link href="/subscriber/messages" className="nav-tab">Messages</Link>
            <Link href="/subscriber/subscriptions" className="nav-tab">My Subs</Link>
          </nav>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: '12px 16px 8px', position: 'sticky' as const, top: 52, zIndex: 40, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div style={{ background: 'var(--surface-3)', border: '0.5px solid var(--sep)', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-4)', fontSize: '16px' }}>🔍</span>
          <input
            className="input"
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            placeholder="Search creators, tiers, content…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '4px 16px 12px', display: 'flex', gap: '8px', overflowX: 'auto' }} className="scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn ${category === cat ? "btn-primary" : "btn-secondary"} btn-sm`}
            style={{ borderRadius: '20px' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="container" style={{ paddingTop: '8px', paddingBottom: '60px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <div className="shimmer" style={{ aspectRatio: '3/4' }} />
                <div style={{ padding: '12px' }}>
                  <div className="shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 8, width: '70%' }} />
                  <div className="shimmer" style={{ height: 12, borderRadius: 6, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : creators.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>No creators found</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>{emptyMessage ?? "Try browsing categories or check back later — new creators go live regularly."}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
            {creators.map((c, i) => {
              const firstPost = c.posts[0];
              return (
                <Link key={c.id} href={`/profile/${c.user.id}`} className="card card-interactive" style={{ overflow: 'hidden', textDecoration: 'none' }}>
                  <div style={{
                    aspectRatio: '3/4',
                    background: firstPost?.mediaUrl ? `url(${firstPost.mediaUrl}) center/cover` : PALETTES[i % PALETTES.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '52px'
                  }}>
                    {!firstPost?.mediaUrl && (c.displayName[0]?.toUpperCase() || '🎨')}
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{c.displayName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{c.bio?.slice(0, 40) || 'Creator'}</div>
                    {c.tiers.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <span className="badge badge-primary">₹{Number(c.tiers[0].price)}/mo</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
