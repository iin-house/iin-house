"use client";

"use client";

export function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        h-[0.5px] bg-white/[0.08]
        ${className}
      `}
    />
  );
}
