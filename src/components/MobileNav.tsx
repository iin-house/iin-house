"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, User } from "lucide-react";

const MOBILE_TABS = [
  { href: "/feed", icon: Home, label: "Home" },
  { href: "/content-feed", icon: Search, label: "Posts" },
  { href: "/subscriber/messages", icon: MessageCircle, label: "Messages" },
  { href: "/subscriber/settings", icon: User, label: "Me" },
];

export function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role || "SUBSCRIBER";

  const tabs = MOBILE_TABS.map(tab => {
    if (tab.label === "Messages" && role === "CREATOR") {
      return { href: "/creator/messages", icon: MessageCircle, label: "Messages" };
    }
    if (tab.label === "Me") {
      const settingsHref = role === "CREATOR" ? "/creator/settings" : "/subscriber/settings";
      return { ...tab, href: settingsHref };
    }
    return tab;
  });

  if (!session) return null;

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .mobile-nav { display: none !important; }
        }
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--surface-2, rgba(30, 30, 30, 0.95));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 0.5px solid var(--sep);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 12px;
          text-decoration: none;
          color: var(--text-3);
          font-size: 10px;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .mobile-nav-item.active {
          color: var(--primary);
        }
        .mobile-nav-item svg {
          width: 22px;
          height: 22px;
        }
        body {
          padding-bottom: 60px;
        }
        @media (min-width: 768px) {
          body { padding-bottom: 0; }
        }
      `}</style>
      <nav className="mobile-nav">
        {tabs.map(tab => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link key={tab.href} href={tab.href} className={`mobile-nav-item ${active ? 'active' : ''}`}>
              <tab.icon size={22} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
