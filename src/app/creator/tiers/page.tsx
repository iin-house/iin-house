"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DEMO_TIERS = [
  { id: "1", name: "Starter", price: 149, currency: "INR", perks: "Early access to posts", active: true },
  { id: "2", name: "VIP", price: 299, currency: "INR", perks: "All posts + DMs", active: true },
  { id: "3", name: "Elite", price: 499, currency: "INR", perks: "Everything + monthly calls", active: false },
];

export default function TiersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tiers, setTiers] = useState(DEMO_TIERS);
  const [newTier, setNewTier] = useState({ name: "", price: "", perks: "", currency: "INR" });
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  const toggleActive = (id: string) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success("Tier updated");
  };

  const addTier = () => {
    if (!newTier.name || !newTier.price) return toast.error("Name and price required");
    setTiers([...tiers, { id: String(Date.now()), name: newTier.name, price: Number(newTier.price), currency: newTier.currency, perks: newTier.perks, active: true }]);
    setNewTier({ name: "", price: "", perks: "", currency: "INR" });
    setShowNew(false);
    toast.success("Tier created");
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Subscription Tiers</h1>
          <button onClick={() => setShowNew(!showNew)} className="btn btn-primary btn-sm">+ New tier</button>
        </div>

        {showNew && (
          <div className="card" style={{ padding: '16px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input className="input" placeholder="Tier name" value={newTier.name} onChange={e => setNewTier(f => ({ ...f, name: e.target.value }))} />
              <input className="input" placeholder="Price (₹)" type="number" value={newTier.price} onChange={e => setNewTier(f => ({ ...f, price: e.target.value }))} />
            </div>
            <input className="input" placeholder="Perks description" value={newTier.perks} onChange={e => setNewTier(f => ({ ...f, perks: e.target.value }))} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addTier} className="btn btn-primary btn-sm">Save tier</button>
              <button onClick={() => setShowNew(false)} className="btn btn-secondary btn-sm">Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tiers.map(t => (
            <div key={t.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{t.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{t.perks || "No perks"}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>₹{t.price}</span>
                <button onClick={() => toggleActive(t.id)} className={`badge ${t.active ? "badge-success" : "badge-muted"}`} style={{ cursor: 'pointer', border: 'none' }}>
                  {t.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
