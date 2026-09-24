"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Tier = {
  id: string;
  name: string;
  price: number;
  currency: string;
  perksDescription: string | null;
  active: boolean;
  createdAt: string;
};

export default function TiersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTier, setNewTier] = useState({ name: "", price: "", perks: "", currency: "INR" });
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    fetch("/api/tiers")
      .then(r => r.ok ? r.json() : [])
      .then((data: Tier[]) => { setTiers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status, router]);

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/tiers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      if (!res.ok) throw new Error("Failed to update tier");
      setTiers(tiers.map(t => t.id === id ? { ...t, active: !active } : t));
      toast.success("Tier updated");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  const deleteTier = async (id: string) => {
    if (!confirm("Delete this tier? Subscribers on it will be affected.")) return;
    try {
      const res = await fetch(`/api/tiers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tier");
      setTiers(tiers.filter(t => t.id !== id));
      toast.success("Tier deleted");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    }
  };

  const addTier = async () => {
    setSaving(true);
    try {
      const price = Number(newTier.price);
      const res = await fetch("/api/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTier.name,
          price: isNaN(price) ? 0 : price,
          currency: newTier.currency,
          perksDescription: newTier.perks || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setTiers([...tiers, data]);
      setNewTier({ name: "", price: "", perks: "", currency: "INR" });
      setShowNew(false);
      setErrors({});
      toast.success("Tier created");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Subscription Tiers</h1>
          <button onClick={() => setShowNew(!showNew)} className="btn btn-primary btn-sm" disabled={saving}>
            {showNew ? "Cancel" : "+ New tier"}
          </button>
        </div>

        {showNew && (
          <div className="card" style={{ padding: '16px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <input className="input" placeholder="Tier name" value={newTier.name} onChange={e => setNewTier(f => ({ ...f, name: e.target.value }))} />
                {errors.name && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div>
                <input className="input" placeholder="Price (₹)" type="number" value={newTier.price} onChange={e => setNewTier(f => ({ ...f, price: e.target.value }))} />
                {errors.price && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: 4 }}>{errors.price}</p>}
              </div>
            </div>
            <input className="input" placeholder="Perks description" value={newTier.perks} onChange={e => setNewTier(f => ({ ...f, perks: e.target.value }))} />
            {errors.description && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: 4 }}>{errors.description}</p>}
            <button onClick={addTier} className="btn btn-primary btn-sm" disabled={saving || !newTier.name || !newTier.price}>
              {saving ? "Saving…" : "Save tier"}
            </button>
          </div>
        )}

        {tiers.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>📊</p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>No tiers yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Create your first subscription tier to start earning.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tiers.map(t => (
              <div key={t.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{t.name}</p>
                    <span className={`badge ${t.active ? "badge-success" : "badge-muted"}`} style={{ fontSize: 10 }}>
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>{t.perksDescription || "No perks"}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: 4 }}>
                    Created {new Date(t.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>₹{Number(t.price).toLocaleString()}</span>
                  <button onClick={() => toggleActive(t.id, t.active)} className="badge badge-secondary" style={{ cursor: 'pointer', border: 'none', fontSize: 11 }}>
                    {t.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => deleteTier(t.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 18, padding: 4 }} title="Delete">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
