import { LegalFooter } from "@/components/LegalFooter";

export const metadata = { title: "Privacy Policy", robots: "noindex" };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main className="container" style={{ maxWidth: '720px', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 32 }}>Last updated: January 2026. Compliant with India&apos;s Digital Personal Data Protection Act (DPDP Act).</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>1. Information We Collect</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            We collect: (a) <strong>Account information</strong> — email, phone number, display name, and profile details; (b) <strong>Identity verification</strong> — government-issued ID documents (Aadhaar, PAN) processed via third-party KYC providers; (c) <strong>Content</strong> — photos, videos, audio, and text you upload; (d) <strong>Payment information</strong> — transaction records processed by Razorpay and Stripe (we do not store full card details); (e) <strong>Usage data</strong> — device information, IP address, and interaction logs.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            We use your data to: operate and improve the Platform; process payments and payouts; enforce age and identity verification;
            communicate service updates and support responses; comply with legal obligations including tax withholding (TDS) and AML/KYC regulations;
            prevent fraud and abuse. We do not sell your personal data to third parties.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>3. Data Sharing &amp; Disclosure</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            We share data with: <strong>Payment processors</strong> (Razorpay, Stripe) for transaction processing;
            <strong>KYC providers</strong> for identity verification; <strong>Cloud hosting</strong> for infrastructure;
            <strong>Legal authorities</strong> when required by law (including IT Act and DPDP Act obligations);
            <strong>Business transfers</strong> in the event of merger or acquisition. Your KYC documents are encrypted at rest and in transit.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>4. Data Retention</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            Account data is retained while your account is active. Transaction records are retained for 7 years as required by Indian tax law (IT Act Section 44AB).
            KYC documents are retained for 5 years after account closure per PMLA requirements. You may request data export or account deletion at any time.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>5. Your Rights (DPDP Act)</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            Under the DPDP Act, you have the right to: <strong>Access</strong> — request a copy of your personal data;
            <strong>Correction</strong> — update inaccurate information; <strong>Erasure</strong> — request deletion of your data;
            <strong>Data portability</strong> — receive your data in a structured format; <strong>Grievance redressal</strong> — contact our Grievance Officer at privacy@iinhouse.com. We will respond to verified requests within 30 days.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>6. Security</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            We implement industry-standard security measures including TLS encryption for data in transit, AES-256 encryption for sensitive data at rest,
            access controls and audit logging, and regular security assessments. However, no system is completely secure — you are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>7. Children&apos;s Privacy</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            This Platform is not intended for users under 18. We do not knowingly collect personal data from minors.
            If we discover that a minor has provided personal data, we will delete it immediately.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>8. Contact</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            For privacy concerns, contact our Grievance Officer at privacy@iinhouse.com or by mail at:
            iin house Technologies Pvt. Ltd., [Registered Office Address].
          </p>
        </section>
      </main>
      <LegalFooter />
    </div>
  );
}
