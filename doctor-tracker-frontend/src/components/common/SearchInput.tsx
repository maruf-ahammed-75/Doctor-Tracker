"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value?: string;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export function SearchInput({
  value = "",
  onSearch,
  placeholder = "Search by name, condition, or keyword...",
  debounceMs = 400,
  className,
  id = "search-input",
  disabled = false,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const isFirstRender = useRef(true);

  // Sync state if external value prop updates
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce search trigger
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>

      {/* Text Input */}
      <input
        id={id}
        type="text"
        disabled={disabled}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleClear();
          }
        }}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-colors shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:bg-slate-50"
        )}
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search input"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
