"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
  keyExtractor?: (row: T, index: number) => string | number;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found",
  emptySubtitle = "There are currently no items matching your criteria.",
  keyExtractor,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const getKey = (row: T, index: number): string | number => {
    if (keyExtractor) return keyExtractor(row, index);
    return row._id || row.id || index;
  };

  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "py-3.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider",
                    getAlignmentClass(col.align),
                    col.headerClassName
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              // Skeleton rows for loading state
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                  {columns.map((col, colIndex) => (
                    <td
                      key={`skeleton-${rowIndex}-${colIndex}`}
                      className="py-4 px-4 whitespace-nowrap"
                    >
                      <div
                        className={cn(
                          "h-4 bg-slate-200/70 rounded-md",
                          colIndex === 0 ? "w-3/4" : "w-1/2"
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 px-4 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">
                      {emptyMessage}
                    </p>
                    {emptySubtitle && (
                      <p className="text-xs text-slate-400 max-w-sm">
                        {emptySubtitle}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, index) => (
                <tr
                  key={getKey(row, index)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "transition-colors duration-150",
                    onRowClick
                      ? "cursor-pointer hover:bg-slate-50/90 active:bg-slate-100/70"
                      : "hover:bg-slate-50/60"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={`${getKey(row, index)}-${col.key}`}
                      className={cn(
                        "py-3.5 px-4 text-slate-700 align-middle",
                        getAlignmentClass(col.align),
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(row, index)
                        : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
