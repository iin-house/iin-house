"use client";

import { ReactNode } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  icon,
  className = "",
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-white/40 mb-1.5 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-[#1a1a1e] border border-white/[0.08] rounded-xl
            px-4 py-3 text-sm text-white placeholder:text-white/20
            outline-none
            transition-all duration-150
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500/50" : "focus:border-pink-500/60 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.12)]"}
          `}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
}
