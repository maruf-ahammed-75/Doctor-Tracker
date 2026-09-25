"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Listen for Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Dialog Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start space-x-4">
          {/* Icon Badge */}
          <div
            className={cn(
              "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0",
              isDestructive
                ? "bg-rose-50 border border-rose-100 text-rose-600"
                : "bg-teal-50 border border-teal-100 text-teal-600"
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-dialog-title"
              className="text-base font-bold text-slate-900 leading-6"
            >
              {title}
            </h3>
            <p
              id="confirm-dialog-description"
              className="mt-1 text-sm text-slate-500 leading-relaxed"
            >
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-50 transition-colors duration-150"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            id="confirm-dialog-btn"
            disabled={isLoading}
            onClick={onConfirm}
            className={cn(
              "w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors duration-150",
              isDestructive
                ? "text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                : "text-slate-950 bg-teal-400 hover:bg-teal-300 active:bg-teal-500"
            )}
          >
            {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
