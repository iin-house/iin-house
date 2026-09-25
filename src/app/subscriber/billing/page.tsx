"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { Download, Filter, ExternalLink, RefreshCw } from "lucide-react";

type InvoiceEntry = {
  id: string;
  type: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  icon: string;
  detail: string;
};

type Totals = {
  totalSpent: number;
  activeSubs: number;
  ppvCount: number;
  totalPayouts: number;
  pendingPayouts: number;
};

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceEntry[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [filter, setFilter] = useState<"all" | "subscription" | "ppv">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/billing")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) { setInvoices(d.invoices); setTotals(d.totals); } setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.type === filter);

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '720px', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>Billing & Invoices</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Your complete transaction history</p>
          </div>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Download size={14} /> Export
          </button>
        </div>

        {/* Summary cards */}
        {totals && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }} className="stagger">
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Total spent</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>₹{totals.totalSpent.toLocaleString("en-IN")}</div>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>Active subs</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{totals.activeSubs}</div>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '8px' }}>PPV bought</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{totals.ppvCount}</div>
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {(["all", "subscription", "ppv"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} style={{ borderRadius: '20px', textTransform: 'capitalize' }}>
              {f === "ppv" ? "Purchases" : f}
            </button>
          ))}
        </div>

        {/* Invoice list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', marginBottom: '8px' }}>📄</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>No transactions yet</p>
              <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Your billing history will appear here.</p>
            </div>
          ) : (
            <div>
              {filtered.map(inv => (
                <div key={inv.id} className="list-row" style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--sep)' }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{inv.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{inv.detail} · {new Date(inv.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>₹{Number(inv.amount).toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: inv.status === "completed" || inv.status === "active" ? "var(--success)" : "var(--warning)", textTransform: 'capitalize' }}>{inv.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
