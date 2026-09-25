"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import { Filter, RotateCcw, Calendar } from "lucide-react";

export interface DoctorFiltersProps {
  search: string;
  specialization: string;
  from: string;
  to: string;
  onSearchChange: (search: string) => void;
  onSpecializationChange: (specialization: string) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
}

const COMMON_SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Psychiatry",
  "Radiology",
  "General Medicine",
  "Anesthesiology",
  "Endocrinology",
  "Gastroenterology",
];

export function DoctorFilters({
  search,
  specialization,
  from,
  to,
  onSearchChange,
  onSpecializationChange,
  onDateRangeChange,
  onReset,
}: DoctorFiltersProps) {
  const hasActiveFilters = Boolean(search || specialization || from || to);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input (Debounced) */}
        <div className="flex-1">
          <SearchInput
            value={search}
            onSearch={onSearchChange}
            placeholder="Search doctors by name, specialization, or hospital..."
            className="w-full max-w-none"
          />
        </div>

        {/* Specialization Select */}
        <div className="w-full lg:w-56">
          <div className="relative">
            <select
              id="specialization-filter"
              value={specialization}
              onChange={(e) => onSpecializationChange(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-2 pl-3 pr-8 text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">All Specializations</option>
              {COMMON_SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <Filter className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Date Range: From & To */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              id="filter-from-date"
              value={from}
              onChange={(e) => onDateRangeChange(e.target.value, to)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              title="Created From Date"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">to</span>
          <div className="relative">
            <input
              type="date"
              id="filter-to-date"
              value={to}
              onChange={(e) => onDateRangeChange(from, e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              title="Created To Date"
            />
          </div>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs shrink-0"
            title="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default DoctorFilters;
