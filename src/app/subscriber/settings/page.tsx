"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (!session?.user) return;
    setDisplayName((session.user as any).name || "");
    setBio((session.user as any).bio || "");
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '520px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Profile Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Manage your account information</p>

        <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Display name</label>
              <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Bio</label>
              <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell creators a bit about yourself…" />
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
