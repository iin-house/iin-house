import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      creatorProfile: {
        include: {
          tiers: { where: { active: true }, orderBy: { price: "asc" } },
          posts: {
            where: { publishedAt: { not: null } },
            orderBy: { publishedAt: "desc" },
            take: 12,
          },
        },
      },
    },
  });

  if (!user?.creatorProfile) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>👤</div>
        <p style={{ color: "var(--text-3)" }}>Creator not found</p>
      </div>
    );
  }

  const { creatorProfile } = user;
  const palettes = [
    "linear-gradient(135deg, #9d174d, #be185d)",
    "linear-gradient(135deg, #7c3aed, #a78bfa)",
    "linear-gradient(135deg, #059669, #34d399)",
    "linear-gradient(135deg, #dc2626, #f87171)",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/feed" className="font-bold text-base gradient-text">iin house</Link>
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <a href="/feed" className="nav-tab">Feed</a>
            <a href="/subscriber/messages" className="nav-tab">Messages</a>
          </nav>
        </div>
      </header>

      {/* Cover */}
      <div style={{
        height: 180,
        background: palettes[0],
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}>
        <div style={{
          width: "100%", maxWidth: 720,
          padding: "0 16px 16px",
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
        }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: "50%",
            background: palettes[1],
            border: "3px solid var(--bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            color: "#fff",
            flexShrink: 0,
          }}>
            {creatorProfile.displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              {creatorProfile.displayName}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
              {creatorProfile.bio?.slice(0, 80) || "Creator"}
            </p>
          </div>
        </div>
      </div>

      <main className="container" style={{ padding: "16px 16px 60px" }}>
        {/* Tiers */}
        {creatorProfile.tiers.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Membership tiers</h2>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
              {creatorProfile.tiers.map((tier) => (
                <div key={tier.id} className="card" style={{
                  padding: "16px 20px",
                  minWidth: 180,
                  flex: 1,
                }}>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>{tier.name}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>₹{Number(tier.price).toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400 }}>/mo</span></div>
                  {tier.perksDescription && (
                    <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>{tier.perksDescription}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts grid */}
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Posts</h2>
        {creatorProfile.posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-3)" }}>
            <p>No posts yet</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 10,
          }}>
            {creatorProfile.posts.map((post) => (
              <div key={post.id} className="card card-interactive" style={{
                aspectRatio: "3/4",
                background: post.mediaUrl
                  ? `url(${post.mediaUrl}) center/cover`
                  : palettes[Math.floor(Math.random() * palettes.length)],
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 10,
                textDecoration: "none",
              }}>
                <div style={{
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 11,
                  color: "#fff",
                }}>
                  {post.isPPV && <span style={{ color: "#fbbf24" }}>🔒 PPV </span>}
                  {post.caption?.slice(0, 40)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
