"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function SubscriberNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (!session) return null;

  const items = [
    { href: "/subscriber/subscriptions", label: "My Subscriptions" },
    { href: "/subscriber/purchases", label: "Purchases" },
    { href: "/subscriber/messages", label: "Messages" },
    { href: "/subscriber/disputes", label: "Disputes" },
  ];

  return (
    <header className="glass-header">
      <div className="header-inner">
        <Link href="/feed" className="font-bold text-base gradient-text">iin house</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <Link href="/feed" className={`nav-tab ${pathname === '/feed' ? 'active' : ''}`}>Feed</Link>
          <Link href="/content-feed" className={`nav-tab ${pathname === '/content-feed' ? 'active' : ''}`}>Posts</Link>
          {items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`nav-tab ${active ? 'active' : ''}`}>
                {item.label}
              </Link>
            );
          })}
          <Link href="/api/auth/signout" className="nav-tab" style={{ color: 'var(--danger)' }}>
            <LogOut size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Sign out
          </Link>
        </nav>
      </div>
    </header>
  );
}
