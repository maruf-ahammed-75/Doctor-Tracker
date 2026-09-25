import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/api";
import {
  DashboardSummary,
  PatientsPerDoctorStat,
  DateStat,
} from "@/types/dashboard";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await axiosClient.get<ApiResponse<DashboardSummary>>(
      "/dashboard/summary"
    );
    return response.data.data;
  },

  getPatientsPerDoctor: async (): Promise<PatientsPerDoctorStat[]> => {
    const response = await axiosClient.get<ApiResponse<PatientsPerDoctorStat[]>>(
      "/dashboard/patients-per-doctor"
    );
    return response.data.data;
  },

  getStatsByDate: async (groupBy: "day" | "month" = "day"): Promise<DateStat[]> => {
    const response = await axiosClient.get<ApiResponse<DateStat[]>>(
      `/dashboard/stats-by-date?groupBy=${groupBy}`
    );
    return response.data.data;
  },
};

export default dashboardApi;
