"use client";

import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[#ec4899] to-[#db2777] text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 active:scale-[0.96]",
  secondary:
    "bg-[#1a1a1e] text-white border border-white/10 hover:bg-[#1c1c1e] hover:border-white/20 active:scale-[0.96]",
  ghost:
    "text-pink-400 hover:bg-pink-500/10 active:scale-[0.96]",
  danger:
    "bg-[#ff453a] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 active:scale-[0.96]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  type = "button",
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full font-semibold tracking-tight
        transition-all duration-150 ease-out
        relative overflow-hidden
        disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
