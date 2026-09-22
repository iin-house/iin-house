"use client";

import { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "primary" | "muted";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-500/12 text-green-400",
  warning: "bg-yellow-500/12 text-yellow-300",
  danger: "bg-red-500/12 text-red-400",
  info: "bg-sky-400/12 text-sky-300",
  primary: "bg-pink-500/12 text-pink-400",
  muted: "bg-white/[0.06] text-white/40",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

export function Badge({ children, variant = "primary", size = "md" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold tracking-wide uppercase
        rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {children}
    </span>
  );
}
