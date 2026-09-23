import Link from "next/link";
import { Sparkles, Lock, Zap, Shield, MessageCircle, TrendingUp, Users, DollarSign, Eye } from "lucide-react";

const features = [
  { icon: Lock, title: "Content Protection", body: "Server-side watermarking with per-session forensic marks. Signed URLs with token expiry. Download prevention built in.", gradient: "from-pink-600 to-rose-500" },
  { icon: DollarSign, title: "Payouts That Don't Hold Your Money", body: "Rolling weekly payouts once verified. No 21-day holds. You earned it, you get it.", gradient: "from-emerald-600 to-teal-500" },
  { icon: Zap, title: "Subscriptions + PPV + DMs", body: "Flexible tiers. Charge for messages and content. Take tips inside conversations.", gradient: "from-violet-600 to-purple-500" },
  { icon: Shield, title: "Trust by Design", body: "Verified creators. Transparent commission. Content protection that actually works.", gradient: "from-blue-600 to-indigo-500" },
  { icon: MessageCircle, title: "Paid DMs & Unlocks", body: "Charge for messages. Sell PPV content. Everything inside a clean conversation flow.", gradient: "from-amber-600 to-orange-500" },
  { icon: Eye, title: "Discovery Without Burnout", body: "Curated feed, not infinite scroll. Algorithmic but not exhausting. Built for real browsing.", gradient: "from-cyan-600 to-sky-500" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Animated gradient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Navigation */}
      <header className="glass-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="header-inner" style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="gradient-text" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>iin house</Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/feed" className="nav-tab">Browse</Link>
            <Link href="/login" className="nav-tab">Log in</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '6px 18px', fontSize: '13px', height: '34px' }}>Get started</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Badge */}
          <div className="anim-fade-in-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: 'var(--radius-full)', marginBottom: '32px',
            border: '1px solid var(--separator-strong)',
            background: 'rgba(236,72,153,0.08)', color: '#f472b6',
            fontSize: '13px', fontWeight: 500
          }}>
            <Sparkles size={14} />
            Built for creators, designed for trust
          </div>

          {/* Headline */}
          <h1 className="anim-fade-in-up" style={{ animationDelay: '0.05s', fontSize: 'clamp(44px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.035em', marginBottom: '24px' }}>
            The creator platform<br />
            <span className="gradient-text">without the bloat.</span>
          </h1>

          {/* Subheadline */}
          <p className="anim-fade-in-up" style={{ animationDelay: '0.1s', fontSize: '18px', color: 'var(--text-tertiary)', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Subscription tiers. Pay-per-view. Direct messages. Content protection that actually protects. Fast payouts.
          </p>

          {/* CTAs */}
          <div className="anim-fade-in-up" style={{ animationDelay: '0.15s', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?role=creator" className="btn btn-primary btn-lg">Start as a creator</Link>
            <Link href="/register?role=subscriber" className="btn btn-secondary btn-lg">Join as a subscriber</Link>
          </div>

          {/* Stats */}
          <div className="anim-fade-in-up" style={{ animationDelay: '0.2s', display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '64px', flexWrap: 'wrap' }}>
            {[
              { value: "100%", label: "Your earnings" },
              { value: "<1%", label: "Platform fee" },
              { value: "Weekly", label: "Payouts" },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, background: 'linear-gradient(135deg, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-quaternary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: 'var(--max-wide)', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {features.map(({ icon: Icon, title, body, gradient }, i) => (
            <div key={title} className="card card-interactive stagger" style={{ animationDelay: `${i * 0.05}s`, padding: '28px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '18px'
              }} className={`bg-gradient-to-br ${gradient}`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '0.5px solid var(--separator)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 'var(--max-wide)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="gradient-text" style={{ fontSize: '16px', fontWeight: 700 }}>iin house</span>
            <p style={{ fontSize: '12px', color: 'var(--text-quaternary)', marginTop: '4px' }}>Built for creators, designed for trust.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/contact" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="hover:text-white">Contact</Link>
            <Link href="/terms" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="hover:text-white">Terms</Link>
            <Link href="/privacy" style={{ fontSize: '13px', color: 'var(--text-tertiary)', transition: 'color 0.2s' }} className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
