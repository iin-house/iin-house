"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { forgotPasswordSchema } from "@/lib/validation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const msg = result.error.issues[0]?.message ?? "Invalid email";
      setEmailError(msg);
      return false;
    }
    setEmailError("");
    return true;
  };

  useEffect(() => {
    if (email) validate();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    const result = await requestPasswordReset(new FormData(e.target as HTMLFormElement));
    setLoading(false);
    if (result.error) setState({ error: result.error });
    else setState({ success: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>iin house</Link>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Reset your password</p>
        </div>
        <div style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          {state.success ? (
            <div>
              <p style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '12px' }}>Check your email.</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>If that email is registered, we sent a reset link. The link expires in 1 hour.</p>
              <Link href="/login" style={{ display: 'block', marginTop: '24px', fontSize: '13px', color: 'var(--accent)', textAlign: 'center' }}>Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {state.error && (
                <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                  {state.error}
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  aria-invalid={!!emailError}
                />
                {emailError && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{emailError}</p>}
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <Link href="/login" style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4px' }}>Back to login</Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
