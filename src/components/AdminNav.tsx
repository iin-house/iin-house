"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield, Users, FileText, Ban, BarChart3, Wallet, AlertCircle, TrendingUp } from "lucide-react";

export function AdminNav() {
  const { data: session } = useSession();
  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  return (
    <header className="glass-header">
      <div className="header-inner">
        <Link href="/admin/dashboard" className="font-bold text-base gradient-text">iin house</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <Link href="/admin/dashboard" className="nav-tab">Dashboard</Link>
          <Link href="/admin/kyc" className="nav-tab">KYC</Link>
          <Link href="/admin/moderation" className="nav-tab">Moderation</Link>
          <Link href="/admin/contracts" className="nav-tab">Contracts</Link>
          <Link href="/admin/payouts" className="nav-tab">Payouts</Link>
          <Link href="/admin/disputes" className="nav-tab">Disputes</Link>
          <Link href="/admin/analytics" className="nav-tab">Analytics</Link>
          <Link href="/admin/compliance" className="nav-tab">Compliance</Link>
          <Link href="/api/auth/signout" className="nav-tab" style={{ color: 'var(--danger)' }}>Sign out</Link>
        </nav>
      </div>
    </header>
  );
}
