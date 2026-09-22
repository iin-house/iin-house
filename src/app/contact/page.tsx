import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Contact — iin house" };

export default function ContactPage() {
  const channels = [
    { icon: "📧", title: "Email support", email: "support@iinhouse.com", desc: "For account issues, billing, and general questions.", color: "rgba(244,114,182,0.1)" },
    { icon: "⚖️", title: "Grievance Officer", email: "grievances@iinhouse.com", desc: "Required under IT Rules 2021. Response within 48 hours.", color: "rgba(96,165,250,0.1)" },
    { icon: "🤝", title: "Partnerships", email: "partners@iinhouse.com", desc: "Creator relations, onboarding, and partnership inquiries.", color: "rgba(52,211,153,0.1)" },
    { icon: "🔒", title: "Privacy & data requests", email: "privacy@iinhouse.com", desc: "Data access, deletion, and privacy inquiries.", color: "rgba(251,191,36,0.1)" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-3)' }}>← Back</Link>
          <span className="gradient-text font-bold text-base">iin house</span>
          <div style={{ width: '40px' }} />
        </div>
      </header>

      <main className="container" style={{ padding: '28px 20px', maxWidth: '720px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Contact Us</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>We're here to help. Reach out through any channel below.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {channels.map(c => (
            <div key={c.title} className="card card-interactive" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: c.color, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0
              }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{c.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>{c.desc}</p>
                <a href={`mailto:${c.email}`} style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '4px', display: 'inline-block' }}>{c.email}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '20px', marginTop: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Business address</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>iin house (registered business name)<br/>India — update with your registered address before launch</p>
        </div>
      </main>
    </div>
  );
}
