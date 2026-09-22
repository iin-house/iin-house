"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageSquare, Wallet } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const items = [
    { href: "/feed", label: "Discover", icon: Compass },
    { href: "/subscriber/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <nav className="flex items-center gap-1">
      {items.map(item => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? "bg-primary-500/10 text-primary-300" : "text-dark-500 hover:bg-dark-200"}`}>
            <item.icon size={16} />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
