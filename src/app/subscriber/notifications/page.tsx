"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SubscriberNav } from "@/components/SubscriberNav";
import toast from "react-hot-toast";
import { Bell, Check, Trash2 } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const TYPE_ICONS: Record<string, string> = {
  "subscription": "🔄",
  "message": "💬",
  "post": "📝",
  "ppv": "🔓",
  "payout": "💰",
  "kyc": "✓",
  "system": "ℹ️",
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/notifications")
        .then(r => r.ok ? r.json() : { notifications: [] })
        .then(d => { setNotifications(d.notifications ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const markRead = async (id: string, currentRead: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id, read: !currentRead }),
    });
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "PATCH" });
    toast.success("All marked as read");
  };

  const deleteAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    setNotifications([]);
    await fetch("/api/notifications", { method: "DELETE" });
    toast.success("All notifications cleared");
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) await markRead(n.id, false);
    if (n.link) router.push(n.link);
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SubscriberNav />
      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>
              Notifications {unread > 0 && <span className="badge badge-primary">{unread}</span>}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Stay updated on activity that matters</p>
          </div>
          {notifications.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={markAllRead} className="btn btn-secondary btn-sm">
                <Check size={14} /> Mark all read
              </button>
              <button onClick={deleteAll} className="btn btn-ghost btn-sm">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <Bell size={48} style={{ color: 'var(--text-4)', marginBottom: '12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 500 }}>No notifications yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>We'll let you know when something interesting happens.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => (
              <button key={n.id} onClick={() => handleClick(n)} className="card" style={{
                padding: '14px 18px',
                cursor: n.link ? 'pointer' : 'default',
                textAlign: 'left',
                width: '100%',
                border: n.read ? '0.5px solid var(--sep)' : '1px solid var(--primary)',
                background: n.read ? 'var(--surface-2)' : 'var(--accent-soft)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ fontSize: 24, flexShrink: 0, marginTop: '2px' }}>{TYPE_ICONS[n.type] ?? "ℹ️"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{n.title}</div>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginLeft: '8px' }} />}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '4px', lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
