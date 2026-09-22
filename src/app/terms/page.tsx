export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-dark-300">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <p className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">iin house</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 prose prose-invert">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-dark-500">Last updated: September 2026</p>
        <section className="mt-8 space-y-4 text-dark-100 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using iin house, you agree to be bound by these Terms. If you do not agree, do not use the platform.</p>
          <h2 className="text-xl font-semibold text-white">2. Eligibility</h2>
          <p>You must be at least 18 years old to create an account or access content. By registering, you confirm you meet this requirement.</p>
          <h2 className="text-xl font-semibold text-white">3. Creator Obligations</h2>
          <p>Creators are responsible for the content they publish, ensuring they hold all necessary rights and that content complies with applicable laws and platform policies.</p>
          <h2 className="text-xl font-semibold text-white">4. Content Ownership</h2>
          <p>Creators retain ownership of their content. By posting, you grant iin house a limited license to host, display, and distribute content to subscribers.</p>
          <h2 className="text-xl font-semibold text-white">5. Prohibited Content</h2>
          <p>Content that violates law, infringes rights, or breaches platform guidelines may be removed. Repeat violations may result in account suspension.</p>
          <h2 className="text-xl font-semibold text-white">6. Subscriptions & Refunds</h2>
          <p>Subscriptions renew automatically. Refunds are handled on a case-by-case basis. Contact support for billing disputes.</p>
          <h2 className="text-xl font-semibold text-white">7. Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms, without prior notice.</p>
        </section>
      </main>
    </div>
  );
}
