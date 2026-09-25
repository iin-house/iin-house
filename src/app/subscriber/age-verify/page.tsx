"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Lock, FileText } from "lucide-react";

export default function AgeVerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"idle" | "pending" | "approved" | "rejected">("idle");

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status]);

  const onDrop = useCallback((accepted: File[]) => { if (accepted.length > 0) setFile(accepted[0]); }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [], "application/pdf": [".pdf"] }, maxFiles: 1 });

  const submit = async () => {
    if (!file) return toast.error("Upload an ID document");
    setSubmitting(true);
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await fetch("/api/kyc/upload", { method: "POST", body: formData });
      const data = await res.json();
      setSubmitting(false);
      if (data.ok) { toast.success("Document uploaded for review"); setReviewStatus("pending"); }
      else toast.error(data.error || "Upload failed");
    } catch { setSubmitting(false); toast.error("Upload failed"); }
  };

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="glass-header">
        <div className="header-inner">
          <Link href="/feed" style={{ fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none' }}>← Back</Link>
          <span className="gradient-text font-bold text-base">iin house</span>
          <div style={{ width: '40px' }} />
        </div>
      </header>

      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '28px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Age Verification</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>Upload a government-issued ID to verify your age</p>

        {reviewStatus === "pending" ? (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--warning)' }}>
              <FileText size={28} />
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>Under review</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto' }}>We'll notify you once your document is verified. This usually takes 1–2 business days.</p>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              style={{
                padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                background: 'var(--surface-2)', border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px', marginBottom: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🪪</div>
              <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: file ? 'var(--text)' : 'var(--text-3)' }}>
                {file ? file.name : "Drag & drop or tap to upload"}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-4)' }}>Aadhaar, PAN, Passport, or Driver's License</p>
            </div>

            <div style={{ padding: '14px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', border: '0.5px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.04)', marginBottom: '16px' }}>
              <Lock size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                Your document is encrypted and stored securely. Used only for age verification.
              </p>
            </div>

            {file && (
              <button onClick={submit} className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? "Uploading…" : "Submit for verification"}
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
