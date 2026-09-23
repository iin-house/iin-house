"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { CreatorNav } from "@/components/CreatorNav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Upload, FileText, Shield, CheckCircle2, XCircle, Clock } from "lucide-react";

type DocStatus = "PENDING" | "APPROVED" | "REJECTED";

type KycDocument = {
  id: string;
  documentType: string;
  documentUrl: string;
  status: DocStatus;
  notes?: string;
  reviewedAt?: string;
  createdAt: string;
};

const documentTypes = ["passport", "drivers_license", "national_id"] as const;

const docTypeLabels: Record<string, string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID Card",
};

const statusConfig: Record<DocStatus, { icon: typeof Shield; color: string; bg: string }> = {
  PENDING:  { icon: Clock,       color: "var(--warning)",       bg: "rgba(251,191,36,0.08)" },
  APPROVED: { icon: CheckCircle2, color: "var(--success)",       bg: "rgba(34,197,94,0.08)" },
  REJECTED: { icon: XCircle,     color: "var(--danger)",        bg: "rgba(239,68,68,0.08)" },
};

export default function CreatorKycPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<KycDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<string>("passport");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/kyc/upload", { cache: "no-store" })
      .then(r => r.ok ? r.json() : { documents: [] })
      .then(d => {
        if (d.documents) setDocuments(d.documents);
        else if (d.error) toast.error(d.error);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return toast.error("Select a document to upload");
    setUploading(true);

    try {
      // 1. Upload the file
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
      const uploadData = await uploadRes.json();

      if (!uploadData.ok) throw new Error(uploadData.error || "File upload failed");

      // 2. Create KYC record
      const kycRes = await fetch("/api/kyc/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentUrl: uploadData.url,
          documentType: docType,
        }),
      });
      const kycData = await kycRes.json();

      if (!kycRes.ok) throw new Error(kycData.error || "KYC submission failed");

      toast.success("Document submitted for verification");
      setFile(null);
      setDocType("passport");

      // Refresh documents list
      const refreshRes = await fetch("/api/kyc/upload", { cache: "no-store" });
      const refreshData = await refreshRes.json();
      if (refreshData.documents) setDocuments(refreshData.documents);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getLatestByType = (type: string) =>
    documents.filter(d => d.documentType === type).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  if (status === "loading") return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: 'var(--text-3)' }}>Loading…</p></div>;
  if (!session) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CreatorNav />

      <main className="container" style={{ maxWidth: '680px', padding: '28px 20px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>Identity Verification</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
            Upload a government-issued ID to verify your identity and unlock all creator features
          </p>
        </div>

        {/* Security notice */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          padding: '14px 16px', borderRadius: '14px',
          background: 'rgba(59,130,246,0.06)',
          border: '0.5px solid rgba(59,130,246,0.15)',
          marginBottom: '24px',
        }}>
          <Shield size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            Your documents are encrypted at rest and used only for identity verification.
            They are never shared with third parties. Verification typically takes 1–2 business days.
          </p>
        </div>

        {/* Upload form */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Upload Document</h2>

          {/* Document type selector */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>
              Document type
            </label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            >
              {documentTypes.map(dt => (
                <option key={dt} value={dt}>{docTypeLabels[dt]}</option>
              ))}
            </select>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
              background: 'var(--surface-2)',
              border: '2px dashed rgba(255,255,255,0.15)',
              borderRadius: '16px', marginBottom: '14px',
              transition: 'all 0.2s ease',
            }}
          >
            <input {...getInputProps()} />
            <Upload size={28} style={{ color: 'var(--text-3)', marginBottom: '8px' }} />
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: file ? 'var(--text)' : 'var(--text-3)' }}>
              {isDragActive ? "Drop file here…" : file ? file.name : "Drop your document or click to browse"}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-4)' }}>
              Clear photo or PDF — JPG, PNG, or PDF up to 10 MB
            </p>
          </div>

          {file && (
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Submit for verification"}
            </button>
          )}
        </div>

        {/* Submitted documents */}
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Your Documents</h2>

          {loading ? (
            <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading…</p>
          ) : documents.length === 0 ? (
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <FileText size={28} style={{ color: 'var(--text-4)', marginBottom: '8px' }} />
              <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
                No documents submitted yet. Upload one above to get started.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {documents.map(doc => {
                const StatusIcon = statusConfig[doc.status]?.icon ?? Clock;
                return (
                  <div
                    key={doc.id}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: statusConfig[doc.status]?.bg ?? 'var(--surface-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <StatusIcon size={18} style={{ color: statusConfig[doc.status]?.color ?? 'var(--text-3)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>
                        {docTypeLabels[doc.documentType] ?? doc.documentType}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
                        Submitted {new Date(doc.createdAt).toLocaleDateString()}
                        {doc.reviewedAt && <> — reviewed {new Date(doc.reviewedAt).toLocaleDateString()}</>}
                      </div>
                      {doc.notes && (
                        <div style={{
                          fontSize: '12px', color: 'var(--text-2)', marginTop: '4px',
                          padding: '6px 10px', borderRadius: '8px', background: 'var(--surface-3)',
                          fontStyle: 'italic',
                        }}>
                          {doc.notes}
                        </div>
                      )}
                    </div>
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gradient-text"
                      style={{ fontSize: '12px', fontWeight: 500, flexShrink: 0 }}
                    >
                      View
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

