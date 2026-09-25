"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { usePatientsPerDoctor } from "@/lib/hooks/useDashboard";
import { Users, BarChart3, AlertCircle } from "lucide-react";

const BAR_COLORS = [
  "#0d9488", // teal-600
  "#0284c7", // sky-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#e11d48", // rose-600
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 pointer-events-none">
        <p className="font-bold text-teal-300 text-sm">{data.doctorName}</p>
        <p className="text-slate-300">{data.specialization} • {data.hospital}</p>
        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between space-x-3">
          <span className="text-slate-400">Total Consultations:</span>
          <span className="font-extrabold text-white text-sm">
            {data.patientCount} {data.patientCount === 1 ? "patient" : "patients"}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function PatientsPerDoctorChart() {
  const { data, isLoading, isError } = usePatientsPerDoctor();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="h-5 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-64 w-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
          <BarChart3 className="h-8 w-8 text-slate-300" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-rose-600 text-sm font-semibold">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load patient distribution</span>
        </div>
        <p className="text-xs text-slate-500">
          The server could not compute the aggregation pipeline.
        </p>
      </div>
    );
  }

  const chartData = (data || []).map((item) => ({
    ...item,
    displayName: item.doctorName.length > 14
      ? `${item.doctorName.slice(0, 14)}...`
      : item.doctorName,
  }));

  const hasData = chartData.length > 0 && chartData.some((d) => d.patientCount > 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Patients per Practitioner
              </h2>
              <p className="text-xs text-slate-500">
                Patient caseload distribution across attending doctors
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {chartData.length} {chartData.length === 1 ? "Doctor" : "Doctors"}
          </span>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-2 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            No patient caseload recorded
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Assign patients under doctors in the directory to see their workload comparison.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="displayName"
                width={110}
                tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              />
              <Bar
                dataKey="patientCount"
                radius={[0, 6, 6, 0]}
                barSize={18}
                animationDuration={600}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default PatientsPerDoctorChart;
