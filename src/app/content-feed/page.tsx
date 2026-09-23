"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ContentFeedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts/public")
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // API already filters by visibility based on viewer's subscriptions
  const visiblePosts = posts;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/" className="font-bold text-base gradient-text">iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/feed" className="nav-tab active">Creators</Link>
            <Link href="/content-feed" className="nav-tab">Posts</Link>
            {session ? (
              <>
                <Link href="/subscriber/messages" className="nav-tab">Messages</Link>
                <Link href="/subscriber/subscriptions" className="nav-tab">Subscriptions</Link>
              </>
            ) : (
              <Link href="/login" className="nav-tab">Log in</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container" style={{ padding: '28px 20px 60px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Content Feed</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Latest posts from creators you follow</p>

        {loading && <p style={{ color: 'var(--text-3)' }}>Loading…</p>}

        {!loading && visiblePosts.length === 0 && (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No posts yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Browse creators and subscribe to see their content.</p>
            <Link href="/feed" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse creators</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {visiblePosts.map((post: any) => (
            <div key={post.id} className="card card-interactive" style={{ overflow: 'hidden' }}>
              {post.thumbnailUrl ? (
                <div style={{ aspectRatio: '1/1', background: `url(${post.thumbnailUrl}) center/cover` }} />
              ) : post.mediaUrl ? (
                <div style={{ aspectRatio: '1/1', background: `url(${post.mediaUrl}) center/cover` }} />
              ) : (
                <div style={{ aspectRatio: '1/1', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  {post.type === 'VIDEO' ? '🎬' : post.type === 'AUDIO' ? '🎵' : post.type === 'PHOTO' ? '📷' : '📝'}
                </div>
              )}
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.caption || 'No caption'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '11px' }}>{post.type}</span>
                  {post.isPPV && <span className="badge badge-primary" style={{ fontSize: '11px' }}>₹{Number(post.ppvPrice)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
