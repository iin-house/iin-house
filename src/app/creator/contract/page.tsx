"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContractPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  const onDrop = useCallback((accepted: File[]) => { if (accepted.length > 0) setFile(accepted[0]); }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }, maxFiles: 1 });

  const submit = async () => {
    if (!file) return toast.error("Upload a contract document");
    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await fetch("/api/contracts/upload", { method: "POST", body: formData });
      const data = await res.json();
      setUploading(false);
      if (data.ok) { setUploaded(true); toast.success("Contract submitted!"); }
      else toast.error(data.error || "Upload failed");
    } catch { setUploading(false); toast.error("Upload failed"); }
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />
      <main className="container" style={{ maxWidth: '640px', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Creator Contract</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Manage your agreement and revenue split</p>

        <div className="card" style={{ padding: '24px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Current Agreement</h3>
            <span className="badge badge-success">Active</span>
          </div>
          <div style={{ background: 'var(--surface-3)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '16px' }}>
            <strong style={{ color: 'var(--text)' }}>Standard Creator Agreement</strong><br />
            Revenue split: <strong style={{ color: 'var(--primary)' }}>80/20</strong> (Creator / Platform)<br />
            Term: Indefinite, 30 days notice for termination<br />
            Content ownership: Retained by creator<br />
            Platform license: Non-exclusive, worldwide
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Download PDF</button>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>View full terms</button>
          </div>
        </div>

        {uploaded ? (
          <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Contract submitted</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>We'll review and confirm within 2 business days.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Upload Custom Contract</h3>
            <div
              {...getRootProps()}
              style={{
                padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                background: 'var(--surface-3)', border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px', transition: 'all 0.2s ease'
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: file ? 'var(--text)' : 'var(--text-3)', marginBottom: '4px' }}>
                {file ? file.name : "Drop your contract PDF here or click to browse"}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-4)' }}>PDF, DOC, or DOCX</p>
            </div>
            {file && (
              <button onClick={submit} className="btn btn-primary" style={{ width: '100%', marginTop: '14px' }} disabled={uploading}>
                {uploading ? "Uploading…" : "Submit contract"}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
