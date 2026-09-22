"use client";

"use client";

import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  transparent?: boolean;
}

export function Header({
  title,
  leftAction,
  rightAction,
  transparent = false,
}: HeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-50 h-[52px] flex items-center justify-between px-4
        ${transparent
          ? "bg-transparent"
          : "bg-[#0a0a0c]/[0.78] backdrop-blur-2xl border-b border-white/[0.06]"
        }
      `}
    >
      <div className="w-10 flex justify-start">
        {leftAction}
      </div>

      {title && (
        <h1 className="text-[17px] font-semibold tracking-tight truncate">
          {title}
        </h1>
      )}

      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </header>
  );
}
