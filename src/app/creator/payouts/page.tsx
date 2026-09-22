"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; requested: string; amount: number; status: string; method: string }>>([]);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  const handleRequest = async () => {
    if (!amount || Number(amount) < 1000) return toast.error("Minimum payout is ₹1,000");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Payout request submitted!");
    setLoading(false); setAmount("");
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '800px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Payouts</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Request and track your payouts</p>

        <div className="card" style={{ padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Available balance</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>₹24,500</div>
            </div>
            <button onClick={() => { }} className="btn btn-primary btn-sm">Request payout</button>
          </div>
          <div style={{ background: 'var(--surface-3)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Bank account ending 4029</span>
            <span className="badge badge-success">✓ Verified</span>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--sep)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Payout History</h3>
          </div>
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
              {history.map(h => (
                <tr key={h.id} style={{ borderBottom: '0.5px solid var(--sep)' }}>
                  <td style={{ padding: '12px 20px', fontSize: '13px' }}>{h.requested}</td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600 }}>{Number(h.amount)}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span className={`badge ${h.status === "COMPLETED" ? "badge-success" : "badge-danger"}`}>{h.status}</span>
                  </td>
                  <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text-3)' }}>{h.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
