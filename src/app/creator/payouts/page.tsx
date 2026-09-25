"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";

type Payout = {
  id: string;
  amount: number | string;
  status: string;
  method?: string;
  requested?: string;
  requestedAt?: string;
  createdAt?: string;
};

type Stats = {
  pendingPayout?: number;
  totalPayouts?: number;
};

export default function PayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<Payout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/creator/stats");
      const ok = res.ok;
      const data = ok ? await res.json() : null;
      setStats(data ?? {});
    } catch {
      setStats({});
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/payouts");
      if (!res.ok) {
        setHistory([]);
        return;
      }
      const data = await res.json();
      setHistory(data.payouts ?? []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([loadStats(), loadHistory()]).finally(() => setLoading(false));
  }, [status, loadStats, loadHistory]);

  const handleRequest = async () => {
    const value = Number(amount);
    if (!value || value < 1000) {
      toast.error("Minimum payout is ₹1,000");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to request payout");
      }
      toast.success("Payout request submitted!");
      setAmount("");
      setShowForm(false);
      await loadHistory();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to request payout");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--text-3)' }}>Loading…</p>
    </div>
  );

  if (!session) return null;

  const balance = stats?.pendingPayout ?? 0;
  const total = stats?.totalPayouts ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '800px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Payouts</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Request and track your payouts</p>

        {/* Balance card */}
        <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Available balance</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>₹{Number(balance).toLocaleString('en-IN')}</div>
              {total > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
                  Total paid out: ₹{Number(total).toLocaleString('en-IN')}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowForm(s => !s)}
              className="btn btn-primary btn-sm"
              disabled={Number(balance) < 1000}
            >
              {showForm ? "Cancel" : "Request payout"}
            </button>
          </div>
          <div style={{ background: 'var(--surface-3)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>UPI verified</span>
            <span className="badge badge-success">✓ Verified</span>
          </div>

          {/* Inline form */}
          {showForm && (
            <div style={{ marginTop: '16px', borderTop: '0.5px solid var(--sep)', paddingTop: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Amount (₹)</span>
                  <input
                    type="number"
                    className="input"
                    placeholder="Min 1000"
                    min={1000}
                    max={Number(balance)}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ padding: '8px 12px' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Method</span>
                  <select
                    className="input"
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                    style={{ padding: '8px 12px' }}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank transfer">Bank transfer</option>
                  </select>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleRequest} className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? "Submitting…" : `Request ₹${amount || 0}`}
                </button>
                <button onClick={() => setShowForm(false)} className="btn btn-secondary btn-sm" disabled={submitting}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--sep)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Payout History</h3>
          </div>
          {history.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>💸</div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>No payouts yet</p>
              <p style={{ fontSize: '12px', marginTop: 4 }}>Your payout history will appear here.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid var(--sep)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', fontWeight: 600 }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', fontWeight: 600 }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', fontWeight: 600 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', fontWeight: 600 }}>Method</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => {
                  const date = (h as any).requested ?? ((h as any).requestedAt ? new Date((h as any).requestedAt).toLocaleDateString('en-IN') : (h as any).createdAt ? new Date((h as any).createdAt).toLocaleDateString('en-IN') : '');
                  return (
                    <tr key={h.id} style={{ borderBottom: '0.5px solid var(--sep)' }}>
                      <td style={{ padding: '12px 20px', fontSize: '13px' }}>{date}</td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600 }}>₹{Number(h.amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span className={`badge ${h.status === "COMPLETED" ? "badge-success" : h.status === "FAILED" ? "badge-danger" : "badge-primary"}`}>{h.status}</span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text-3)' }}>{h.method ?? 'UPI'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
