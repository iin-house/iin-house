"use client";

import { ReactNode } from "react";

interface AvatarProps {
  initials?: string;
  emoji?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-18 h-18 text-2xl",
};

export function Avatar({
  initials,
  emoji,
  size = "md",
  color = "from-pink-500 to-purple-600",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br ${color}
        flex items-center justify-center font-bold text-white
        shadow-lg shrink-0
        ${className}
      `}
    >
      {emoji || initials}
    </div>
  );
}
