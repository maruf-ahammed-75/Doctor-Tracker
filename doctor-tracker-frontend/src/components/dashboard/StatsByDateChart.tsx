"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useStatsByDate } from "@/lib/hooks/useDashboard";
import { Calendar, TrendingUp, AlertCircle, Clock } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  groupBy?: "day" | "month";
}

function CustomTooltip({ active, payload, label, groupBy }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const count = payload[0].value;
    let formattedLabel = label || "";

    if (label) {
      if (groupBy === "month") {
        const [year, month] = label.split("-");
        if (year && month) {
          const d = new Date(Number(year), Number(month) - 1, 1);
          formattedLabel = d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          });
        }
      } else {
        const d = new Date(label + "T00:00:00");
        if (!isNaN(d.getTime())) {
          formattedLabel = d.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      }
    }

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700 pointer-events-none">
        <p className="font-semibold text-slate-300">{formattedLabel}</p>
        <div className="pt-1 flex items-center justify-between space-x-3">
          <span className="text-slate-400">Consultations:</span>
          <span className="font-extrabold text-teal-400 text-sm">
            {count} {count === 1 ? "patient" : "patients"}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function StatsByDateChart() {
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const { data, isLoading, isError } = useStatsByDate(groupBy);

  const formatDateTick = (dateStr: string) => {
    if (!dateStr) return "";
    if (groupBy === "month") {
      const [year, month] = dateStr.split("-");
      if (year && month) {
        const d = new Date(Number(year), Number(month) - 1, 1);
        return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
      }
    } else {
      const d = new Date(dateStr + "T00:00:00");
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      }
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-64 w-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-slate-300" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-rose-600 text-sm font-semibold">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load visit activity trends</span>
        </div>
        <p className="text-xs text-slate-500">
          Could not aggregate chronological consultations.
        </p>
      </div>
    );
  }

  const hasData = (data || []).length > 0;
  const totalPeriodVisits = (data || []).reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Header with Title and Day/Month Segmented Switch */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Patient Visits Over Time
            </h2>
            <p className="text-xs text-slate-500">
              Chronological consultation frequency aggregated by {groupBy}
            </p>
          </div>
        </div>

        {/* Day / Month Segmented Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
          <button
            type="button"
            onClick={() => setGroupBy("day")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
              groupBy === "day"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setGroupBy("month")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
              groupBy === "month"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-2 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No chronological visit data recorded
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Patient visits scheduled with dates will appear here chronologically.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateTick}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip groupBy={groupBy} />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0d9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#visitGradient)"
                activeDot={{ r: 6, fill: "#0f766e", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart Footer Indicator */}
      {hasData && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Recorded Consultations</span>
          <span className="font-bold text-slate-900">
            {totalPeriodVisits.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatsByDateChart;
