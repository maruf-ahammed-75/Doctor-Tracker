import axiosClient from "./axiosClient";
import { buildQueryString } from "@/lib/utils/queryString";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Doctor, DoctorInput, DoctorFilterParams } from "@/types/doctor";
import { Patient, PatientInput, PatientFilterParams } from "@/types/patient";

export const doctorsApi = {
  getDoctors: async (params: DoctorFilterParams = {}): Promise<PaginatedResponse<Doctor>> => {
    const query = buildQueryString(params);
    const response = await axiosClient.get<PaginatedResponse<Doctor>>(`/doctors${query}`);
    return response.data;
  },

  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await axiosClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },

  createDoctor: async (data: DoctorInput): Promise<Doctor> => {
    const response = await axiosClient.post<ApiResponse<Doctor>>("/doctors", data);
    return response.data.data;
  },

  updateDoctor: async (id: string, data: Partial<DoctorInput>): Promise<Doctor> => {
    const response = await axiosClient.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
    return response.data.data;
  },

  deleteDoctor: async (id: string): Promise<void> => {
    await axiosClient.delete<ApiResponse<null>>(`/doctors/${id}`);
  },

  // Nested Doctor-Patient routes
  getDoctorPatients: async (
    doctorId: string,
    params: PatientFilterParams = {}
  ): Promise<PaginatedResponse<Patient>> => {
    const query = buildQueryString(params);
    const response = await axiosClient.get<PaginatedResponse<Patient>>(
      `/doctors/${doctorId}/patients${query}`
    );
    return response.data;
  },

  addPatientToDoctor: async (doctorId: string, data: PatientInput): Promise<Patient> => {
    const response = await axiosClient.post<ApiResponse<Patient>>(
      `/doctors/${doctorId}/patients`,
      data
    );
    return response.data.data;
  },

  removePatientFromDoctor: async (doctorId: string, patientId: string): Promise<void> => {
    await axiosClient.delete<ApiResponse<null>>(
      `/doctors/${doctorId}/patients/${patientId}`
    );
  },
};

export default doctorsApi;
