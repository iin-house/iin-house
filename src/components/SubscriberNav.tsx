"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Heart, Bell, Receipt } from "lucide-react";
import { usePathname } from "next/navigation";

export function SubscriberNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  if (!session) return null;

  const items = [
    { href: "/feed", label: "Feed" },
    { href: "/content-feed", label: "Posts" },
    { href: "/subscriber/subscriptions", label: "My Subs" },
    { href: "/subscriber/purchases", label: "Purchases" },
    { href: "/subscriber/messages", label: "Messages" },
    { href: "/subscriber/notifications", label: "Alerts", icon: Bell },
    { href: "/subscriber/wishlist", label: "Saved", icon: Heart },
    { href: "/subscriber/billing", label: "Billing", icon: Receipt },
    { href: "/subscriber/disputes", label: "Disputes" },
  ];

  return (
    <header className="glass-header">
      <div className="header-inner">
        <Link href="/feed" className="font-bold text-base gradient-text">iin house</Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          {items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`nav-tab ${active ? 'active' : ''}`}>
                {item.icon && <item.icon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />}
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
