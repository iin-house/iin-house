"use client";

import { useState } from "react";

interface ToggleProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function Toggle({
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
}: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleClick = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  const sizeClasses =
    size === "sm" ? "w-9 h-[22px]" : "w-[51px] h-[31px]";
  const thumbSize = size === "sm" ? "w-[16px] h-[16px] top-[2.5px] left-[2.5px]" : "w-[25px] h-[25px] top-[2px] left-[2px]";
  const thumbActive = size === "sm" ? "left-[20px]" : "left-[22px]";

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses}
        shrink-0 rounded-full relative
        border-[1.5px] transition-all duration-200 ease-out
        ${checked ? "bg-green-500 border-green-500" : "bg-[#1a1a1e] border-white/15"}
        ${disabled ? "opacity-40" : ""}
      `}
    >
      <span
        className={`
          ${thumbSize} ${checked ? thumbActive : ""}
          absolute top-[2px] rounded-full bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.4),0_1px_1px_rgba(0,0,0,0.2)]
          transition-all duration-200 ease-out
        `}
      />
    </button>
  );
}
