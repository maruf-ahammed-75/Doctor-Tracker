import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import doctorsApi from "@/lib/api/doctors.api";
import { Doctor, DoctorInput, DoctorFilterParams } from "@/types/doctor";
import { PaginatedResponse } from "@/types/api";

export const DOCTORS_QUERY_KEY = "doctors";

/**
 * Hook to fetch paginated and filtered list of doctors
 */
export function useDoctors(filters: DoctorFilterParams = {}) {
  return useQuery<PaginatedResponse<Doctor>>({
    queryKey: [DOCTORS_QUERY_KEY, filters],
    queryFn: () => doctorsApi.getDoctors(filters),
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
    staleTime: 1000 * 30,
  });
}

/**
 * Mutation hook to create a new doctor
 */
export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation<Doctor, any, DoctorInput>({
    mutationFn: (data: DoctorInput) => doctorsApi.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_QUERY_KEY] });
    },
  });
}

/**
 * Mutation hook to update an existing doctor
 */
export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation<Doctor, any, { id: string; data: Partial<DoctorInput> }>({
    mutationFn: ({ id, data }) => doctorsApi.updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_QUERY_KEY] });
    },
  });
}

/**
 * Mutation hook to delete a doctor
 */
export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation<void, any, string>({
    mutationFn: (id: string) => doctorsApi.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCTORS_QUERY_KEY] });
    },
  });
}
