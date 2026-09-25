"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PatientsPerDoctorChart from "@/components/dashboard/PatientsPerDoctorChart";
import StatsByDateChart from "@/components/dashboard/StatsByDateChart";
import {
  DASHBOARD_QUERY_KEY,
  useDashboardSummary,
} from "@/lib/hooks/useDashboard";
import { useToast } from "@/lib/context/ToastContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Activity, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isLoading } = useDashboardSummary();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | Doctor Tracker";
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const startTime = Date.now();
      // Refetch all active queries under the dashboard key (summary, patients-per-doctor, stats-by-date)
      await queryClient.refetchQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }
      toast.success(
        "Dashboard Refreshed",
        "Analytics and charts updated with latest database records."
      );
    } catch (err: any) {
      toast.error(
        "Refresh Failed",
        "Could not refresh dashboard data. Please check your backend connection."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-150">
        <div>
          <div className="h-7 w-64 bg-slate-200 rounded-lg animate-pulse" />
          <div className="mt-2 h-4 w-96 bg-slate-100 rounded-md animate-pulse" />
        </div>

        {/* Skeleton Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs animate-pulse space-y-4"
            >
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-20 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-60 bg-slate-50 rounded-xl" />
          </div>
          <div className="h-80 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-4">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-60 bg-slate-50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Clinical Overview & Analytics
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time practitioner registry, patient consultation volume, and workload analytics.
          </p>
        </div>

        <button
          type="button"
          id="refresh-dashboard-btn"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all self-start sm:self-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          title="Refresh analytics data"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 transition-colors ${
              isRefreshing ? "animate-spin text-teal-600" : "text-slate-400"
            }`}
          />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* 1. Summary Cards Section */}
      <section aria-label="Key Performance Indicators">
        <SummaryCards />
      </section>

      {/* 2. Charts Section: Side-by-side on desktop, stacked on mobile */}
      <section
        aria-label="Clinical Charts & Distribution"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
      >
        {/* Left: Patients Per Doctor (Bar Chart) */}
        <div className="min-h-[380px]">
          <PatientsPerDoctorChart />
        </div>

        {/* Right: Visits Over Time (Day/Month Line Chart) */}
        <div className="min-h-[380px]">
          <StatsByDateChart />
        </div>
      </section>
    </div>
  );
}
