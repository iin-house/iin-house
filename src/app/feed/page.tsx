import { prisma } from "@/lib/db";
import Link from "next/link";
import { isDemoUser, getDemoCreators } from "@/lib/demo-data";

const CATEGORIES = ["All", "Art", "Music", "Fitness", "Tech", "Lifestyle", "Photography"];

export default async function SubscriberFeed() {
  let creators: any[] = [];
  try {
    creators = await prisma.creatorProfile.findMany({
      where: { verificationStatus: "VERIFIED" },
      include: { tiers: { where: { active: true } }, user: true, posts: { where: { publishedAt: { not: null } }, take: 3, orderBy: { publishedAt: "desc" } } },
      take: 24,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    creators = getDemoCreators() as any[];
  }

  const palettes = [
    "linear-gradient(135deg, #9d174d, #be185d)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #059669, #34d399)",
    "linear-gradient(135deg, #dc2626, #f87171)",
    "linear-gradient(135deg, #2563eb, #60a5fa)",
    "linear-gradient(135deg, #ea580c, #fb923c)",
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/" className="font-bold text-base gradient-text">iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <a className="nav-tab active">Feed</a>
            <a href="/content-feed" className="nav-tab">Posts</a>
            <a href="/subscriber/messages" className="nav-tab">Messages</a>
            <a href="/subscriber/subscriptions" className="nav-tab">My Subs</a>
          </nav>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: '12px 16px 8px', position: 'sticky' as const, top: 52, zIndex: 40, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div style={{ background: 'var(--surface-3)', border: '0.5px solid var(--sep)', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-4)', fontSize: '16px' }}>🔍</span>
          <input className="input" style={{ border: 'none', background: 'transparent', padding: 0 }} placeholder="Search creators, tiers, content…" />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '4px 16px 12px', display: 'flex', gap: '8px', overflowX: 'auto' }} className="scrollbar-hide">
        <button className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>All</button>
        <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Art</button>
        <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Music</button>
        <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Fitness</button>
        <button className="btn btn-secondary btn-sm" style={{ borderRadius: '20px' }}>Tech</button>
      </div>

      <main className="container" style={{ paddingTop: '8px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {creators.map((c, i) => (
            <Link key={c.id} href={`/profile/${c.user.id}`} className="card card-interactive" style={{ overflow: 'hidden', textDecoration: 'none' }}>
              <div style={{
                aspectRatio: '3/4',
                background: c.posts[0]?.mediaUrl ? `url(${c.posts[0].mediaUrl}) center/cover` : palettes[i % palettes.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '52px'
              }}>
                {!c.posts[0]?.mediaUrl && (c.displayName[0]?.toUpperCase() || '🎨')}
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
          ))}
        </div>

        {creators.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>No creators found</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Try browsing categories or check back later — new creators go live regularly.</p>
          </div>
        )}
      </main>
    </div>
  );
}
