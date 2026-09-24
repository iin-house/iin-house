"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { loginSchema } from "@/lib/validation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "", role: "SUBSCRIBER" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = loginSchema.safeParse({
      identifier: form.identifier,
      password: form.password,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() ?? "form";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  useEffect(() => {
    validate();
  }, [form.identifier, form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors above");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, identifier: form.identifier, password: form.password, role: form.role });
    setLoading(false);
    if (res?.ok) router.push("/feed");
    else toast.error("Invalid credentials");
  };

  return (
    <>
      {error === "CredentialsSignin" && (
        <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 14px", borderRadius: "12px", fontSize: "13px", marginBottom: "16px" }}>
          Invalid email or password.
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label htmlFor="login-identifier" style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Email or phone</label>
          <input id="login-identifier" name="identifier" className="input" value={form.identifier} onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))} aria-invalid={!!errors.identifier} />
          {errors.identifier && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.identifier}</p>}
        </div>
        <div>
          <label htmlFor="login-password" style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Password</label>
          <input id="login-password" name="password" type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} aria-invalid={!!errors.password} />
          {errors.password && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.password}</p>}
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', fontSize: '13px' }}>
        <Link href="/forgot-password" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Forgot password?</Link>
        <Link href="/register" className="gradient-text" style={{ fontWeight: 500 }}>Sign up</Link>
      </div>
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
