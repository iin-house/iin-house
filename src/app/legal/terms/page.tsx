import { LegalFooter } from "@/components/LegalFooter";

export const metadata = { title: "Terms of Service", robots: "noindex" };

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main className="container" style={{ maxWidth: '720px', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 32 }}>Last updated: January 2026. Effective immediately upon use.</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            By accessing or using the iin house platform (&quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;).
            If you do not agree to these Terms, you may not use the Platform. We reserve the right to modify these Terms at any time;
            your continued use constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>2. Eligibility</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            You must be at least 18 years old (or the age of majority in your jurisdiction) to use this Platform.
            By using the Platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding agreement.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>3. Content &amp; Conduct</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            You are solely responsible for any content you upload, post, or transmit on the Platform.
            You agree not to upload content that: (a) is illegal, harmful, or violates any law; (b) infringes on intellectual property rights;
            (c) contains hate speech, harassment, or threats; (d) depicts minors; (e) violates anyone&apos;s privacy.
            We reserve the right to remove any content and terminate accounts that violate these Terms.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>4. Payments &amp; Subscriptions</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            Subscription and pay-per-view payments are processed through third-party payment providers (Razorpay, Stripe).
            All payments are non-refundable except as provided in our Refund Policy or as required by law.
            Subscription renewals continue until cancelled. You may cancel at any time through your account settings.
            Refunds are available within 48 hours of purchase for PPV content.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>5. Revenue &amp; Taxes</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            Creators are responsible for declaring and paying all applicable taxes on their earnings, including GST, income tax, and TDS.
            Indian creators must provide a valid GSTIN if their turnover exceeds the GST registration threshold.
            We will issue 26AS/Form 16A for TDS deducted as required under Indian tax law.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>6. Intellectual Property</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            The Platform, including its design, code, and branding, is owned by iin house and protected by intellectual property laws.
            You retain ownership of content you upload. By uploading, you grant us a non-exclusive, worldwide license to host, display,
            and distribute your content solely for the purpose of operating the Platform.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>7. Termination</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            We may suspend or terminate your account at any time for violation of these Terms or for any reason deemed appropriate.
            You may request account deletion at any time through your account settings. Deletion is processed within 30 days.
            Data export is available upon request before deletion.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>8. Limitation of Liability</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            To the maximum extent permitted by law, iin house shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the Platform. Our total liability shall not exceed
            the amount you paid us in the twelve months preceding the claim.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>9. Contact</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>
            For questions about these Terms, contact us at legal@iinhouse.com.
          </p>
        </section>
      </main>
      <LegalFooter />
    </div>
  );
}
