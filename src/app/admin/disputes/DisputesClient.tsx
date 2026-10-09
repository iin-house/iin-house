"use client";

import { useState } from "react";

export function DisputesClient({ disputes }: { disputes: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const resolve = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/disputes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve", resolution: "Resolved by admin" }),
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
      {disputes.map((d: any) => (
        <div key={d.id} className="card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{d.type}: {d.description.slice(0, 100)}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                {d.userId} — {new Date(d.createdAt).toLocaleDateString()}
              </div>
              {d.resolution && (
                <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4, padding: "8px 12px", background: "var(--surface-3)", borderRadius: 8 }}>
                  Resolution: {d.resolution}
                </div>
              )}
            </div>
            <span className={`badge ${d.status === "OPEN" ? "badge-secondary" : "badge-primary"}`}>
              {d.status}
            </span>
          </div>
          {d.status === "OPEN" && (
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary btn-sm" disabled={loading === d.id} onClick={() => resolve(d.id)}>
                {loading === d.id ? "…" : "Resolve"}
              </button>
            </div>
          )}
        </div>
      ))}
      {disputes.length === 0 && <p style={{ color: "var(--text-3)" }}>No disputes</p>}
    </div>
  );
}
