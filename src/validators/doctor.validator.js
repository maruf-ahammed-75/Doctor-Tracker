import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z
    .string({ required_error: "Doctor name is required" })
    .trim()
    .min(1, "Doctor name cannot be empty"),
  specialization: z
    .string({ required_error: "Specialization is required" })
    .trim()
    .min(1, "Specialization cannot be empty"),
  hospital: z
    .string({ required_error: "Hospital name is required" })
    .trim()
    .min(1, "Hospital name cannot be empty"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(1, "Phone number cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email address format"),
});

export const updateDoctorSchema = createDoctorSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export default {
  createDoctorSchema,
  updateDoctorSchema,
};
