import Link from "next/link";

export function LegalFooter() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '20px',
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--text-3)',
      marginTop: 40,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/legal/terms" style={{ color: 'var(--text-3)' }}>Terms of Service</Link>
        <Link href="/legal/privacy" style={{ color: 'var(--text-3)' }}>Privacy Policy</Link>
        <a href="mailto:legal@iinhouse.com" style={{ color: 'var(--text-3)' }}>Contact</a>
      </div>
      <div style={{ marginTop: 6 }}>
        © 2026 iin house Technologies. All rights reserved.
      </div>
    </footer>
  );
}
