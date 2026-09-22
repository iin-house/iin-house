"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: "admin", password: "1234", role: "SUBSCRIBER" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, identifier: form.identifier, password: form.password, role: form.role });
    setLoading(false);
    if (res?.ok) router.push("/feed");
    else toast.error("Invalid credentials");
  };

  const isDemo = form.identifier === "admin" && form.password === "1234";

  return (
    <>
      {error === "CredentialsSignin" && (
        <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 14px", borderRadius: "12px", fontSize: "13px", marginBottom: "16px" }}>
          Invalid email or password.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Email or phone</label>
          <input className="input" value={form.identifier} onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Password</label>
          <input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {isDemo && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '6px' }}>Login as role</label>
            <div style={{ display: 'flex', gap: 6, background: 'var(--surface-3, #1a1d24)', borderRadius: 12, padding: 3 }}>
              {(['CREATOR','SUBSCRIBER','ADMIN'] as const).map((r) => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))} style={{
                  flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: form.role === r ? 'var(--surface-4, #21252e)' : 'transparent',
                  color: form.role === r ? 'var(--text-1, #f1f1f3)' : 'var(--text-3, #8e8f93)',
                  transition: 'all 0.2s ease',
                }}>{r[0]}{r.slice(1).toLowerCase()}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ background: 'var(--surface-3, #1a1d24)', borderRadius: 12, padding: '12px 14px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', marginTop: '4px' }}>
          <div style={{ marginBottom: 6, fontWeight: 600, color: 'var(--text-2, #c5c6ca)' }}>Demo credentials</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ background: 'var(--surface-4, #21252e)', padding: '4px 10px', borderRadius: 8 }}>
              <strong style={{ color: 'var(--primary, #ec4899)' }}>admin</strong> / <strong style={{ color: 'var(--primary, #ec4899)' }}>1234</strong>
            </span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => { setForm(f => ({ ...f, identifier: 'admin', password: '1234' })); }}>
            Auto-fill credentials
          </button>
        </div>
      </form>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', fontSize: '13px' }}>
        <a href="#" style={{ color: 'var(--text-3)' }}>Forgot password?</a>
        <a href="/register" className="gradient-text" style={{ fontWeight: 500 }}>Sign up</a>
      </div>
      <div className="sep" style={{ margin: '18px 0' }} />
      <a href="/admin/dashboard" className="btn btn-secondary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
        Admin Portal
      </a>
    </>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="gradient-text font-bold" style={{ fontSize: '22px', marginBottom: '4px' }}>iin house</div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Welcome back</p>
        </div>
        <div className="card" style={{ padding: '28px' }}>
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
