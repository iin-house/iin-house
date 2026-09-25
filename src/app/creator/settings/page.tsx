"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import toast from "react-hot-toast";
import { Settings as SettingsIcon, Key } from "lucide-react";

export default function CreatorSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ displayName: "", bio: "", category: "", revenueSplit: 80 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (!session?.user) return;
    const profile = (session.user as any).creatorProfile;
    if (profile) {
      setForm({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        category: profile.category || "",
        revenueSplit: Number(profile.revenueSplitPct) || 80,
      });
    }
  }, [status, session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/creator/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          bio: form.bio,
          category: form.category,
          revenueSplitPct: form.revenueSplit,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '520px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Creator Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Manage your profile and preferences</p>

        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Display name</label>
              <input className="input" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your display name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Bio</label>
              <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell subscribers about yourself…" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
                <option value="">Select category</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="Fitness">Fitness</option>
                <option value="Tech">Tech</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Photography">Photography</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Revenue split ({form.revenueSplit}% to you)</label>
              <input type="range" min="50" max="95" value={form.revenueSplit} onChange={e => setForm(f => ({ ...f, revenueSplit: Number(e.target.value) }))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
                <span>50%</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{form.revenueSplit}%</span>
                <span>95%</span>
              </div>
            </div>
            <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ marginTop: '4px' }}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Account info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Email</span>
              <span style={{ fontWeight: 500 }}>{(session.user as any).email || "—"}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Role</span>
              <span className="badge badge-primary">{(session.user as any).role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Member since</span>
              <span>{new Date((session.user as any).createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
