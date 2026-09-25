"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import { useDoctors } from "@/lib/hooks/useDoctors";
import { Stethoscope, HeartPulse, RotateCcw } from "lucide-react";

export interface PatientFiltersProps {
  search: string;
  condition: string;
  doctorId: string;
  from: string;
  to: string;
  onSearchChange: (search: string) => void;
  onConditionChange: (condition: string) => void;
  onDoctorChange: (doctorId: string) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
}

const COMMON_CONDITIONS = [
  "Hypertension",
  "Type 2 Diabetes",
  "Asthma",
  "Mild Asthma",
  "Arthritis",
  "Cardiovascular Disease",
  "Chronic Kidney Disease",
  "Migraine",
  "Depression",
  "Allergic Rhinitis",
  "COPD",
  "Post-Op Followup",
];

export function PatientFilters({
  search,
  condition,
  doctorId,
  from,
  to,
  onSearchChange,
  onConditionChange,
  onDoctorChange,
  onDateRangeChange,
  onReset,
}: PatientFiltersProps) {
  // Fetch doctors for doctor filter dropdown
  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctors({
    limit: 100,
  });
  const doctors = doctorsData?.data || [];

  const hasActiveFilters = Boolean(
    search || condition || doctorId || from || to
  );

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
      {/* Top Filter Bar: Search, Doctor Select, Condition Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input (Debounced) */}
        <div className="flex-1">
          <SearchInput
            value={search}
            onSearch={onSearchChange}
            placeholder="Search patients by name or condition..."
            className="w-full max-w-none"
          />
        </div>

        {/* Doctor Filter Select */}
        <div className="w-full lg:w-60">
          <div className="relative">
            <select
              id="doctor-filter"
              value={doctorId}
              onChange={(e) => onDoctorChange(e.target.value)}
              disabled={isDoctorsLoading}
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
            >
              <option value="">All Attending Doctors</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`} (
                  {doc.specialization})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Stethoscope className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Condition Filter (Input with Datalist Suggestions) */}
        <div className="w-full lg:w-52">
          <div className="relative">
            <input
              type="text"
              id="condition-filter"
              list="common-conditions-list"
              value={condition}
              onChange={(e) => onConditionChange(e.target.value)}
              placeholder="Filter by condition..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-900 font-medium placeholder-slate-400 shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
            <datalist id="common-conditions-list">
              {COMMON_CONDITIONS.map((cond) => (
                <option key={cond} value={cond} />
              ))}
            </datalist>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Date Range: Visit From & To */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              id="patient-filter-from-date"
              value={from}
              onChange={(e) => onDateRangeChange(e.target.value, to)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              title="Visit Date From"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">to</span>
          <div className="relative">
            <input
              type="date"
              id="patient-filter-to-date"
              value={to}
              onChange={(e) => onDateRangeChange(from, e.target.value)}
              className="bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              title="Visit Date To"
            />
          </div>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
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

export default PatientFilters;
