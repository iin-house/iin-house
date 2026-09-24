import Link from "next/link";
import { CheckCircle2, ArrowUpRight, Shield, Clock, MessageCircle, Palette, Zap, Users, Lock, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Content that stays yours",
    body: "Per-session watermarks. Signed URLs that expire. No downloads, no screenshots, no leaks. Protection that works without getting in the way.",
    icon: Lock,
    accent: "#f472b6",
  },
  {
    title: "Subscriptions that pay out weekly",
    body: "No 21-day holds. No minimum thresholds. Verified creators get rolling weekly payments directly to their account.",
    icon: TrendingUp,
    accent: "#34d399",
  },
  {
    title: "Any content, any price",
    body: "Free tiers to build an audience. Paid tiers for dedicated fans. PPV posts for premium content. Paid DMs for private conversations.",
    icon: Palette,
    accent: "#fbbf24",
  },
  {
    title: "Verified, not anonymous",
    body: "Every creator goes through KYC. Subscribers browse with confidence. Disputes get resolved by real people, not bots.",
    icon: Shield,
    accent: "#60a5fa",
  },
  {
    title: "Messages worth paying for",
    body: "Unlock conversations. Sell content inside the chat. Tips go directly to creators. The platform stays out of the way.",
    icon: MessageCircle,
    accent: "#a78bfa",
  },
  {
    title: "Built to discover, not to distract",
    body: "A curated feed, not an infinite scroll. Browse by category, follow creators, find what matters. No algorithms optimizing for time-on-site.",
    icon: Zap,
    accent: "#fb923c",
  },
];

const stats = [
  { value: "50K+", label: "Creators" },
  { value: "₹2Cr+", label: "Paid out" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>

      {/* ── Background effects ──────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            iin house
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/feed" className="nav-link">Browse</Link>
            <Link href="/login" className="nav-link">Log in</Link>
            <Link href="/register" className="btn btn-primary" style={{ marginLeft: '8px', padding: '0 20px', height: '36px', fontSize: '13px', fontWeight: 600 }}>Get started</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--max-content)', margin: '0 auto', padding: 'clamp(100px, 14vh, 180px) 28px 80px' }}>
        <div style={{ display: 'inline-block', padding: '6px 14px', background: 'var(--accent-soft)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '100px', fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '24px', letterSpacing: '0.02em' }}>
          ✦ Now in public beta
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display, -apple-system, BlinkMacSystemFont, sans-serif)',
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          marginBottom: '32px',
          maxWidth: '720px',
        }}>
          Your creativity,<br />
          <span style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb923c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            your rules.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(17px, 2vw, 20px)',
          color: 'var(--text-2)',
          lineHeight: 1.6,
          maxWidth: '560px',
          marginBottom: '44px',
          fontWeight: 400,
        }}>
          Subscription tiers, pay-per-view content, and direct conversations — protected by design, paid on your terms.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link href="/register?role=creator" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
            Start creating
            <ArrowUpRight size={18} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
          </Link>
          <Link href="/feed" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
            Browse creators
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '72px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #f1f1f3, #c5c6ca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {value}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '100px 28px 120px' }}>
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display, -apple-system, sans-serif)',
            fontSize: 'clamp(36px, 5vw, 52px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}>
            Built different.
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-2)', maxWidth: '480px', lineHeight: 1.6 }}>
            Every feature designed around one principle: creators keep what they earn.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px' }}>
          {features.map(({ title, body, icon: Icon, accent }, i) => (
            <div key={title} className="feature-card" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '36px 32px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                opacity: 0.6,
              }} />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Icon size={22} color={accent} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display, -apple-system, sans-serif)',
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                marginBottom: '10px',
                lineHeight: 1.3,
              }}>{title}</h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-2)',
                lineHeight: 1.7,
              }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 28px 140px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(244,114,182,0.05) 50%, rgba(251,146,60,0.08) 100%)',
          border: '1px solid rgba(236,72,153,0.2)',
          borderRadius: '32px',
          padding: 'clamp(48px, 8vw, 88px) clamp(24px, 5vw, 72px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-display, -apple-system, sans-serif)',
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}>
              Ready to own your audience?
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--text-2)',
              maxWidth: '480px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}>
              Join thousands of creators who&apos;ve moved to a platform that respects their work.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register?role=creator" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                Create your account
                <ArrowUpRight size={18} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
              </Link>
              <Link href="/feed" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
                Explore creators
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '48px 28px' }}>
        <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-display, -apple-system, sans-serif)', fontSize: '15px', fontWeight: 700, background: 'linear-gradient(135deg, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            iin house
          </span>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/contact" className="nav-link" style={{ fontSize: '13px' }}>Contact</Link>
            <Link href="/terms" className="nav-link" style={{ fontSize: '13px' }}>Terms</Link>
            <Link href="/privacy" className="nav-link" style={{ fontSize: '13px' }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
