export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-dark-300">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <p className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">iin house</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-dark-500">Last updated: September 2026</p>
        <section className="mt-8 space-y-4 text-dark-100 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">1. Data We Collect</h2>
          <p>We collect account information (email, phone, display name), content metadata, payment records, and usage analytics necessary to operate the platform.</p>
          <h2 className="text-xl font-semibold text-white">2. KYC & Identity Documents</h2>
          <p>Identity documents collected during KYC are encrypted at rest, stored separately from operational data, and accessed only by authorized personnel for verification purposes.</p>
          <h2 className="text-xl font-semibold text-white">3. Content Protection</h2>
          <p>We implement watermarking and signed URLs to protect creator content. These technical measures do not constitute personal data collection beyond what is necessary for access control.</p>
          <h2 className="text-xl font-semibold text-white">4. Data Retention</h2>
          <p>Account data is retained for the duration of the account plus a defined period post-termination as required by law. Audit logs are retained for 7 years.</p>
          <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting privacy@iinhouse.com. KYC documents may be retained as required by regulatory obligations.</p>
          <h2 className="text-xl font-semibold text-white">6. Contact</h2>
          <p>For privacy-related inquiries, contact privacy@iinhouse.com or the grievance officer listed at /contact.</p>
        </section>
      </main>
    </div>
  );
}
