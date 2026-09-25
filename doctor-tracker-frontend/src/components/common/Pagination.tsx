"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  totalItems?: number;
  limit?: number;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  limit,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const isFirstPage = page <= 1;
  const isLastPage = page >= safeTotalPages;

  // Compute item range for "Showing X to Y of Z"
  const startItem = limit ? (page - 1) * limit + 1 : null;
  const endItem =
    limit && totalItems !== undefined
      ? Math.min(page * limit, totalItems)
      : null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-sm text-slate-600",
        className
      )}
    >
      {/* Result count metadata */}
      <div>
        {totalItems !== undefined && startItem && endItem ? (
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{totalItems === 0 ? 0 : startItem}</span> to{" "}
            <span className="font-semibold text-slate-700">{endItem}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalItems}</span> results
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
            <span className="font-semibold text-slate-700">{safeTotalPages}</span>
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isFirstPage}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-2xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Current Page Pill */}
        <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200/60 text-teal-800 font-semibold text-xs min-w-[70px] text-center shadow-2xs">
          {page} / {safeTotalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLastPage}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-2xs"
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
