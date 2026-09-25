"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreatorNav } from "@/components/CreatorNav";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, Eye, Lock, Calendar, MoreVertical } from "lucide-react";

type Post = {
  id: string;
  type: string;
  caption: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  isPPV: boolean;
  ppvPrice: number | null;
  visibility: string;
  scheduledAt: string | null;
  publishedAt: string | null;
  views: number;
  createdAt: string;
};

export default function ContentManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ caption: "", visibility: "PUBLIC", isPPV: false, ppvPrice: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/creator/content")
        .then(r => r.ok ? r.json() : { posts: [] })
        .then(d => { setPosts(d.posts ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const handleEdit = (post: Post) => {
    setEditing(post);
    setForm({
      caption: post.caption || "",
      visibility: post.visibility,
      isPPV: post.isPPV,
      ppvPrice: post.ppvPrice ? String(post.ppvPrice) : "",
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: form.caption,
          visibility: form.visibility,
          isPPV: form.isPPV,
          ppvPrice: form.isPPV ? Number(form.ppvPrice) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setPosts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, ppvPrice: form.isPPV ? Number(form.ppvPrice) : null } : p));
      toast.success("Post updated");
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.success("Post deleted");
  };

  if (status === "loading" || loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '720px', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: '2px' }}>My Content</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Manage, edit, and delete your posts</p>
          </div>
          <Link href="/creator/upload" className="btn btn-primary btn-sm">
            <Plus size={14} /> New post
          </Link>
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--primary)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Edit post</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px', display: 'block' }}>Caption</label>
                <textarea className="input" rows={3} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px', display: 'block' }}>Visibility</label>
                <select value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))} className="input">
                  <option value="PUBLIC">Public</option>
                  <option value="SUBSCRIBERS">Subscribers only</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                <div className={`toggle ${form.isPPV ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, isPPV: !f.isPPV }))} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Pay-per-view</span>
              </div>
              {form.isPPV && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px', display: 'block' }}>Price (₹)</label>
                  <input type="number" className="input" value={form.ppvPrice} onChange={e => setForm(f => ({ ...f, ppvPrice: e.target.value }))} placeholder="99" min="1" />
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
                <button onClick={() => setEditing(null)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📝</div>
            <p style={{ fontSize: '14px', fontWeight: 500 }}>No posts yet</p>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '6px' }}>Upload your first content to get started.</p>
            <Link href="/creator/upload" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Upload</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts.map(post => (
              <div key={post.id} className="card" style={{ padding: '16px 20px', display: 'flex', gap: '14px' }}>
                {post.thumbnailUrl || post.mediaUrl ? (
                  <div style={{
                    width: 72, height: 72, borderRadius: '12px', flexShrink: 0,
                    background: `url(${post.thumbnailUrl || post.mediaUrl}) center/cover`,
                  }} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: '12px', flexShrink: 0, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {post.type === 'VIDEO' ? '🎬' : post.type === 'AUDIO' ? '🎵' : post.type === 'PHOTO' ? '📷' : '📝'}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                    {post.caption?.slice(0, 60) || "No caption"}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '10px' }}>{post.type}</span>
                    <span className={`badge ${post.visibility === "PUBLIC" ? "badge-success" : "badge-warning"}`} style={{ fontSize: '10px' }}>{post.visibility}</span>
                    {post.isPPV && <span className="badge badge-primary" style={{ fontSize: '10px' }}>₹{Number(post.ppvPrice)}</span>}
                    {post.scheduledAt && <span className="badge badge-muted" style={{ fontSize: '10px' }}><Calendar size={10} /> Scheduled</span>}
                    {!post.publishedAt && !post.scheduledAt && <span className="badge badge-muted" style={{ fontSize: '10px' }}>Draft</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '6px', display: 'flex', gap: '12px' }}>
                    {post.publishedAt && <span><Eye size={10} style={{ display: 'inline', marginRight: '2px' }} />{post.views.toLocaleString()} views</span>}
                    <span>{new Date(post.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(post)} className="btn btn-ghost btn-sm" title="Edit"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(post.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
