"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import toast from "react-hot-toast";

type Profile = {
  id: string;
  displayName: string;
  bio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  gstin: string | null;
  verificationStatus: string;
};

export default function CreatorProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ displayName: "", bio: "", profileImageUrl: "", coverImageUrl: "", gstin: "" });

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    fetch("/api/creator/profile")
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setProfile(data);
          setForm({
            displayName: data.displayName,
            bio: data.bio || "",
            profileImageUrl: data.profileImageUrl || "",
            coverImageUrl: data.coverImageUrl || "",
            gstin: data.gstin || "",
          });
        }
      })
      .catch(() => {});
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/creator/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.issues?.map((i: any) => i.message).join(", "));

      setProfile(data);
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !profile) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px', paddingBottom: '60px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Edit Profile</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>This is how subscribers see your public profile</p>

        {/* Preview */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 120, background: form.coverImageUrl ? `url(${form.coverImageUrl}) center/cover` : 'linear-gradient(135deg, #9d174d, #be185d)', borderRadius: 16, marginBottom: -30 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingLeft: 4 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: form.profileImageUrl ? `url(${form.profileImageUrl}) center/cover` : 'var(--surface-3)',
              border: '3px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0, color: 'var(--text-3)',
            }}>
              {!form.profileImageUrl && form.displayName[0]?.toUpperCase()}
            </div>
            <div style={{ paddingBottom: 6, flex: 1 }}>
              <p style={{ fontSize: 18, fontWeight: 700 }}>{form.displayName || "Your name"}</p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{form.bio?.slice(0, 60) || "Add a bio…"}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 6 }}>Display name</label>
            <input className="input" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your name" maxLength={80} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 6 }}>Bio</label>
            <textarea className="input" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell subscribers about yourself…" maxLength={500} style={{ resize: 'vertical' }} />
            <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: 4 }}>{form.bio.length}/500</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 6 }}>Profile image URL</label>
            <input className="input" value={form.profileImageUrl} onChange={e => setForm(f => ({ ...f, profileImageUrl: e.target.value }))} placeholder="https://…" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 6 }}>Cover image URL</label>
            <input className="input" value={form.coverImageUrl} onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))} placeholder="https://…" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 6 }}>
              GSTIN <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>(for tax compliance — leave blank if not registered)</span>
            </label>
            <input className="input" value={form.gstin} onChange={e => setForm(f => ({ ...f, gstin: e.target.value.toUpperCase() }))} placeholder="27AAAAA0000A1Z5" maxLength={15} style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
            <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: 4 }}>15-character alphanumeric format. Required if your turnover exceeds the GST threshold.</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button onClick={() => router.back()} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </main>
    </div>
  );
}
