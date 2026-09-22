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
  | "contract"
  | "admin"
  | "contact";

type Role = "CREATOR" | "SUBSCRIBER" | "ADMIN";

export default function DemoPage() {
  const [page, setPage] = useState<Page>("landing");
  const [role, setRole] = useState<Role>("CREATOR");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState("Priya Art");
  const [activeConv, setActiveConv] = useState("1");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const gradient = (c: string) =>
    `background:linear-gradient(135deg,${c});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;

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
        <span>Logged in as</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{
            background: "#1a1d24", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8,
            padding: "3px 8px", color: "#f1f1f3", fontSize: 12, outline: "none", cursor: "pointer",
          }}
        >
          <option value="CREATOR">Creator</option>
          <option value="SUBSCRIBER">Subscriber</option>
          <option value="ADMIN">Admin</option>
        </select>
        <span style={{ color: "#6c6d70" }}>· No real data. Click around.</span>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 64, right: 16, zIndex: 300,
          background: "rgba(28,28,30,0.92)", backdropFilter: "blur(20px)", border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: "12px 18px", fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "fadeIn 0.3s ease",
          maxWidth: 340,
        }}>{toast}</div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* LANDING */}


{/* LANDING */}
{page === "landing" && (
  <div>
    <Header logo="iin house" />
    <section style={{ padding: "80px 24px 60px", textAlign: "center" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20,
        border: "1px solid rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.06)",
        color: "#f472b6", fontSize: 13, fontWeight: 600, marginBottom: 28,
      }}>
        ✨ Built for creators, designed for trust
      </div>
      <h1 style={{ fontSize: "clamp(40px,7vw,64px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20 }}>
        The creator platform<br />
        <span style={{ background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>without the bloat.</span>
      </h1>
      <p style={{ fontSize: 17, color: "#8e8f93", maxWidth: 540, margin: "0 auto 36px", lineHeight: 1.55 }}>
        Subscription tiers. Pay-per-view. Direct messages. Content protection that actually protects. Fast payouts.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ padding: "0 28px", height: 52, fontSize: 15 }} onClick={() => navigate("register")}>Start as a creator</button>
        <button className="btn btn-secondary" style={{ padding: "0 28px", height: 52, fontSize: 15 }} onClick={() => navigate("feed")}>Browse creators</button>
      </div>
      <div style={{ maxWidth: 1100, margin: "80px auto 0", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          <FeatureCard icon="🔒" title="Content Protection" desc="Server-side watermarking. Per-session forensic watermarks at playback. Signed URLs with token expiry." color="#9d174d,#be185d" />
          <FeatureCard icon="💰" title="Fast Payouts" desc="Rolling weekly payouts via RazorpayX once verified. No 21-day holds. You earned it, you get it." color="#7c3aed,#a78bfa" />
          <FeatureCard icon="💬" title="Paid DMs & Unlocks" desc="Charge for messages, sell PPV content, take tips. Everything inside a clean conversation flow." color="#059669,#34d399" />
        </div>
      </div>
    </section>
  </div>
)}

      {/* ══════════════════════════════════════════════ */}
      {/* LOGIN */}


{page === "login" && (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ width: "100%", maxWidth: 380 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>iin house</div>
        <div style={{ fontSize: 12, color: "#8e8f93" }}>Welcome back</div>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <form onSubmit={(e) => { e.preventDefault(); navigate("dashboard"); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Email or phone</label>
            <input className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input className="input" type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 4 }}>Sign in</button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 13 }}>
          <span style={{ color: "#8e8f93", cursor: "pointer" }}>Forgot password?</span>
          <span style={{ color: "#f472b6", fontWeight: 500, cursor: "pointer" }} onClick={() => navigate("register")}>Sign up</span>
        </div>
        <div className="sep" style={{ margin: "16px 0" }} />
        <div style={{ background: "rgba(236,72,153,0.06)", borderRadius: 12, padding: "12px 14px", fontSize: 12, color: "#c5c6ca", textAlign: "center" }}>
          <div style={{ marginBottom: 8, fontWeight: 600, color: "#f472b6" }}>Demo credentials</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 8 }}>
              <strong>admin</strong> / <strong>1234</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button type="button" className="btn btn-primary btn-sm" style={{ fontSize: 11, padding: "4px 12px" }} onClick={() => navigate("admin")}>Admin</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: "4px 12px" }} onClick={() => navigate("dashboard")}>Creator</button>
            <button type="button" className="btn btn-secondary btn-sm" style={{ fontSize: 11, padding: "4px 12px" }} onClick={() => navigate("feed")}>Subscriber</button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* ══════════════════════════════════════════════ */}
      {/* REGISTER */}


{page === "register" && (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ width: "100%", maxWidth: 380 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ background: "linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>iin house</div>
        <div style={{ fontSize: 12, color: "#8e8f93" }}>Create your account</div>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <div className="role-selector" style={{ marginBottom: 20 }}>
          <button className={`role-btn ${role === "CREATOR" ? "active" : ""}`} onClick={() => setRole("CREATOR")}>Creator</button>
          <button className={`role-btn ${role === "SUBSCRIBER" ? "active" : ""}`} onClick={() => setRole("SUBSCRIBER")}>Subscriber</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); showToast("Account created! (demo)"); navigate("feed"); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Display name</label>
            <input className="input" placeholder="Your name" required />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input className="input" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label style={labelStyle}>Phone (+91…)</label>
            <input className="input" placeholder="optional" />
          </div>
          <div>
            <label style={labelStyle}>Password (min 8 chars)</label>
            <input className="input" type="password" placeholder="••••••••" required minLength={8} />
          </div>
          <div>
            <label style={labelStyle}>Confirm password</label>
            <input className="input" type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 4 }}>Create account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#8e8f93" }}>
          Already have an account? <span style={{ color: "#f472b6", fontWeight: 500, cursor: "pointer" }} onClick={() => navigate("login")}>Sign in</span>
        </p>
      </div>
    </div>
  </div>
)}

      {/* ══════════════════════════════════════════════ */}
      {/* FEED */}


{page === "feed" && (
  <div>
    <Header logo="iin house" nav={[
      { label: "Feed", active: true },
      { label: "Messages", onClick: () => navigate("messages") },
      { label: "Contact", onClick: () => navigate("contact") },
    ]} />
    <div style={{ position: "sticky", top: 52, zIndex: 40, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 8px" }}>
      <div style={{ background: "#1a1d24", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#6c6d70" }}>🔍</span>
        <input className="input" style={{ border: "none", background: "transparent", padding: 0 }} placeholder="Search creators, tiers, content…" />
      </div>
    </div>
    <div style={{ padding: "4px 16px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
      <button className="btn btn-primary btn-sm" style={{ borderRadius: 20 }}>All</button>
      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 20 }}>Art</button>
      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 20 }}>Music</button>
      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 20 }}>Fitness</button>
      <button className="btn btn-secondary btn-sm" style={{ borderRadius: 20 }}>Tech</button>
    </div>
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 16px 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
        {[
          { name: "Priya Art", desc: "Digital artist", price: "₹149/mo", emoji: "🎨", g: "#9d174d,#be185d" },
          { name: "Rohit Beats", desc: "Music producer", price: "₹299/mo", emoji: "🎵", g: "#7c3aed,#a78bfa" },
          { name: "Fit With Me", desc: "Fitness coach", price: "₹199/mo", emoji: "💪", g: "#059669,#34d399" },
          { name: "Lens Life", desc: "Photographer", price: "₹99/mo", emoji: "📷", g: "#dc2626,#f87171" },
          { name: "Code With Raj", desc: "Developer", price: "₹249/mo", emoji: "💻", g: "#2563eb,#60a5fa" },
          { name: "Bake With Amy", desc: "Baker & chef", price: "₹149/mo", emoji: "🧁", g: "#ea580c,#fb923c" },
        ].map((c) => (
          <div key={c.name} className="card card-interactive" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => { setSelectedProfile(c.name); navigate("profile"); }}>
            <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg,${c.g})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{c.emoji}</div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#8e8f93" }}>{c.desc}</div>
              <div style={{ marginTop: 8 }}><span className="badge badge-primary">{c.price}</span></div>
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
    <Header logo="iin house" backLabel="← Back" onBack={() => navigate("feed")} />
    <div style={{ height: 160, background: "linear-gradient(135deg,#9d174d,#be185d)" }} />
    <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2, marginTop: -40, padding: "0 24px 40px" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", border: "4px solid #000",
        background: "linear-gradient(135deg,#ec4899,#db2777)", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff",
      }}>{selectedProfile[0]}</div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{selectedProfile}</h1>
          <span className="badge badge-success">✓ Verified</span>
        </div>
        <p style={{ fontSize: 13, color: "#8e8f93", marginTop: 4 }}>847 subscribers · 156 posts · Digital creator</p>
        <p style={{ fontSize: 14, color: "#c5c6ca", marginTop: 10, lineHeight: 1.55 }}>Creating digital art and tutorials. Subscribe for exclusive content, early access, and behind-the-scenes!</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn btn-primary btn-sm">Subscribe — ₹149/mo</button>
          <button className="btn btn-secondary btn-sm">Message</button>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Membership tiers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          <TierCard name="Starter" price={149} desc="Early access to posts and community chat" />
          <TierCard name="VIP" price={299} desc="All posts + DMs + exclusive content" popular />
          <TierCard name="Elite" price={499} desc="Everything + monthly 1:1 calls" />
        </div>
      </div>
      <div style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Posts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
          {["🎨", "✏️", "📸", "🔥"].map((e, i) => (
            <div key={i} style={{ aspectRatio: 1, borderRadius: 12, background: `linear-gradient(135deg,${["#9d174d,#be185d","#7c3aed,#a78bfa","#059669,#34d399","#dc2626,#f87171"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{e}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

      {/* ══════════════════════════════════════════════ */}
      {/* CREATOR DASHBOARD */}


{page === "dashboard" && (
  <div>
    <Header logo="iin house" nav={[
      { label: "Dashboard", active: true },
      { label: "Upload", onClick: () => navigate("upload") },
      { label: "Tiers", onClick: () => navigate("tiers") },
      { label: "Earnings", onClick: () => navigate("earnings") },
      { label: "Messages", onClick: () => navigate("messages") },
      { label: "Payouts", onClick: () => navigate("payouts") },
      { label: "Contract", onClick: () => navigate("contract") },
    ]} />
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Welcome back, Creator</p>
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
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#8e8f93" }}>Joined {s.tier}</div>
              </div>
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
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Messages</div>
              <div style={{ fontSize: 12, color: "#8e8f93" }}>3 unread</div>
            </div>
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
      { label: "Tiers", onClick: () => navigate("tiers") },
      { label: "Earnings", onClick: () => navigate("earnings") },
      { label: "Messages", onClick: () => navigate("messages") },
    ]} />
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Upload Content</h1>
      <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Share photos, videos, audio, or text with your subscribers</p>
      <div className="dropzone" onClick={() => showToast("Files selected ✓")}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📤</div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: "#f1f1f3" }}>Drop files here or click to browse</div>
        <div style={{ fontSize: 12, color: "#8e8f93" }}>Photos, videos, audio, or documents — watermarked automatically</div>
      </div>
      <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
        <div>
          <label style={labelStyle}>Content type</label>
          <select className="input"><option>📷 Photo</option><option>🎬 Video</option><option>🎵 Audio</option><option>📝 Text</option></select>
        </div>
        <div>
          <label style={labelStyle}>Caption</label>
          <textarea className="input" rows={3} style={{ resize: "vertical" }} placeholder="Tell your subscribers what this is about…" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="toggle" onClick={(e) => { (e.target as HTMLElement).classList.toggle("active"); }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Pay-per-view content</div>
            <div style={{ fontSize: 12, color: "#8e8f93" }}>Subscribers pay to unlock this post</div>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Schedule (optional)</label>
          <input type="datetime-local" className="input" />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={() => showToast("Post published! 🎉")}>Publish now</button>
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
      { label: "Upload", onClick: () => navigate("upload") },
      { label: "Tiers", active: true },
      { label: "Earnings", onClick: () => navigate("earnings") },
    ]} />
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Subscription Tiers</h1>
        <button className="btn btn-primary btn-sm" onClick={() => showToast("New tier form would appear")}>+ New tier</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { name: "Starter", desc: "Early access to posts", price: "₹149", active: true },
          { name: "VIP", desc: "All posts + DMs", price: "₹299", active: true },
          { name: "Elite", desc: "Everything + monthly calls", price: "₹499", active: false },
        ].map((t) => (
          <div key={t.name} className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</p>
              <p style={{ fontSize: 12, color: "#8e8f93", marginTop: 2 }}>{t.desc}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#ec4899" }}>{t.price}</span>
              <span className={`badge ${t.active ? "badge-success" : "badge-muted"}`}>{t.active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
      </div>
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
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>Subscriptions</td>
              <td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 847 payments</td>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹18,200</td>
            </tr>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>PPV Purchases</td>
              <td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 156 purchases</td>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹6,300</td>
            </tr>
            <tr>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500 }}>Tips</td>
              <td style={{ padding: "12px 20px", fontSize: 13, color: "#8e8f93" }}>Jan 2026 · 42 tips</td>
              <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399", textAlign: "right" }}>+₹2,100</td>
            </tr>
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
          <div>
            <div style={{ fontSize: 12, color: "#8e8f93" }}>Available balance</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>₹24,500</div>
          </div>
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
              { date: "2026-08-12", amount: "₹3,200", status: "Completed", method: "UPI" },
              { date: "2026-07-26", amount: "₹1,850", status: "Completed", method: "UPI" },
              { date: "2026-07-12", amount: "₹900", status: "Failed", method: "UPI" },
            ].map((p) => (
              <tr key={p.date} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "12px 20px", fontSize: 13 }}>{p.date}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, textAlign: "right" }}>{p.amount}</td>
                <td style={{ padding: "12px 20px", textAlign: "right" }}><span className={`badge ${p.status === "Completed" ? "badge-success" : "badge-danger"}`}>{p.status}</span></td>
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
                  <p>Hey, welcome! Thanks for subscribing.</p>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>2m</span>
                </div>
                <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-end", background: "linear-gradient(135deg,#db2777,#ec4899)", color: "#fff", borderBottomRightRadius: 6 }}>
                  <p>Thanks! Loving the content so far ✨</p>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, opacity: 0.7 }}>1m</span>
                </div>
                <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-start", background: "#1a1d24", color: "#f1f1f3", borderBottomLeftRadius: 6 }}>
                  <p>Here's something exclusive just for you 🔒</p>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>Just now</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-start", background: "#1a1d24", color: "#f1f1f3", borderBottomLeftRadius: 6 }}>
                  <p>Hey! How's it going?</p>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, color: "#6c6d70" }}>3h</span>
                </div>
                <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: 18, fontSize: 14, alignSelf: "flex-end", background: "linear-gradient(135deg,#db2777,#ec4899)", color: "#fff", borderBottomRightRadius: 6 }}>
                  <p>Doing great! Just checking out the new content 🎵</p>
                  <span style={{ fontSize: 10, display: "block", marginTop: 4, opacity: 0.7 }}>2h</span>
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
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Download PDF</button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => showToast("Full terms would open")}>View full terms</button>
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Upload Custom Contract</h3>
        <div className="dropzone" onClick={() => showToast("Contract uploaded!")}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#8e8f93" }}>Drop your contract PDF here or click to browse</p>
          <p style={{ fontSize: 12, color: "#6c6d70" }}>PDF, DOC, or DOCX</p>
        </div>
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
      { label: "KYC", onClick: () => showToast("KYC page — 23 pending") },
      { label: "Moderation", onClick: () => showToast("7 open flags") },
      { label: "Contracts", onClick: () => navigate("contract") },
      { label: "Payouts", onClick: () => navigate("payouts") },
      { label: "Analytics", onClick: () => showToast("Analytics dashboard") },
      { label: "Compliance", onClick: () => showToast("Compliance checklist — 4 pending") },
    ]} />
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Admin Dashboard</h1>
      <p style={{ fontSize: 13, color: "#8e8f93", marginBottom: 24 }}>Platform overview & management</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 28 }}>
        <AdminStat label="Creators" value="1,247" color="#ec4899" />
        <AdminStat label="Pending KYC" value="23" color="#fbbf24" />
        <AdminStat label="Open Flags" value="7" color="#f87171" />
        <AdminStat label="Payouts" value="₹4.2L" color="#34d399" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        <AdminCard icon="📋" title="KYC Queue" desc="23 pending verifications. Review creator documents." color="#fbbf24" />
        <AdminCard icon="🛡️" title="Content Moderation" desc="7 open flags. Review, remove, warn, or dismiss." color="#f87171" />
        <AdminCard icon="📄" title="Creator Contracts" desc="Review and manage creator agreements." color="#f472b6" />
        <AdminCard icon="📊" title="Platform Analytics" desc="Revenue, growth, retention, and engagement." color="#34d399" />
      </div>
      {/* Compliance */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Compliance Checklist</h2>
        <div className="card" style={{ padding: 16, marginBottom: 14, borderColor: "rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fbbf24" }}>High priority — resolve before public launch</div>
              <div style={{ fontSize: 12, color: "#8e8f93", marginTop: 4, lineHeight: 1.5 }}>These items must be completed before going live.</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          {[
            "Grievance officer appointed",
            "Age verification (subscribers)",
            "KYC documentation reviewed",
            "Data protection audit completed",
          ].map((item, i) => (
            <div key={i} className="list-row" style={{ borderBottom: i < 3 ? "0.5px solid rgba(255,255,255,0.06)" : "none" }}>
              <span style={{ fontSize: 13, flex: 1 }}>{item}</span>
              <span className="badge badge-warning">Pending</span>
            </div>
          ))}
        </div>
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
        <ContactCard icon="📧" title="Email support" desc="For account issues, billing, and general questions." email="support@iinhouse.com" bg="rgba(244,114,182,0.1)" />
        <ContactCard icon="⚖️" title="Grievance Officer" desc="Required under IT Rules 2021. Response within 48 hours." email="grievances@iinhouse.com" bg="rgba(96,165,250,0.1)" />
        <ContactCard icon="🤝" title="Partnerships" desc="Creator relations, onboarding, and partnership inquiries." email="partners@iinhouse.com" bg="rgba(52,211,153,0.1)" />
        <ContactCard icon="🔒" title="Privacy & data requests" desc="Data access, deletion, and privacy inquiries." email="privacy@iinhouse.com" bg="rgba(251,191,36,0.1)" />
      </div>
      <div className="card" style={{ padding: 20, marginTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Business address</h3>
        <p style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.6 }}>iin house (registered business name)<br />India — update with your registered address before launch</p>
      </div>
    </main>
  </div>
)}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }

        .glass-header {
          position: sticky; top: 0; z-index: 50; height: 52px;
          background: rgba(12,12,14,0.78);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
        }
        .header-inner {
          max-width: 1200px; margin: 0 auto; height: 100%;
          padding: "0 16px"; display: flex; alignItems: center; justifyContent: space-between;
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none; cursor: pointer; white-space: nowrap; letter-spacing: -0.01em;
          font-family: inherit;
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
        .btn-ghost:hover { background: #1a1d24; color: #f1f1f3; }
        .btn-danger { background: rgba(248,113,113,0.15); color: #f87171; }
        .btn-danger:hover { background: rgba(248,113,113,0.25); }
        .btn-sm { padding: 6px 14px; font-size: 13px; border-radius: 10px; }
        .btn:disabled { opacity: 0.35; pointer-events: none; }

        .card {
          background: #131518; border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 16px; transition: all 0.25s ease;
        }
        .card-interactive:hover { border-color: rgba(255,255,255,0.1); background: #1a1d24; }
        .card-interactive:active { transform: scale(0.985); }

        .input {
          width: 100%; background: #1a1d24; border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #f1f1f3;
          transition: all 0.2s ease; outline: none; font-family: inherit;
        }
        .input::placeholder { color: #6c6d70; }
        .input:focus { border-color: rgba(244,114,182,0.3); box-shadow: 0 0 0 3px rgba(244,114,182,0.06); }

        .badge {
          display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 600;
        }
        .badge-primary { background: rgba(236,72,153,0.12); color: #f472b6; }
        .badge-success { background: rgba(52,211,153,0.1); color: #34d399; }
        .badge-warning { background: rgba(251,191,36,0.1); color: #fbbf24; }
        .badge-danger  { background: rgba(248,113,113,0.1); color: #f87171; }
        .badge-muted   { background: #1a1d24; color: #8e8f93; }

        .avatar {
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; font-weight: 600; color: #fff; flex-shrink: 0;
        }
        .avatar-sm { width: 32px; height: 32px; font-size: 12px; }
        .avatar-md { width: 44px; height: 44px; font-size: 16px; }

        .list-row {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 8px; border-radius: 12px;
          transition: background 0.15s ease;
        }
        .list-row:hover { background: #1a1d24; }

        .sep { height: 0.5px; background: rgba(255,255,255,0.06); }

        .toggle {
          width: 51px; height: 31px; border-radius: 31px; background: #21252e;
          position: relative; cursor: pointer; transition: background 0.3s ease; flex-shrink: 0;
        }
        .toggle::after {
          content: ''; position: absolute; top: 2px; left: 2px;
          width: 27px; height: 27px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .toggle.active { background: #34d399; }
        .toggle.active::after { transform: translateX(20px); }

        .role-selector { display: flex; gap: 6px; background: #1a1d24; border-radius: 12px; padding: 3px; }
        .role-btn {
          flex: 1; text-align: center; padding: 9px; border-radius: 10px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s ease;
          font-family: inherit;
        }
        .role-btn.active { background: #131518; color: #f1f1f3; }
        .role-btn:not(.active) { background: transparent; color: #8e8f93; }

        .dropzone {
          padding: 40px 24px; text-align: center; cursor: pointer;
          background: #131518; border: 2px dashed rgba(255,255,255,0.15);
          border-radius: 16px; transition: all 0.2s ease;
        }
        .dropzone:hover { border-color: rgba(236,72,153,0.3); }

        .label {
          display: block; font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: #8e8f93; margin-bottom: 6px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ec4899, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ── INLINE COMPONENTS ──

function Header({ logo, nav, backLabel, onBack }: { logo: string; nav?: { label: string; active?: boolean; onClick?: () => void }[]; backLabel?: string; onBack?: () => void }) {
  return (
    <header className="glass-header">
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {backLabel && <span style={{ fontSize: 13, color: "#8e8f93", cursor: "pointer" }} onClick={onBack}>{backLabel}</span>}
          <span className="gradient-text" style={{ fontSize: 16, fontWeight: 700 }}>{logo}</span>
        </div>
        {nav && (
          <nav style={{ display: "flex", gap: 1, alignItems: "center" }}>
            {nav.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick || (() => {})}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: item.active ? 500 : 400,
                  color: item.active ? "#f1f1f3" : "#8e8f93", background: item.active ? "#1a1d24" : "transparent",
                  border: "none", cursor: "pointer", transition: "all 0.2s ease",
                }}
              >{item.label}</button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8e8f93" }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: success ? "#34d399" : "#f1f1f3" }}>{value}</div>
      {trend && <div style={{ fontSize: 11, color: "#34d399", marginTop: 2, display: "flex", alignItems: "center", gap: 2 }}>↑ {trend}</div>}
      {sub && <div style={{ fontSize: 11, color: "#8e8f93", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function TierCard({ name, price, desc, popular }: { name: string; price: number; desc: string; popular?: boolean }) {
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: popular ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.06)" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{name}</span>
          {popular && <span className="badge badge-primary">Popular</span>}
        </div>
        <p style={{ fontSize: 12, color: "#8e8f93", lineHeight: 1.5 }}>{desc}</p>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: popular ? "#ec4899" : "#f1f1f3" }}>₹{price}</span>
        <span style={{ fontSize: 12, color: "#8e8f93" }}>/ mo</span>
      </div>
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
    <div className="card card-interactive" style={{ padding: 20, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color === "#fbbf24" ? "rgba(251,191,36,0.1)" : color === "#f87171" ? "rgba(248,113,113,0.1)" : color === "#34d399" ? "rgba(52,211,153,0.1)" : "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
      </div>
      <p style={{ fontSize: 13, color: "#8e8f93", lineHeight: 1.55 }}>{desc}</p>
    </div>
  );
}

function ContactCard({ icon, title, desc, email, bg }: { icon: string; title: string; desc: string; email: string; bg: string }) {
  return (
    <div className="card card-interactive" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{title}</h3>
        <p style={{ fontSize: 12, color: "#8e8f93", lineHeight: 1.5 }}>{desc}</p>
        <a href={`mailto:${email}`} style={{ fontSize: 13, color: "#ec4899", marginTop: 4, display: "inline-block" }}>{email}</a>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "#8e8f93", marginBottom: 6,
};
