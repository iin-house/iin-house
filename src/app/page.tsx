import Link from "next/link";
import { Sparkles, Lock, Zap, Shield, MessageCircle, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Navigation ─────────────────────────────────────── */}
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/" className="font-bold text-base gradient-text">iin house</Link>
          <nav className="flex items-center gap-1">
            <Link href="/feed" className="nav-tab">Browse</Link>
            <Link href="/login" className="nav-tab">Log in</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px', borderRadius: '10px' }}>Get started</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '20px', marginBottom: '28px',
          border: '1px solid rgba(236,72,153,0.2)',
          background: 'rgba(236,72,153,0.06)', color: '#f472b6',
          fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em'
        }}>
          <Sparkles size={14} /> Built for creators, designed for trust
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 64px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '20px' }}>
          The creator platform<br />
          <span className="gradient-text">without the bloat.</span>
        </h1>

        <p style={{
          fontSize: '17px', color: 'var(--text-3)',
          maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.55
        }}>
          Subscription tiers. Pay-per-view. Direct messages. Content protection that actually protects. Fast payouts.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register?role=creator" className="btn btn-primary" style={{ padding: '0 28px', height: '52px', fontSize: '15px' }}>Start as a creator</Link>
          <Link href="/register?role=subscriber" className="btn btn-secondary" style={{ padding: '0 28px', height: '52px', fontSize: '15px' }}>Join as a subscriber</Link>
        </div>

        {/* Feature grid */}
        <div className="container" style={{ marginTop: '80px', paddingBottom: '80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px', maxWidth: '1100px', margin: '0 auto'
          }}>
            {[
              { icon: Lock, title: "Content Protection", body: "Server-side watermarking. Per-session forensic watermarks at playback. Signed URLs with token expiry. Download prevention.", gradient: "from-primary-700 to-primary-600" },
              { icon: TrendingUp, title: "Payouts that don't hold your money hostage", body: "Rolling weekly payouts via RazorpayX once verified. No 21-day holds. You earned it, you get it.", gradient: "from-purple-600 to-purple-500" },
              { icon: Zap, title: "Subscription tiers + PPV + DMs", body: "Flexible tier setup. Charge for messages and PPV content. Take tips — directly inside the conversation.", gradient: "from-emerald-600 to-emerald-500" },
              { icon: Shield, title: "Trust by design", body: "Verified creators, transparent commission structure, visible content protection. Subscribers trust the platform.", gradient: "from-blue-600 to-blue-500" },
              { icon: MessageCircle, title: "Paid DMs & unlocks", body: "Charge for messages, sell PPV content, take tips. Everything happens inside a clean, fast conversation flow.", gradient: "from-amber-600 to-amber-500" },
              { icon: Sparkles, title: "Discovery without burnout", body: "A curated feed, not infinite scroll. Algorithmic but not exhausting. Built for actual browsing.", gradient: "from-rose-600 to-rose-500" },
            ].map(({ icon: Icon, title, body, gradient }) => (
              <div key={title} className="card card-interactive" style={{ padding: '22px', textAlign: 'left' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', marginBottom: '14px'
                }} className={`bg-gradient-to-br ${gradient}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.55 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '0.5px solid var(--sep)', padding: '28px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="gradient-text font-bold">iin house</span>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Built for creators, designed for trust.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/contact" style={{ fontSize: '13px', color: 'var(--text-3)' }}>Contact</Link>
            <Link href="/terms" style={{ fontSize: '13px', color: 'var(--text-3)' }}>Terms</Link>
            <Link href="/privacy" style={{ fontSize: '13px', color: 'var(--text-3)' }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
