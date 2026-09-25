import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z
    .string()
    .min(1, "Doctor name is required")
    .trim(),
  specialization: z
    .string()
    .min(1, "Specialization is required")
    .trim(),
  hospital: z
    .string()
    .min(1, "Hospital / Clinic name is required")
    .trim(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .trim(),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please provide a valid email address")
    .trim(),
});

export type DoctorFormData = z.infer<typeof doctorFormSchema>;
