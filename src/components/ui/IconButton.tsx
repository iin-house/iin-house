"use client";

import { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function IconButton({
  children,
  onClick,
  className = "",
  size = "md",
}: IconButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "w-8 h-8 text-sm"
      : "w-10 h-10 text-base";

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses}
        flex items-center justify-center
        rounded-full bg-white/[0.06] text-white/70
        hover:bg-white/10 hover:text-white
        active:bg-white/15 active:scale-95
        transition-all duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}
