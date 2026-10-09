"use client";

import { useState, useEffect } from "react";

type Page =
  | "landing"
  | "login"
  | "register"
  | "feed"
  | "profile"
  | "dashboard"
  | "upload"
  | "tiers"
  | "earnings"
  | "payouts"
  | "messages"
  | "settings"
  | "kyc"
  | "content"
  | "contract"
  | "admin"
  | "contact";

type Role = "CREATOR" | "SUBSCRIBER" | "ADMIN";

const PROFILES = ["Priya Art", "DJ Rohit", "Priya Fitness"] as const;

const PALETTES = [
  "linear-gradient(135deg,#9d174d,#be185d)",
  "linear-gradient(135deg,#7c3aed,#a78bfa)",
  "linear-gradient(135deg,#059669,#34d399)",
  "linear-gradient(135deg,#dc2626,#f87171)",
  "linear-gradient(135deg,#2563eb,#60a5fa)",
  "linear-gradient(135deg,#ea580c,#fb923c)",
];

export default function DemoPage() {
  const [page, setPage] = useState<Page>("landing");
  const [role, setRole] = useState<Role>("CREATOR");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>("Priya Art");
  const [activeConv, setActiveConv] = useState("1");
  const [wishlisted, setWishlisted] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [contentTab, setContentTab] = useState<"posts" | "drafts" | "scheduled">("posts");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const profileIdx = PROFILES.indexOf(selectedProfile as typeof PROFILES[number]);

  return (
    <div style={{ background: "#000", color: "#f1f1f3", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif", minHeight: "100vh" }}>
      {/* ── DEMO BANNER ── */}
      <div style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        background: "rgba(28,28,30,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 18px", zIndex: 200,
        fontSize: 12, color: "#c5c6ca", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center", maxWidth: "calc(100% - 32px)",
      }}>
        <span style={{ color: "#ec4899", fontWeight: 600 }}>DEMO</span>
        <span>Viewing as</span>
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}
          style={{ background: "#1a1d24", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "3px 8px", color: "#f1f1f3", fontSize: 12, outline: "none", cursor: "pointer" }}>
          <option value="CREATOR">Creator</option>
          <option value="SUBSCRIBER">Subscriber</option>
          <option value="ADMIN">Admin</option>
        </select>
        <span style={{ color: "#6c6d70" }}>· Demo data · Click around</span>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 64, right: 16, zIndex: 300,
          background: "rgba(28,28,30,0.92)", backdropFilter: "blur(20px)", border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "12px 18px", fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeIn 0.3s ease", maxWidth: 340,
        }}>{toast}</div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* LANDING */}

      {page === "landing" && (
        <div>
          <Header logo="iin house" onLogoClick={() => navigate("landing")} />
          <section style={{ padding: "80px 24px 60px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.06)", color: "#f472b6", fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
              ✨ Built for creators, designed for trust
            </div>
            <h1 style={{ fontSize: "clamp(40px,7vw,64px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20 }}>
              The creator platform<br />
              <span style={{ background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>without the bloat.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#8e8f93", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.55 }}>
              Subscription tiers, pay-per-view content, and direct conversations — protected by design, paid on your terms.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>Start creating →</button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate("feed")}>Browse creators</button>
            </div>
            <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, paddingTop: 32, borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
              {["50K+ Creators", "₹2Cr+ Paid out", "99.9% Uptime", "4.9★ Rating"].map((s) => (
                <div key={s}><div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", background: "linear-gradient(135deg,#f1f1f3,#c5c6ca)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.split(" ")[0]}</div><div style={{ fontSize: 11, color: "#8e8f93", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.split(" ").slice(1).join(" ")}</div></div>
              ))}
            </div>
          </section>
          <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 100px" }}>
            <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, textAlign: "center" }}>Built different.</h2>
            <p style={{ fontSize: 16, color: "#8e8f93", maxWidth: 480, margin: "0 auto 64px", lineHeight: 1.6, textAlign: "center" }}>Every feature designed around one principle: creators keep what they earn.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <FeatureCard icon="🔒" title="Content that stays yours" desc="Per-session watermarks. Signed URLs that expire. No downloads, no screenshots, no leaks." color="#ec4899,#db2777" />
              <FeatureCard icon="💰" title="Subscriptions that pay out weekly" desc="No 21-day holds. No minimum thresholds. Verified creators get rolling weekly payments." color="#34d399,#059669" />
              <FeatureCard icon="🎨" title="Any content, any price" desc="Free tiers, paid tiers, PPV posts, paid DMs. You set the rules." color="#fbbf24,#f59e0b" />
              <FeatureCard icon="✅" title="Verified, not anonymous" desc="Every creator goes through KYC. Subscribers browse with confidence." color="#60a5fa,#3b82f6" />
              <FeatureCard icon="💬" title="Messages worth paying for" desc="Unlock conversations. Sell content inside the chat. Tips go directly to creators." color="#a78bfa,#7c3aed" />
              <FeatureCard icon="⚡" title="Built to discover" desc="A curated feed, not an infinite scroll. Browse by category, find what matters." color="#fb923c,#ea580c" />
            </div>
          </section>
          <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 120px" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(236,72,153,0.1),rgba(244,114,182,0.05),rgba(251,146,60,0.08))", border: "1px solid rgba(236,72,153,0.2)", borderRadius: 32, padding: "clamp(40px,8vw,72px) clamp(24px,5vw,60px)", textAlign: "center" }}>
              <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>Ready to own your audience?</h2>
              <p style={{ fontSize: 17, color: "#c5c6ca", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>Join thousands of creators who've moved to a platform that respects their work.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>Create your account →</button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate("feed")}>Explore creators</button>
              </div>
            </div>
          </section>
          <Footer navigate={navigate} />
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* LOGIN */}

      {page === "login" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#000" }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>iin house</div>
              <p style={{ fontSize: 13, color: "#8e8f93", marginTop: 4 }}>Welcome back</p>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", padding: "10px 14px", borderRadius: 12, fontSize: 13, marginBottom: 16, display: "none" }} id="login-error">
                Invalid email or password.
              </div>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Signed in! (demo)"); setTimeout(() => navigate("dashboard"), 800); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Email or phone</label>
                  <input className="input" placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Password</label>
                  <input className="input" type="password" placeholder="••••••••••" />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#c5c6ca", cursor: "pointer" }}><input type="checkbox" style={{ accentColor: "#ec4899" }} /> Remember me</label>
                  <button type="button" style={{ background: "none", border: "none", color: "#f472b6", cursor: "pointer", fontSize: 13 }} onClick={() => showToast("Reset link sent! (demo)")}>Forgot password?</button>
                </div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} type="submit">Sign in</button>
              </form>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, fontSize: 13 }}>
                <span style={{ color: "#8e8f93" }}>Don&apos;t have an account? <button onClick={() => navigate("register")} style={{ background: "none", border: "none", color: "#f472b6", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>Sign up</button></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* REGISTER */}

      {page === "register" && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#000" }}>
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>iin house</div>
              <p style={{ fontSize: 13, color: "#8e8f93", marginTop: 4 }}>Create your account</p>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#1a1d24", borderRadius: 12, padding: 3 }}>
                <button type="button" style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#0c0c0e", color: "#f1f1f3", border: "none", cursor: "pointer" }}>Creator</button>
                <button type="button" style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "transparent", color: "#8e8f93", border: "none", cursor: "pointer" }}>Subscriber</button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Account created! Redirecting... (demo)"); setTimeout(() => navigate("login"), 1500); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Display name</label>
                  <input className="input" placeholder="How fans will see you" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Email</label>
                  <input className="input" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Phone (+91…)</label>
                  <input className="input" placeholder="optional" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Password</label>
                  <input className="input" type="password" placeholder="Min 10 characters" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Confirm password</label>
                  <input className="input" type="password" placeholder="Repeat password" />
                </div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} type="submit">Create account</button>
              </form>
              <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#8e8f93" }}>
                Already have an account? <button onClick={() => navigate("login")} style={{ background: "none", border: "none", color: "#f472b6", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>Sign in</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* FEED */}

      {page === "feed" && (
        <div>
          <Header logo="iin house" onLogoClick={() => navigate("landing")} nav={[
            { label: "Feed", active: true },
            { label: "Posts", onClick: () => navigate("content") },
            { label: "Messages", onClick: () => navigate("messages") },
            { label: "My Subs", onClick: () => showToast("Subscriptions (demo)") },
          ]} />
          <main className="container" style={{ paddingTop: 8, paddingBottom: 60 }}>
            {/* Search */}
            <div style={{ padding: "12px 16px 8px", position: "sticky", top: 52, zIndex: 40, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
              <div style={{ background: "#1a1d24", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#6c6d70", fontSize: 16 }}>🔍</span>
                <input className="input" style={{ border: "none", background: "transparent", padding: 0 }} placeholder="Search creators, tiers, content…" />
              </div>
            </div>
            {/* Categories */}
            <div style={{ padding: "4px 16px 12px", display: "flex", gap: 8, overflowX: "auto" }} className="scrollbar-hide">
              {["All", "Art", "Music", "Fitness", "Tech", "Lifestyle", "Photography"].map((cat) => (
                <button key={cat} className={`btn btn-sm ${cat === "All" ? "btn-primary" : "btn-secondary"}`} style={{ borderRadius: 20 }}>{cat}</button>
              ))}
            </div>
            {/* Creator grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
              {[
                { name: "Priya Art", cat: "Art", subs: "12.4K", price: 299, color: "#ec4899,#db2777" },
                { name: "DJ Rohit", cat: "Music", subs: "8.7K", price: 199, color: "#7c3aed,#a78bfa" },
                { name: "Priya Fitness", cat: "Fitness", subs: "24.1K", price: 149, color: "#059669,#34d399" },
                { name: "Tech With Ravi", cat: "Tech", subs: "5.3K", price: 99, color: "#2563eb,#60a5fa" },
                { name: "Lena Creates", cat: "Art", subs: "18.2K", price: 249, color: "#ea580c,#fb923c" },
                { name: "FitCoach Anika", cat: "Fitness", subs: "31K", price: 199, color: "#dc2626,#f87171" },
              ].map((c, i) => (
                <div key={i} className="card card-interactive" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => { setSelectedProfile(c.name); navigate("profile"); }}>
                  <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg,${c.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "rgba(255,255,255,0.3)" }}>👤</div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#8e8f93", display: "flex", justifyContent: "space-between" }}>
                      <span>{c.subs} subs</span><span>₹{c.price}/mo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* PROFILE */}

      {page === "profile" && (
        <div>
          <Header logo="iin house" onLogoClick={() => navigate("feed")} nav={[
            { label: "Feed", onClick: () => navigate("feed") },
            { label: "Posts", onClick: () => navigate("content") },
            { label: "My Subs", onClick: () => showToast("Subscriptions (demo)") },
          ]} />
          <div style={{ minHeight: "100vh", background: "#000" }}>
            <div style={{ height: 180, background: PALETTES[profileIdx % PALETTES.length] }} />
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px" }}>
              {/* Profile header */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -40, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", background: PALETTES[(profileIdx + 1) % PALETTES.length],
                  border: "3px solid #000", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, color: "#fff", flexShrink: 0,
                }}>{selectedProfile[0]}</div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 700 }}>{selectedProfile}</h1>
                  <p style={{ fontSize: 13, color: "#8e8f93", marginTop: 2 }}>Creating content that inspires ✨</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className={`btn btn-sm ${wishlisted ? "btn-primary" : "btn-secondary"}`} onClick={() => { setWishlisted(!wishlisted); showToast(wishlisted ? "Removed from saved" : "Saved to wishlist"); }}>
                    {wishlisted ? "💖 Saved" : "🤍 Save"}
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowSubModal(true)}>Subscribe</button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 24, marginBottom: 28, padding: "16px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                {[["Posts", "156"], ["Subscribers", "24.1K"], ["Tiers", "3"]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 12, color: "#8e8f93", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div></div>
                ))}
              </div>

              {/* Tiers */}
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Membership tiers</h2>
                <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                  {[
                    { name: "Starter", price: 99, perks: "Early access to posts" },
                    { name: "Premium", price: 299, perks: "All content + DMs", popular: true },
                    { name: "VIP", price: 999, perks: "1-on-1 sessions monthly" },
                  ].map((tier) => (
                    <div key={tier.name} className="card" style={{ padding: "16px 20px", minWidth: 180, flex: 1, borderColor: tier.popular ? "rgba(236,72,153,0.2)" : undefined }}>
                      <div style={{ fontSize: 12, color: "#8e8f93", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>{tier.name} {tier.popular && <span className="badge badge-primary">Popular</span>}</div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>₹{tier.price}<span style={{ fontSize: 13, fontWeight: 400 }}>/mo</span></div>
                      {tier.perks && <p style={{ fontSize: 12, color: "#8e8f93", marginTop: 8 }}>{tier.perks}</p>}
                    </div>
                  ))}
                </div>
              </section>

              {/* Posts */}
              <section>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Posts</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                  {["photo1.jpg", "video1.mp4", "text-post", "photo2.jpg", "video2.mp4", "audio1.mp3"].map((media, i) => (
                    <div key={i} className="card card-interactive" style={{ aspectRatio: "3/4", background: `linear-gradient(135deg,${PALETTES[i % PALETTES.length]})`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 10, cursor: "pointer" }} onClick={() => showToast("Content detail view")}>
                      <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#fff" }}>
                        {i % 3 === 1 ? "🔒 PPV " : ""}{media}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Subscribe Modal */}
          {showSubModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={() => setShowSubModal(false)}>
              <div className="card" style={{ padding: 24, maxWidth: 400, width: "100%" }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Subscribe to {selectedProfile}</h3>
                <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 20 }}>Choose a tier to unlock exclusive content</p>
                {[
                  { name: "Starter", price: 99 },
                  { name: "Premium", price: 299, selected: true },
                  { name: "VIP", price: 999 },
                ].map((tier) => (
                  <div key={tier.name} className="card" style={{ padding: "14px 16px", marginBottom: 8, textAlign: "left", cursor: "pointer", borderColor: tier.selected ? "#ec4899" : "rgba(255,255,255,0.06)", background: tier.selected ? "rgba(236,72,153,0.1)" : "#0c0c0e" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontSize: 14, fontWeight: 600 }}>{tier.name}</div><div style={{ fontSize: 12, color: "#8e8f93", marginTop: 2 }}>Full access tier</div></div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: tier.selected ? "#ec4899" : "#f1f1f3" }}>₹{tier.price}/mo</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setShowSubModal(false); showToast("Subscribed! (demo)"); }}>Subscribe</button>
                  <button className="btn btn-secondary" onClick={() => setShowSubModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* DASHBOARD */}

      {page === "dashboard" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", active: true },
            { label: "Upload", onClick: () => navigate("upload") },
            { label: "Content", onClick: () => navigate("content") },
            { label: "Tiers", onClick: () => navigate("tiers") },
            { label: "Earnings", onClick: () => navigate("earnings") },
            { label: "Messages", onClick: () => navigate("messages") },
            { label: "Settings", onClick: () => navigate("settings") },
            { label: "KYC", onClick: () => navigate("kyc") },
          ]} />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Welcome back, {selectedProfile}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 28 }}>
              <StatCard label="Revenue" value="₹24.8K" trend="+12.5%" up />
              <StatCard label="Subscribers" value="847" trend="+8.2%" up />
              <StatCard label="Posts" value="156" sub="this week" />
              <StatCard label="Verified" value="KYC ✓" sub="Approved" success />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent subscribers</h3>
                {[
                  { name: "anika@email.com", tier: "Gold tier", color: "#ec4899,#db2777", initial: "A", ago: "2m" },
                  { name: "rahul@email.com", tier: "VIP tier", color: "#7c3aed,#a78bfa", initial: "R", ago: "1h" },
                  { name: "sneha@email.com", tier: "Starter tier", color: "#059669,#34d399", initial: "S", ago: "3h" },
                ].map((s) => (
                  <div key={s.name} className="list-row">
                    <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg,${s.color})` }}>{s.initial}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 12, color: "#8e8f93" }}>Joined {s.tier}</div></div>
                    <span style={{ fontSize: 11, color: "#8e8f93" }}>{s.ago} ago</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Quick actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
                  <button className="btn btn-primary btn-sm" style={{ width: "100%" }} onClick={() => navigate("upload")}>+ New post</button>
                  <button className="btn btn-secondary btn-sm" style={{ width: "100%" }} onClick={() => navigate("tiers")}>Manage tiers</button>
                  <button className="btn btn-secondary btn-sm" style={{ width: "100%" }} onClick={() => navigate("earnings")}>Earnings</button>
                  <button className="btn btn-secondary btn-sm" style={{ width: "100%" }} onClick={() => navigate("payouts")}>Payouts</button>
                </div>
                <div className="sep" style={{ margin: "12px 0" }} />
                <div className="list-row" onClick={() => navigate("messages")} style={{ cursor: "pointer" }}>
                  <div className="avatar avatar-sm" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>Messages</div><div style={{ fontSize: 12, color: "#8e8f93" }}>3 unread</div></div>
                  <span className="badge badge-primary">3</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* UPLOAD */}

      {page === "upload" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Upload", active: true },
            { label: "Content", onClick: () => navigate("content") },
          ]} />
          <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Upload Content</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Share photos, videos, audio, or text with your subscribers</p>
            <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 16, padding: "48px 24px", textAlign: "center", cursor: "pointer" }} onClick={() => showToast("Files selected ✓")}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#f1f1f3" }}>Drop files here or click to browse</p>
                <p style={{ fontSize: 12, color: "#8e8f93", marginTop: 4 }}>Photos, videos, audio — up to 500MB</p>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Content type</label>
                <select className="input" style={{ cursor: "pointer" }}>
                  <option>📷 Photo</option><option>🎬 Video</option><option>🎵 Audio</option><option>📝 Text</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Caption</label>
                <textarea className="input" rows={3} placeholder="Tell your subscribers what this is about…" style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <div className="toggle active" style={{ cursor: "pointer" }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>Pay-per-view</div><div style={{ fontSize: 12, color: "#8e8f93" }}>Subscribers pay to unlock</div></div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Price (₹)</label>
                <input className="input" type="number" placeholder="99" />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={() => showToast("Post published! (demo)")}>Publish now</button>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* CONTENT MANAGEMENT */}

      {page === "content" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Upload", onClick: () => navigate("upload") },
            { label: "Content", active: true },
            { label: "Tiers", onClick: () => navigate("tiers") },
          ]} />
          <main style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div><h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Content</h1><p style={{ fontSize: 13, color: "#8e8f93" }}>Manage your posts</p></div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("upload")}>+ New post</button>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, margin: "20px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              {(["posts", "drafts", "scheduled"] as const).map((tab) => (
                <button key={tab} onClick={() => setContentTab(tab)} className={`btn btn-sm ${contentTab === tab ? "" : "btn-ghost"}`} style={{ borderRadius: 0, border: "none", borderBottom: contentTab === tab ? "2px solid #ec4899" : "2px solid transparent", textTransform: "capitalize" }}>{tab}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { title: "Summer Collection Launch", type: "VIDEO", views: "2.4K", status: "Published", isPPV: false },
                { title: "Behind the Scenes", type: "PHOTO", views: "1.8K", status: "Published", isPPV: true, price: 199 },
                { title: "New Track Preview", type: "AUDIO", views: "3.1K", status: "Published", isPPV: false },
                { title: "Workout Tips Vol. 3", type: "VIDEO", views: "—", status: "Draft", isPPV: false },
                { title: "Q&A Responses", type: "TEXT", views: "—", status: "Scheduled", isPPV: false },
              ].filter(p => {
                if (contentTab === "posts") return p.status === "Published";
                if (contentTab === "drafts") return p.status === "Draft";
                return p.status === "Scheduled";
              }).map((post, i) => (
                <div key={i} className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg,${PALETTES[i % PALETTES.length]})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  }}>{post.type === "VIDEO" ? "🎬" : post.type === "PHOTO" ? "📷" : post.type === "AUDIO" ? "🎵" : "📝"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                      <span className="badge badge-secondary" style={{ fontSize: 10 }}>{post.type}</span>
                      {post.isPPV && <span className="badge badge-primary" style={{ fontSize: 10 }}>₹{post.price}</span>}
                      <span className="badge badge-muted" style={{ fontSize: 10 }}>{post.status}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast("Edit mode (demo)")}>✏️</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "#f87171" }} onClick={() => showToast("Deleted (demo)")}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* TIERS */}

      {page === "tiers" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Tiers", active: true },
          ]} />
          <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Membership Tiers</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Set pricing and perks for your subscribers</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { name: "Starter", price: 99, subs: 342, perks: "Early access to posts\nCommunity access", active: true },
                { name: "Premium", price: 299, subs: 389, perks: "All content\nDirect messaging", active: true, popular: true },
                { name: "VIP", price: 999, subs: 116, perks: "1-on-1 monthly session\nCustom content requests\nEarly previews", active: true },
              ].map((tier) => (
                <div key={tier.name} className="card" style={{ padding: 20, borderColor: tier.popular ? "rgba(236,72,153,0.2)" : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{tier.name}</span>
                        {tier.popular && <span className="badge badge-primary">Popular</span>}
                        <span className="badge badge-success">{tier.active ? "Active" : "Inactive"}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#8e8f93", lineHeight: 1.6, whiteSpace: "pre-line" }}>{tier.perks}</p>
                      <div style={{ fontSize: 12, color: "#8e8f93", marginTop: 6 }}>{tier.subs} subscribers</div>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: 16 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: tier.popular ? "#ec4899" : "#f1f1f3" }}>₹{tier.price}</div>
                      <div style={{ fontSize: 11, color: "#8e8f93" }}>/mo</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Editing ${tier.name} tier`)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => showToast(`${tier.name} toggled`)}>{tier.active ? "Deactivate" : "Activate"}</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => showToast("New tier created (demo)")}>+ Add new tier</button>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* EARNINGS */}

      {page === "earnings" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Earnings", active: true },
          ]} />
          <main style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Earnings</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Revenue breakdown and analytics</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
              <StatCard label="This month" value="₹18.2K" />
              <StatCard label="Last month" value="₹21.8K" />
              <StatCard label="Total earned" value="₹2.1L" />
            </div>
            <div className="card" style={{ padding: 20, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Revenue Breakdown</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Subscriptions", pct: 72, color: "#ec4899,#db2777" },
                  { label: "PPV", pct: 20, color: "#7c3aed,#a78bfa" },
                  { label: "Tips", pct: 8, color: "#059669,#34d399" },
                ].map((b) => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, width: 80 }}>{b.label}</span>
                    <div style={{ flex: 1, height: 8, background: "#1a1d24", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${b.pct}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${b.color})` }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, width: 40, textAlign: "right" }}>{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: 16, borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Transaction History</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Source</th>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Period</th>
                  <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Amount</th>
                </tr></thead>
                <tbody>
                  <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>Subscriptions</td><td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 847 payments</td><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹18,200</td></tr>
                  <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>PPV Purchases</td><td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 156 purchases</td><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹6,300</td></tr>
                  <tr><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>Tips</td><td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 42 tips</td><td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹2,100</td></tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* PAYOUTS */}

      {page === "payouts" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Payouts", active: true },
          ]} />
          <main style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Payouts</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Request and track your payouts</p>
            <div className="card" style={{ padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div><div style={{ fontSize: 12, color: "#8e8f93" }}>Available balance</div><div style={{ fontSize: 28, fontWeight: 700 }}>₹24,500</div></div>
                <button className="btn btn-primary btn-sm" onClick={() => showToast("Payout request submitted!")}>Request payout</button>
              </div>
              <div style={{ background: "#1a1d24", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#c5c6ca" }}>Bank account ending 4029</span>
                <span className="badge badge-success">✓ Verified</span>
              </div>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: 14, borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Payout History</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <th style={{ textAlign: "left", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Date</th>
                  <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Amount</th>
                  <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Status</th>
                  <th style={{ textAlign: "right", padding: "10px 20px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", fontWeight: 600 }}>Method</th>
                </tr></thead>
                <tbody>
                  {[
                    { date: "Jan 15, 2026", amount: "₹18,200", status: "Completed", method: "UPI" },
                    { date: "Dec 28, 2025", amount: "₹21,800", status: "Completed", method: "Bank" },
                    { date: "Dec 01, 2025", amount: "₹19,400", status: "Completed", method: "UPI" },
                    { date: "Nov 15, 2025", amount: "₹16,800", status: "Completed", method: "Bank" },
                  ].map((p, i) => (
                    <tr key={i} style={{ borderBottom: i < 3 ? "0.5px solid rgba(255,255,255,0.06)" : undefined }}>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#c5c6ca" }}>{p.date}</td>
                      <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, textAlign: "right" }}>{p.amount}</td>
                      <td style={{ padding: "12px 20px", textAlign: "right" }}><span className="badge badge-success" style={{ fontSize: 11 }}>{p.status}</span></td>
                      <td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93", textAlign: "right" }}>{p.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* MESSAGES */}

      {page === "messages" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Feed", onClick: () => navigate("feed") },
            { label: "Messages", active: true },
          ]} />
          <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 0" }}>
            <div style={{ display: "flex", height: "calc(100vh - 52px - 56px)", overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 16 }}>
              <aside style={{ width: "100%", maxWidth: 300, borderRight: "0.5px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: 14, borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <input className="input" placeholder="Search messages…" />
                </div>
                {[
                  { id: "1", name: "Lena Creates", last: "Thanks for subscribing! ✨", time: "2m", unread: 1, color: "#ec4899,#db2777", initial: "L" },
                  { id: "2", name: "DJ Rohit", last: "Check out my latest track 🎵", time: "1h", unread: 0, color: "#7c3aed,#a78bfa", initial: "R" },
                  { id: "3", name: "Priya Fitness", last: "Workout plan ready 💪", time: "3h", unread: 0, color: "#059669,#34d399", initial: "P" },
                ].map((c) => (
                  <div key={c.id} className={`list-row ${activeConv === c.id ? "active" : ""}`} onClick={() => setActiveConv(c.id)} style={{ width: "100%", border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }}>
                    <div className="avatar avatar-md" style={{ background: `linear-gradient(135deg,${c.color})` }}>{c.initial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#8e8f93", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 11, color: "#8e8f93" }}>{c.time}</span>
                      {c.unread > 0 && <span className="badge badge-primary" style={{ padding: "2px 7px", fontSize: 10 }}>{c.unread}</span>}
                    </div>
                  </div>
                ))}
              </aside>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar avatar-md" style={{ background: "linear-gradient(135deg,#ec4899,#db2777)" }}>L</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{activeConv === "1" ? "Lena Creates" : activeConv === "2" ? "DJ Rohit" : "Priya Fitness"}</div>
                    <div style={{ fontSize: 11, color: "#34d399" }}>● Online</div>
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {activeConv === "1" ? (
                    <>
                      <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-start", background: "#1a1d24", color: "#f1f1f3", borderBottomLeftRadius: 6 }}>
                        <p>Hey, welcome! Thanks for subscribing.</p><span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>2m</span>
                      </div>
                      <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-end", background: "linear-gradient(135deg,#db2777,#ec4899)", color: "#fff", borderBottomRightRadius: 6 }}>
                        <p>Thanks! Loving the content so far ✨</p><span style={{ fontSize: 10, display: "block", marginTop: 4, opacity: 0.7 }}>1m</span>
                      </div>
                      <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-start", background: "#1a1d24", color: "#f1f1f3", borderBottomLeftRadius: 6 }}>
                        <p>Here&apos;s something exclusive just for you 🔒</p><span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>Just now</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-start", background: "#1a1d24", color: "#f1f1f3", borderBottomLeftRadius: 6 }}>
                        <p>Hey! How&apos;s it going?</p><span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>3h</span>
                      </div>
                      <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-end", background: "linear-gradient(135deg,#db2777,#ec4899)", color: "#fff", borderBottomRightRadius: 6 }}>
                        <p>Doing great! Just checking out the new content 🎵</p><span style={{ fontSize: 10, display: "block", marginTop: 4, opacity: 0.7 }}>2h</span>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ padding: "10px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
                  <input className="input" placeholder="Write a message…" style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === "Enter") showToast("Message sent! (demo)"); }} />
                  <button className="btn btn-primary btn-sm" onClick={() => showToast("Message sent! (demo)")}>Send</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* SETTINGS — NEW */}

      {page === "settings" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Settings", active: true },
          ]} />
          <main style={{ maxWidth: 520, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Creator Settings</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Manage your profile and preferences</p>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Display name</label>
                  <input className="input" defaultValue={selectedProfile} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Bio</label>
                  <textarea className="input" rows={3} placeholder="Tell subscribers about yourself…" defaultValue="Creating content that inspires ✨" style={{ resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Category</label>
                  <select className="input" style={{ cursor: "pointer" }}>
                    <option>Art & Design</option><option>Music</option><option>Fitness</option><option>Technology</option><option>Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Revenue split (%)</label>
                  <input className="input" type="number" defaultValue={80} min={50} max={95} />
                  <p style={{ fontSize: 11, color: "#8e8f93", marginTop: 4 }}>Your share. Platform takes the remainder.</p>
                </div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={() => showToast("Settings saved!")}>Save changes</button>
              </div>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Account info</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8e8f93" }}>Email</span><span>creator@iinhouse.com</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8e8f93" }}>Phone</span><span>+91 98765 43210</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8e8f93" }}>Role</span><span className="badge badge-primary">Creator</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8e8f93" }}>KYC Status</span><span className="badge badge-success">Verified</span></div>
              </div>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#f87171" }}>Danger zone</h3>
              <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 12 }}>Once you delete your account, there is no going back.</p>
              <button className="btn btn-danger" style={{ width: "100%" }} onClick={() => showToast("Account deletion cancelled — this is a demo")}>Delete account</button>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* KYC — NEW */}

      {page === "kyc" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "KYC", active: true },
          ]} />
          <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Identity Verification</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Complete KYC to receive payouts and unlock all features</p>

            {/* Progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {["Personal", "Documents", "Review"].map((step, i) => (
                <div key={step} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: kycStep > i + 1 ? "#34d399" : kycStep === i + 1 ? "#ec4899" : "#1a1d24", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 13, fontWeight: 600 }}>{kycStep > i + 1 ? "✓" : i + 1}</div>
                  <div style={{ fontSize: 11, color: kycStep === i + 1 ? "#f1f1f3" : "#8e8f93" }}>{step}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24 }}>
              {kycStep === 1 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Personal Information</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div><label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>First name</label><input className="input" defaultValue="Priya" /></div>
                      <div><label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Last name</label><input className="input" defaultValue="Sharma" /></div>
                    </div>
                    <div><label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Date of birth</label><input className="input" type="date" /></div>
                    <div><label style={{ display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>Address</label><textarea className="input" rows={2} defaultValue="123, MG Road, Bangalore, Karnataka - 560001" style={{ resize: "vertical" }} /></div>
                    <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setKycStep(2)}>Continue →</button>
                  </div>
                </div>
              )}
              {kycStep === 2 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Upload Documents</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 16px", textAlign: "center", cursor: "pointer" }} onClick={() => showToast("PAN card uploaded ✓")}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🪪</div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>PAN Card</p>
                      <p style={{ fontSize: 12, color: "#8e8f93" }}>PDF, JPG, or PNG</p>
                    </div>
                    <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 12, padding: "24px 16px", textAlign: "center", cursor: "pointer" }} onClick={() => showToast("Aadhaar uploaded ✓")}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Aadhaar Card</p>
                      <p style={{ fontSize: 12, color: "#8e8f93" }}>Front and back</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setKycStep(1)}>← Back</button>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setKycStep(3)}>Submit for review →</button>
                    </div>
                  </div>
                </div>
              )}
              {kycStep === 3 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Verification in progress</h3>
                  <p style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.6, maxWidth: 360, margin: "0 auto 20px" }}>We&apos;re reviewing your documents. This usually takes 24-48 hours. You&apos;ll be notified once it&apos;s complete.</p>
                  <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, textAlign: "left", marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "#8e8f93", marginBottom: 8 }}>Submitted documents</div>
                    <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>🪪 PAN Card <span className="badge badge-warning" style={{ marginLeft: "auto" }}>Reviewing</span></div>
                    <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>📋 Aadhaar Card <span className="badge badge-warning" style={{ marginLeft: "auto" }}>Reviewing</span></div>
                  </div>
                  <button className="btn btn-secondary" onClick={() => navigate("dashboard")}>Back to dashboard</button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* CONTRACT */}

      {page === "contract" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", onClick: () => navigate("dashboard") },
            { label: "Contract", active: true },
          ]} />
          <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Creator Contract</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Manage your agreement and revenue split</p>
            <div className="card" style={{ padding: 24, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>Current Agreement</h3>
                <span className="badge badge-success">Active</span>
              </div>
              <div style={{ background: "#1a1d24", borderRadius: 12, padding: 16, fontSize: 13, color: "#c5c6ca", lineHeight: 1.8, marginBottom: 16 }}>
                <strong style={{ color: "#f1f1f3" }}>Standard Creator Agreement</strong><br />
                Revenue split: <strong style={{ color: "#ec4899" }}>80/20</strong> (Creator / Platform)<br />
                Term: Indefinite, 30 days notice for termination<br />
                Content ownership: Retained by creator<br />
                Platform license: Non-exclusive, worldwide
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => showToast("Agreement downloaded")}>Download PDF</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => navigate("landing")}>View full terms</button>
              </div>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Upload Custom Contract</h3>
              <div style={{ border: "2px dashed rgba(255,255,255,0.15)", borderRadius: 16, padding: "32px 24px", textAlign: "center", cursor: "pointer" }} onClick={() => showToast("Contract uploaded!")}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#f1f1f3", marginBottom: 4 }}>Drop your contract PDF here</p>
                <p style={{ fontSize: 12, color: "#8e8f93" }}>PDF, DOC, or DOCX</p>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => showToast("Contract submitted for review!")}>Submit contract</button>
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* ADMIN */}

      {page === "admin" && (
        <div>
          <Header logo="iin house" nav={[
            { label: "Dashboard", active: true },
            { label: "KYC", onClick: () => showToast("KYC review (demo)") },
            { label: "Moderation", onClick: () => showToast("Moderation queue (demo)") },
            { label: "Disputes", onClick: () => showToast("Disputes (demo)") },
            { label: "Payouts", onClick: () => navigate("payouts") },
          ]} />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Platform overview and management</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 32 }}>
              <AdminStat label="Creators" value="142" color="#f472b6" />
              <AdminStat label="Subscribers" value="8,934" color="#34d399" />
              <AdminStat label="Content" value="1,247" color="#60a5fa" />
              <AdminStat label="Revenue" value="₹4.8L" color="#fbbf24" />
              <AdminStat label="Open Flags" value="23" color="#f87171" />
              <AdminStat label="Payouts" value="18" color="#a78bfa" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <AdminCard icon="🛡️" title="KYC Reviews" desc="12 pending verifications awaiting review" color="#60a5fa" />
              <AdminCard icon="🚩" title="Moderation Queue" desc="23 open flags need attention" color="#f87171" />
              <AdminCard icon="💬" title="Open Disputes" desc="5 disputes require resolution" color="#fbbf24" />
              <AdminCard icon="💸" title="Payout Requests" desc="18 creators requesting payouts" color="#34d399" />
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* CONTACT */}

      {page === "contact" && (
        <div>
          <Header logo="iin house" backLabel="← Back" onBack={() => navigate("landing")} />
          <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Contact Us</h1>
              <p style={{ fontSize: 14, color: "#8e8f93" }}>We're here to help. Reach out through any channel below.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "📧", title: "Email support", desc: "For account issues, billing, and general questions.", email: "support@iinhouse.com", bg: "rgba(244,114,182,0.1)" },
                { icon: "⚖️", title: "Grievance Officer", desc: "Required under IT Rules 2021. Response within 48 hours.", email: "grievances@iinhouse.com", bg: "rgba(96,165,250,0.1)" },
                { icon: "🤝", title: "Partnerships", desc: "Creator relations, onboarding, and partnership inquiries.", email: "partners@iinhouse.com", bg: "rgba(52,211,153,0.1)" },
                { icon: "🔒", title: "Privacy & data requests", desc: "Data access, deletion, and privacy inquiries.", email: "privacy@iinhouse.com", bg: "rgba(251,191,36,0.1)" },
              ].map((c) => (
                <div key={c.title} className="card card-interactive" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => showToast(`Opening ${c.email}...`)}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.title}</h3>
                    <p style={{ fontSize: 12, color: "#8e8f93", lineHeight: 1.5 }}>{c.desc}</p>
                    <span style={{ fontSize: 13, color: "#ec4899" }}>{c.email}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 20, marginTop: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Business address</h3>
              <p style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.6 }}>iin house (registered business name)<br />India — update with your registered address before launch</p>
            </div>
          </main>
        </div>
      )}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .glass-header {
          position: sticky; top: 0; z-index: 50; height: 52px;
          background: rgba(12,12,14,0.78);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }
        .header-inner { max-width: 1200px; margin: 0 auto; height: 100%; padding: "0 16px"; display: flex; align-items: center; justify-content: space-between; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none; cursor: pointer; white-space: nowrap; letter-spacing: -0.01em; font-family: inherit;
        }
        .btn-primary {
          background: linear-gradient(135deg, #ec4899, #db2777); color: #fff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 0 20px rgba(236,72,153,0.2);
        }
        .btn-primary:hover { transform: scale(1.02); }
        .btn-primary:active { transform: scale(0.98); }
        .btn-secondary { background: #1a1d24; color: #f1f1f3; border: 0.5px solid rgba(255,255,255,0.1); }
        .btn-secondary:hover { background: #21252e; }
        .btn-ghost { background: transparent; color: #8e8f93; }
        .btn-ghost:hover { background: #1a1d24; color: "#f1f1f3"; }
        .btn-danger { background: rgba(248,113,113,0.15); color: #f87171; }
        .btn-danger:hover { background: rgba(248,113,113,0.25); }
        .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 10px; }
        .btn:disabled { opacity: 0.35; pointer-events: none; }
        .btn-lg { padding: 14px 28px; font-size: 16px; border-radius: 14px; }

        .card {
          background: #131518; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 16px;
          transition: all 0.25s ease;
        }
        .card-interactive { cursor: pointer; }
        .card-interactive:hover { border-color: rgba(255,255,255,0.12); background: #1a1d24; }
        .card-interactive:active { transform: scale(0.985); }

        .input {
          width: 100%; background: #1a1d24; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 12px;
          padding: 12px 14px; font-size: 15px; color: #f1f1f3; transition: all 0.2s ease; outline: none; font-family: inherit;
        }
        .input::placeholder { color: #6c6d70; }
        .input:focus { border-color: rgba(244,114,182,0.3); box-shadow: 0 0 0 3px rgba(244,114,182,0.06); }

        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-primary { background: rgba(236,72,153,0.12); color: #f472b6; }
        .badge-success { background: rgba(52,211,153,0.1); color: #34d399; }
        .badge-warning { background: rgba(251,191,36,0.1); color: #fbbf24; }
        .badge-danger { background: rgba(248,113,113,0.1); color: #f87171; }
        .badge-muted { background: #1a1d24; color: #8e8f93; }

        .avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 600; color: #fff; flex-shrink: 0; }
        .avatar-sm { width: 32px; height: 32px; font-size: 12px; }
        .avatar-md { width: 44px; height: 44px; font-size: 16px; }
        .avatar-lg { width: 64px; height: 64px; font-size: 24px; }

        .list-row { display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-radius: 12px; transition: background 0.15s ease; }
        .list-row:hover { background: #1a1d24; }
        .list-row.active { background: #1a1d24; }

        .sep { height: 0.5px; background: rgba(255,255,255,0.06); }
        .toggle {
          width: 51px; height: 31px; border-radius: 31px; background: #21252e;
          position: relative; cursor: pointer; transition: background 0.3s ease; flex-shrink: 0;
        }
        .toggle::after {
          content: ''; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px;
          border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .toggle.active { background: #34d399; }
        .toggle.active::after { transform: translateX(20px); }
      `}</style>
    </div>
  );
}

