"use client";

"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white/80 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-white/35 max-w-[260px] leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
