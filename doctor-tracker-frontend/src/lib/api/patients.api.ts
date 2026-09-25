import axiosClient from "./axiosClient";
import { buildQueryString } from "@/lib/utils/queryString";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Patient, PatientInput, PatientFilterParams } from "@/types/patient";

export const patientsApi = {
  getPatients: async (params: PatientFilterParams = {}): Promise<PaginatedResponse<Patient>> => {
    const query = buildQueryString(params);
    const response = await axiosClient.get<PaginatedResponse<Patient>>(`/patients${query}`);
    return response.data;
  },

  getPatientById: async (id: string): Promise<Patient> => {
    const response = await axiosClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  updatePatient: async (id: string, data: Partial<PatientInput>): Promise<Patient> => {
    const response = await axiosClient.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  deletePatient: async (id: string): Promise<void> => {
    await axiosClient.delete<ApiResponse<null>>(`/patients/${id}`);
  },
};

export default patientsApi;
