"use client";

"use client";

import { ReactNode } from "react";

interface TabBarProps {
  items: { label: string; icon: ReactNode; activeIcon?: ReactNode }[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function TabBar({ items, activeIndex, onChange }: TabBarProps) {
  return (
    <nav className="flex items-center justify-around px-2 bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/[0.06]">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`
            flex flex-col items-center gap-0.5 py-2 px-4
            rounded-xl transition-all duration-200
            ${i === activeIndex ? "text-pink-400" : "text-white/30"}
          `}
        >
          <span className="text-lg">{i === activeIndex && item.activeIcon ? item.activeIcon : item.icon}</span>
          <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
