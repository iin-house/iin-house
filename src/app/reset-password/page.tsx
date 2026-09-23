"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../forgot-password/actions";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.set("token", token);
    fd.set("password", password);
    const result = await resetPassword(fd);
    setLoading(false);
    if (result.error) setState({ error: result.error });
    else setState({ success: true });
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '380px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Invalid link</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>This reset link is missing. Request a new one.</p>
          <Link href="/forgot-password" className="btn btn-primary">Request reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>iin house</Link>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Set a new password</p>
        </div>
        <div style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {state.success ? (
            <div>
              <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '12px' }}>Password updated.</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Sign in with your new password.</p>
              <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>Sign in</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {state.error && (
                <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                  {state.error}
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>New password</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={10}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="At least 10 characters"
                />
                <p style={{ fontSize: '11px', color: 'var(--text-quaternary)', marginTop: '4px' }}>Use 10+ characters with mixed case, numbers, and symbols.</p>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--text-3)' }}>Loading…</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
