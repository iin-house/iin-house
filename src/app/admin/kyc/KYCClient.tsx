"use client";

import { useState } from "react";

export function KYCClient({ pending, reviewed }: { pending: any[]; reviewed: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const submit = async (id: string, action: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/kyc/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Action failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
        {pending.map((item: any) => (
          <div key={item.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.userLabel}</span>
                <span className="badge badge-secondary" style={{ fontSize: 11 }}>{item.docLabel}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>Submitted {new Date(item.createdAt).toLocaleDateString()}</div>
              <a href={item.documentUrl} target="_blank" rel="noopener noreferrer" className="gradient-text" style={{ fontSize: 12, display: "inline-block", marginTop: 4 }}>
                View document →
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="btn btn-primary btn-sm" disabled={loading === item.id} onClick={() => submit(item.id, "approve")}>
                {loading === item.id ? "…" : "Approve"}
              </button>
              <button className="btn btn-secondary btn-sm" style={{ color: "var(--danger)" }} disabled={loading === item.id} onClick={() => submit(item.id, "reject")}>
                {loading === item.id ? "…" : "Reject"}
              </button>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <p style={{ color: "var(--text-3)", fontSize: 13 }}>No pending verifications</p>
        )}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Reviewed</h2>
      <div style={{ display: "grid", gap: 8 }}>
        {reviewed.map((item: any) => (
          <div key={item.id} style={{ padding: "12px 16px", background: "var(--surface-2)", borderRadius: 12, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{item.userLabel}</span>
            <span className="badge badge-secondary" style={{ marginLeft: 8, fontSize: 11 }}>{item.docLabel}</span>
            <span className={`badge ${item.status === "APPROVED" ? "badge-primary" : "badge-secondary"}`} style={{ marginLeft: 6 }}>
              {item.status}
            </span>
            <span style={{ color: "var(--text-3)", marginLeft: 8 }}>
              {item.reviewedAt ? new Date(item.reviewedAt).toLocaleDateString() : "—"}
            </span>
            {item.notes && (
              <span style={{ color: "var(--text-3)", marginLeft: 8, fontStyle: "italic" }}>
                — {item.notes}
              </span>
            )}
          </div>
        ))}
        {reviewed.length === 0 && (
          <p style={{ color: "var(--text-3)" }}>No reviewed documents yet</p>
        )}
      </div>
    </div>
  );
}
