"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { register } from "./actions";
import { registerSchema } from "@/lib/validation";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get("role") === "creator" ? "CREATOR" : "SUBSCRIBER";
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"CREATOR" | "SUBSCRIBER">(defaultRole);
  const [form, setForm] = useState({
    email: "", phone: "", password: "", confirm: "", displayName: "", role: defaultRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = registerSchema.safeParse({
      email: form.email,
      phone: form.phone,
      password: form.password,
      role,
      displayName: form.displayName,
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
  }, [form.email, form.phone, form.password, form.displayName, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors above");
      return;
    }
    if (form.password !== form.confirm) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords don't match" }));
      return;
    }
    setLoading(true);
    const res = await register({
      email: form.email || undefined,
      phone: form.phone || undefined,
      password: form.password,
      role,
      displayName: form.displayName,
    });
    setLoading(false);
    if ("error" in res) { toast.error(res.error); return; }
    toast.success("Account created! Redirecting…");
    setTimeout(() => router.push("/login"), 800);
  };

  return (
    <>
      <div style={{
        display: 'flex', gap: '6px', marginBottom: '20px',
        background: 'var(--surface-3)', borderRadius: '12px', padding: '3px'
      }}>
        <button
          type="button"
          onClick={() => setRole("CREATOR")}
          style={{
            flex: 1, textAlign: 'center', padding: '9px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600,
            background: role === "CREATOR" ? 'var(--surface-2)' : 'transparent',
            color: role === "CREATOR" ? 'var(--text)' : 'var(--text-3)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          Creator
        </button>
        <button
          type="button"
          onClick={() => setRole("SUBSCRIBER")}
          style={{
            flex: 1, textAlign: 'center', padding: '9px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 600,
            background: role === "SUBSCRIBER" ? 'var(--surface-2)' : 'transparent',
            color: role === "SUBSCRIBER" ? 'var(--text)' : 'var(--text-3)',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
          }}
        >
          Subscriber
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Display name</label>
          <input className="input" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} aria-invalid={!!errors.displayName} />
          {errors.displayName && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.displayName}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Email</label>
          <input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="optional" aria-invalid={!!errors.email} />
          {errors.email && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.email}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Phone (+91…)</label>
          <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="optional" aria-invalid={!!errors.phone} />
          {errors.phone && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.phone}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Password (min 10 chars)</label>
          <input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} aria-invalid={!!errors.password} />
          {errors.password && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.password}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '6px' }}>Confirm password</label>
          <input type="password" className="input" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} aria-invalid={!!errors.confirm} />
          {errors.confirm && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '4px' }}>{errors.confirm}</p>}
        </div>
        <input type="hidden" value={form.role || role} name="role" />
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '4px' }} type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-3)' }}>
        Already have an account? <a href="/login" className="gradient-text" style={{ fontWeight: 500 }}>Sign in</a>
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="gradient-text font-bold" style={{ fontSize: '22px', marginBottom: '4px' }}>iin house</div>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Create your account</p>
        </div>
        <div className="card" style={{ padding: '28px' }}>
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
