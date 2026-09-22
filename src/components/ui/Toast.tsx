"use client";

"use client";

import { ReactNode, useState, useEffect } from "react";

interface ToastProps {
  message: string;
  icon?: ReactNode;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  icon,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 250);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconColors: Record<string, string> = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-sky-400",
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-5 py-3
        bg-[#1c1c1e]/[0.92] backdrop-blur-2xl
        border border-white/[0.08] rounded-2xl
        shadow-2xl min-w-[280px] max-w-[400px]
        ${exiting ? "opacity-0 -translate-y-1 scale-[0.98] transition-all duration-250" : "opacity-100 translate-y-0 scale-100 transition-all duration-400 ease-out"}
      `}
      style={{
        animation: exiting ? "none" : "toastIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      }}
    >
      {icon && <span className={`shrink-0 ${iconColors[type] || iconColors.info}`}>{icon}</span>}
      <p className="text-sm font-medium text-white/90 leading-snug">{message}</p>
    </div>
  );
}
