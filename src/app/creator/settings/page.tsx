"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CreatorNav } from "@/components/CreatorNav";
import toast from "react-hot-toast";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const [deletionScheduledAt, setDeletionScheduledAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/account/deletion")
      .then(r => r.json())
      .then(data => {
        if (data.data?.deletionScheduledAt) {
          setDeletionScheduledAt(data.data.deletionScheduledAt);
        }
      })
      .catch(() => {});
  }, []);

  const handleRequestDeletion = async () => {
    const confirmed = confirm(
      "This will schedule your account for deletion in 30 days. You can cancel anytime before then. Are you sure?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account/deletion", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      setDeletionScheduledAt(data.deletionAt);
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/deletion", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message);
      setDeletionScheduledAt(null);
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/account/deletion");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Download as JSON
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iinhouse-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch (e: any) {
      toast.error(e.message ?? "Export failed");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px', paddingBottom: '60px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Account Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Manage your account and data</p>

        <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Data Export</h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.6 }}>
            Download a copy of all your personal data, subscriptions, and purchase history.
            This is your right under India&apos;s DPDP Act.
          </p>
          <button onClick={handleExportData} className="btn btn-secondary" style={{ fontSize: 13 }}>
            Export My Data
          </button>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: 16, borderColor: 'var(--danger)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--danger)' }}>Account Deletion</h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.6 }}>
            Deleting your account is irreversible. All your content, subscriptions, and data will be permanently removed after 30 days.
            During the grace period, you can cancel and restore your account.
          </p>

          {deletionScheduledAt ? (
            <div style={{
              padding: '14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: 12
            }}>
              <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Deletion scheduled</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Your account will be permanently deleted on {new Date(deletionScheduledAt).toLocaleDateString("en-IN", { dateStyle: "long" })}.
              </p>
            </div>
          ) : (
            <button onClick={handleRequestDeletion} className="btn" style={{ background: 'var(--danger)', color: 'white', fontSize: 13 }} disabled={loading}>
              {loading ? "Scheduling…" : "Schedule Account Deletion"}
            </button>
          )}

          {deletionScheduledAt && (
            <button onClick={handleCancelDeletion} className="btn btn-secondary" style={{ fontSize: 13, marginTop: 10 }} disabled={loading}>
              Cancel Deletion
            </button>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <a href="/legal/terms" style={{ color: 'var(--text-3)' }}>Terms of Service</a>
            <a href="/legal/privacy" style={{ color: 'var(--text-3)' }}>Privacy Policy</a>
            <a href="mailto:legal@iinhouse.com" style={{ color: 'var(--text-3)' }}>Contact Legal</a>
          </div>
        </div>
      </main>
    </div>
  );
}
