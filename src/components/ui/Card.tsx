"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function Card({
  children,
  className = "",
  interactive = false,
  onClick,
  padding = "md",
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative bg-[#1c1c1e] border border-white/[0.06]
        rounded-2xl overflow-hidden
        before:content-[''] before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent
        before:pointer-events-none
        ${interactive ? "hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-[0.985] active:transition-transform" : ""}
        transition-all duration-200 ease-out
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
