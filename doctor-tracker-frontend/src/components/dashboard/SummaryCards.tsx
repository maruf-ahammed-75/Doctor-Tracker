"use client";

import React from "react";
import Link from "next/link";
import { useDashboardSummary } from "@/lib/hooks/useDashboard";
import { Stethoscope, Users, Activity, ArrowRight } from "lucide-react";

export function SummaryCards() {
  const { data, isLoading, isError } = useDashboardSummary();

  const totalDoctors = data?.totalDoctors ?? 0;
  const totalPatients = data?.totalPatients ?? 0;
  const avgLoad =
    totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : "0.0";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded-md" />
              <div className="h-10 w-10 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-md" />
            <div className="h-3 w-36 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
        <span>Could not load live summary stats. Please check backend connection.</span>
      </div>
    );
  }

  const cards = [
    {
      title: "Registered Doctors",
      value: totalDoctors,
      description: "Active practitioners in clinical registry",
      href: "/doctors",
      icon: Stethoscope,
      iconBg: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      accent: "from-teal-500 to-emerald-500",
    },
    {
      title: "Assigned Patients",
      value: totalPatients,
      description: "Documented clinical consultations",
      href: "/patients",
      icon: Users,
      iconBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      accent: "from-cyan-500 to-blue-500",
    },
    {
      title: "Avg Load per Doctor",
      value: avgLoad,
      description: "Average patient load across team",
      href: "/doctors",
      icon: Activity,
      iconBg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      accent: "from-indigo-500 to-violet-500",
      isDecimal: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.title}
            className="group relative bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row: Title & Icon */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center border shadow-2xs ${card.iconBg}`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              {/* Metric Value */}
              <div className="mt-4 flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {typeof card.value === "number"
                    ? card.value.toLocaleString()
                    : card.value}
                </span>
                {card.isDecimal && (
                  <span className="text-xs font-semibold text-slate-400">
                    pts / doc
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-500 font-medium">
                {card.description}
              </p>
            </div>

            {/* Bottom Link Action */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={card.href}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors inline-flex items-center space-x-1 group-hover:translate-x-0.5 duration-150"
              >
                <span>View details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div
                className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${card.accent} opacity-70`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;
