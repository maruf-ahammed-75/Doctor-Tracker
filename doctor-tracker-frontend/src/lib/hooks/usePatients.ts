import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import doctorsApi from "@/lib/api/doctors.api";
import patientsApi from "@/lib/api/patients.api";
import { Doctor } from "@/types/doctor";
import { Patient, PatientInput, PatientFilterParams } from "@/types/patient";
import { PaginatedResponse } from "@/types/api";

export const PATIENTS_QUERY_KEY = "patients";

/**
 * Hook to fetch paginated and filtered list of patients (dedicated route)
 */
export function usePatients(filters: PatientFilterParams = {}) {
  return useQuery<PaginatedResponse<Patient>>({
    queryKey: [PATIENTS_QUERY_KEY, filters],
    queryFn: () => patientsApi.getPatients(filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch a single doctor by ID
 */
export function useDoctor(id: string) {
  return useQuery<Doctor>({
    queryKey: ["doctor", id],
    queryFn: () => doctorsApi.getDoctorById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch paginated patients under a specific doctor
 */
export function useDoctorPatients(
  doctorId: string,
  filters: PatientFilterParams = {}
) {
  return useQuery<PaginatedResponse<Patient>>({
    queryKey: [doctorId, filters],
    queryFn: () => doctorsApi.getDoctorPatients(doctorId, filters),
    enabled: Boolean(doctorId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Mutation hook to add a patient under a doctor
 */
export function useAddPatientToDoctor(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation<Patient, any, PatientInput>({
    mutationFn: (data: PatientInput) =>
      doctorsApi.addPatientToDoctor(doctorId, data),
    onSuccess: () => {
      // Invalidate doctor's patients queries (both [doctorId] and ["doctor-patients", doctorId])
      queryClient.invalidateQueries({
        queryKey: [doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor-patients", doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: [PATIENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor", doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

/**
 * Mutation hook to remove a patient from a doctor
 */
export function useRemovePatientFromDoctor(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, any, string>({
    mutationFn: (patientId: string) =>
      doctorsApi.removePatientFromDoctor(doctorId, patientId),
    onSuccess: () => {
      // Invalidate doctor's patients queries (both [doctorId] and ["doctor-patients", doctorId])
      queryClient.invalidateQueries({
        queryKey: [doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor-patients", doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: [PATIENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor", doctorId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

/**
 * Mutation hook to update an existing patient
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation<Patient, any, { id: string; data: Partial<PatientInput> }>({
    mutationFn: ({ id, data }) => patientsApi.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({
        queryKey: [PATIENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor-patients"],
      });
      if (updatedPatient?.doctor) {
        const docId =
          typeof updatedPatient.doctor === "object"
            ? (updatedPatient.doctor as any)?._id
            : updatedPatient.doctor;
        if (docId) {
          queryClient.invalidateQueries({ queryKey: [docId] });
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

/**
 * Mutation hook to delete a patient by ID (dedicated route)
 */
export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation<void, any, string | { id: string; doctorId?: string }>({
    mutationFn: (param) => {
      const id = typeof param === "string" ? param : param.id;
      return patientsApi.deletePatient(id);
    },
    onSuccess: (_, param) => {
      queryClient.invalidateQueries({
        queryKey: [PATIENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor-patients"],
      });
      if (typeof param === "object" && param.doctorId) {
        queryClient.invalidateQueries({
          queryKey: [param.doctorId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}


