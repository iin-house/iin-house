"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Dispute = { id: string; type: string; description: string; status: string; createdAt: string; resolution?: string };

export default function DisputesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "billing", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  const submit = async () => {
    if (!form.description.trim()) return toast.error("Describe your issue");
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Dispute submitted — we'll review within 48 hours");
    setShowForm(false);
    setForm({ type: "billing", description: "" });
    setSubmitting(false);
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  const history: Dispute[] = [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <a href="/feed" style={{ fontSize: '13px', color: 'var(--text-3)' }}>← Back</a>
          <span className="gradient-text font-bold text-base">iin house</span>
          <div style={{ width: '40px' }} />
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Disputes & Billing</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Report chargebacks, billing errors, or content disputes</p>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }}>+ New Dispute</button>
        )}

        {showForm && (
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Type</label>
                <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="billing">Billing error</option>
                  <option value="chargeback">Chargeback</option>
                  <option value="content">Content dispute</option>
                  <option value="subscription">Subscription issue</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Description</label>
                <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail…" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={submit} className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? "Submitting…" : "Submit dispute"}</button>
                <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>No disputes yet. If you have an issue, tap "New Dispute" above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map(d => (
              <div key={d.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{d.type}</span>
                  <span className="badge badge-info">{d.status}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>{d.description}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '8px', display: 'block' }}>Submitted {d.createdAt}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
