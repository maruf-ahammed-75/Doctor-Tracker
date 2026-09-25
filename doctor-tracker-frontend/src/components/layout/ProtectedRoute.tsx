"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ShieldCheck } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // While verifying session or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center px-4">
          <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400">
            <ShieldCheck size={36} className="animate-pulse" />
          </div>
          <LoadingSpinner size={32} className="text-teal-400" />
          <p className="text-sm font-medium text-slate-300">
            Verifying secure clinical session...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated, hold rendering until redirect finishes
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
