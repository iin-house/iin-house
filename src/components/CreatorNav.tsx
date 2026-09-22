"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function CreatorNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (!session) return null;

  const items = [
    { href: "/creator/dashboard", label: "Dashboard" },
    { href: "/creator/upload", label: "Upload" },
    { href: "/creator/tiers", label: "Tiers" },
    { href: "/creator/earnings", label: "Earnings" },
    { href: "/creator/messages", label: "Messages" },
  ];

  return (
    <header className="glass-header">
      <div className="header-inner">
        <Link href="/" className="font-bold text-base gradient-text">iin house</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          {items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`nav-tab ${active ? 'active' : ''}`}>
                {item.label}
              </Link>
            );
          })}
          <Link href="/creator/contract" className="nav-tab">Contract</Link>
          <Link href="/api/auth/signout" className="nav-tab" style={{ color: 'var(--danger)' }}>
            <LogOut size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Sign out
          </Link>
        </nav>
      </div>
    </header>
  );
}
