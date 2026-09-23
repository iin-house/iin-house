import Link from "next/link";
import { CheckCircle2, ArrowUpRight, Shield, Clock, MessageCircle, Palette } from "lucide-react";

const features = [
  {
    title: "Content that stays yours",
    body: "Per-session watermarks. Signed URLs that expire. No downloads, no screenshots, no leaks. Protection that works without getting in the way.",
    accent: "amber",
  },
  {
    title: "Subscriptions that pay out weekly",
    body: "No 21-day holds. No minimum thresholds. Verified creators get rolling weekly payments directly to their account.",
    accent: "amber",
  },
  {
    title: "Any content, any price",
    body: "Free tiers to build an audience. Paid tiers for dedicated fans. PPV posts for premium content. Paid DMs for private conversations.",
    accent: "amber",
  },
  {
    title: "Verified, not anonymous",
    body: "Every creator goes through KYC. Subscribers browse with confidence. Disputes get resolved by real people, not bots.",
    accent: "amber",
  },
  {
    title: "Messages worth paying for",
    body: "Unlock conversations. Sell content inside the chat. Tips go directly to creators. The platform stays out of the way.",
    accent: "amber",
  },
  {
    title: "Built to discover, not to distract",
    body: "A curated feed, not an infinite scroll. Browse by category, follow creators, find what matters. No algorithms optimizing for time-on-site.",
    accent: "amber",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(12,12,14,0.82)', backdropFilter: 'blur(24px) saturate(140%)', WebkitBackdropFilter: 'blur(24px) saturate(140%)', borderBottom: '1px solid var(--border)', height: 'var(--header-height)' }}>
        <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link href="/feed" style={{ padding: '6px 14px', fontSize: '14px', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', transition: 'all 150ms ease' }} className="nav-link">Browse</Link>
            <Link href="/login" style={{ padding: '6px 14px', fontSize: '14px', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', transition: 'all 150ms ease' }} className="nav-link">Log in</Link>
            <Link href="/register" className="btn btn-primary" style={{ marginLeft: '8px', padding: '0 18px', height: '34px', fontSize: '13px', fontWeight: 600 }}>Get started</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: 'clamp(80px, 12vh, 140px) 28px 80px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 7vw, 80px)',
          fontWeight: 700,
          lineHeight: 'var(--leading-display)',
          letterSpacing: 'var(--tracking-tight)',
          marginBottom: '28px',
          maxWidth: '680px',
        }}>
          A private space for creators and their audience.
        </h1>
        <p style={{
          fontSize: 'var(--text-lg)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          maxWidth: '520px',
          marginBottom: '40px',
        }}>
          Subscription tiers, pay-per-view content, and direct conversations — protected by design, paid on your terms.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/register?role=creator" className="btn btn-primary btn-lg">Start creating</Link>
          <Link href="/feed" className="btn btn-secondary btn-lg">Browse creators</Link>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Features — asymmetric two-column layout */}
      <section style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '80px 28px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px 40px' }}>
          {features.map(({ title, body }, i) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ width: '28px', height: '2px', background: 'var(--accent)', borderRadius: '1px' }} />
              <h3 style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-normal)',
              }}>{title}</h3>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 28px' }}>
        <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600 }}>iin house</span>
          <div style={{ display: 'flex', gap: '28px' }}>
            <Link href="/contact" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 150ms' }}>Contact</Link>
            <Link href="/terms" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 150ms' }}>Terms</Link>
            <Link href="/privacy" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 150ms' }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
