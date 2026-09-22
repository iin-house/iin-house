"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<"PHOTO" | "VIDEO" | "AUDIO" | "TEXT">("PHOTO");
  const [caption, setCaption] = useState("");
  const [isPPV, setIsPPV] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const onDrop = useCallback((accepted: File[]) => setFiles(accepted), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [], "video/*": [], "audio/*": [], "text/plain": [] }, maxFiles: 5 });

  const handleSubmit = async () => {
    if (files.length === 0) return toast.error("Select at least one file");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("contentType", type.toLowerCase());

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.ok) throw new Error(data.error);

      const postRes = await fetch("/api/content/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          mediaUrl: data.url,
          caption,
          isPPV,
          ppvPrice: isPPV ? Number(ppvPrice) : null,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });

      if (postRes.ok) {
        toast.success(scheduledAt ? "Post scheduled!" : "Published!");
        setFiles([]); setCaption(""); setIsPPV(false); setPpvPrice(""); setScheduledAt("");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Upload Content</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Share photos, videos, audio, or text with your subscribers</p>
        </div>

        <div
          {...getRootProps()}
          style={{
            padding: '40px 24px', textAlign: 'center' as const,
            background: 'var(--surface-2)',
            border: '2px dashed rgba(255,255,255,0.15)',
            borderRadius: '16px', cursor: 'pointer', marginBottom: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📤</div>
          <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: 'var(--text)' }}>
            {isDragActive ? "Drop files here…" : "Drop files here or click to browse"}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {files.length > 0 ? `${files.length} file(s) selected` : "Photos, videos, audio, or documents — watermarked automatically"}
          </p>
        </div>

        {files.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {files.map(f => (
              <span key={f.name} style={{
                fontSize: '12px', padding: '6px 12px',
                background: 'var(--surface-3)', borderRadius: '10px'
              }}>{f.name}</span>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Content type</label>
            <select value={type} onChange={e => setType(e.target.value as any)} className="input">
              <option value="PHOTO">📷 Photo</option>
              <option value="VIDEO">🎬 Video</option>
              <option value="AUDIO">🎵 Audio</option>
              <option value="TEXT">📝 Text</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Caption</label>
            <textarea className="input" rows={3} style={{ resize: 'vertical' }} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tell your subscribers what this is about…" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
            <div className={`toggle ${isPPV ? 'active' : ''}`} onClick={() => setIsPPV(!isPPV)} style={{ cursor: 'pointer' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Pay-per-view content</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Subscribers pay to unlock this post</div>
            </div>
          </div>

          {isPPV && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>PPV price (₹)</label>
              <input type="number" className="input" value={ppvPrice} onChange={e => setPpvPrice(e.target.value)} placeholder="99" min="1" />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Schedule (optional)</label>
            <input type="datetime-local" className="input" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          </div>

          <button onClick={handleSubmit} className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} disabled={uploading}>
            {uploading ? "Processing…" : scheduledAt ? "Schedule post" : "Publish now"}
          </button>
        </div>
      </main>
    </div>
  );
}