/* ── Header component ── */
function Header({ logo, onLogoClick, nav, backLabel, onBack }: {
  logo: string;
  onLogoClick?: () => void;
  nav?: { label: string; active?: boolean; onClick?: () => void }[];
  backLabel?: string;
  onBack?: () => void;
}) {
  return (
    <header className="glass-header">
      <div className="header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && <button onClick={onBack} style={{ background: "none", border: "none", color: "#8e8f93", cursor: "pointer", fontSize: 13 }}>{backLabel}</button>}
          <button onClick={onLogoClick || (() => {})} style={{ background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", padding: 0 }}>{logo}</button>
        </div>
        {nav && (
          <nav style={{ display: "flex", alignItems: "center", gap: "1px", overflowX: "auto" }} className="scrollbar-hide">
            {nav.map((item) => (
              <button key={item.label} onClick={item.onClick} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: item.active ? "#1a1d24" : "transparent", color: item.active ? "#f1f1f3" : "#8e8f93",
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
              }}>{item.label}</button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

/* ── Footer ── */
function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>iin house</span>
        <div style={{ display: "flex", gap: 32 }}>
          {[{ label: "Contact", page: "contact" }, { label: "Terms", page: "landing" }, { label: "Privacy", page: "landing" }].map((l) => (
            <button key={l.label} onClick={() => navigate(l.page as Page)} style={{ background: "none", border: "none", color: "#8e8f93", cursor: "pointer", fontSize: 13 }}>{l.label}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── Reusable components ── */
function FeatureCard({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="card card-interactive" style={{ padding: 22 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${color})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

function StatCard({ label, value, trend, sub, success, up }: { label: string; value: string; trend?: string; sub?: string; success?: boolean; up?: boolean }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: success ? "#34d399" : "#f1f1f3" }}>{value}</div>
      {trend && <div style={{ fontSize: 11, color: "#34d399", marginTop: 2 }}>↑ {trend}</div>}
      {sub && <div style={{ fontSize: 11, color: "#8e8f93", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function AdminStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function AdminCard({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="card card-interactive" style={{ padding: 20, cursor: "pointer" }} onClick={() => {}}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color === "#fbbf24" ? "rgba(251,191,36,0.1)" : color === "#f87171" ? "rgba(248,113,113,0.1)" : color === "#34d399" ? "rgba(52,211,153,0.1)" : "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.55 }}>{desc}</p>
    </div>
  );
}
