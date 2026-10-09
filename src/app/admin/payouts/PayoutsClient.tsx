"use client";

import { useState } from "react";

export function PayoutsClient({ payouts }: { payouts: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const submit = async (id: string, action: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "COMPLETED" : "REJECTED" }),
      });
      if (res.ok) window.location.reload();
      else alert("Action failed");
    } catch {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {payouts.map((p: any) => (
        <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{p.creatorName}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              ₹{p.amount.toLocaleString()} — {new Date(p.requestedAt).toLocaleDateString()}
            </div>
          </div>
          <span className={`badge ${p.status === "PENDING" ? "badge-secondary" : p.status === "COMPLETED" ? "badge-primary" : "badge-secondary"}`}>
            {p.status}
          </span>
          {p.status === "PENDING" && (
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-primary btn-sm" disabled={loading === p.id} onClick={() => submit(p.id, "approve")}>
                {loading === p.id ? "…" : "Approve"}
              </button>
              <button className="btn btn-secondary btn-sm" style={{ color: "var(--danger)" }} disabled={loading === p.id} onClick={() => submit(p.id, "reject")}>
                {loading === p.id ? "…" : "Reject"}
              </button>
            </div>
          )}
        </div>
      ))}
      {payouts.length === 0 && <p style={{ color: "var(--text-3)" }}>No payouts yet</p>}
    </div>
  );
}
