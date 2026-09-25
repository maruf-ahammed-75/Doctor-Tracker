import { useQuery } from "@tanstack/react-query";
import dashboardApi from "@/lib/api/dashboard.api";
import {
  DashboardSummary,
  PatientsPerDoctorStat,
  DateStat,
} from "@/types/dashboard";

export const DASHBOARD_QUERY_KEY = "dashboard";

/**
 * Hook to fetch high-level dashboard aggregate counts
 */
export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: [DASHBOARD_QUERY_KEY, "summary"],
    queryFn: () => dashboardApi.getSummary(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch patients per doctor aggregation
 */
export function usePatientsPerDoctor() {
  return useQuery<PatientsPerDoctorStat[]>({
    queryKey: [DASHBOARD_QUERY_KEY, "patients-per-doctor"],
    queryFn: () => dashboardApi.getPatientsPerDoctor(),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch patient visit frequency stats grouped by day or month
 */
export function useStatsByDate(groupBy: "day" | "month" = "day") {
  return useQuery<DateStat[]>({
    queryKey: [DASHBOARD_QUERY_KEY, "stats-by-date", groupBy],
    queryFn: () => dashboardApi.getStatsByDate(groupBy),
    staleTime: 1000 * 30, // 30 seconds
  });
}
