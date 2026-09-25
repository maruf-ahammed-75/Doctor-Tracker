import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 24,
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-2">
      <Loader2
        size={size}
        className={cn("animate-spin text-teal-600", className)}
      />
      {text && <p className="text-xs font-medium text-slate-500">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
