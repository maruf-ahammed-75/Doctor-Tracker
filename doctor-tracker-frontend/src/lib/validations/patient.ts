import { z } from "zod";

export const patientFormSchema = z.object({
  name: z
    .string()
    .min(1, "Patient full name is required")
    .trim(),
  age: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) >= 0 &&
          Number(val) <= 150),
      {
        message: "Age must be an integer between 0 and 150",
      }
    ),
  gender: z
    .enum(["male", "female", "other"])
    .optional()
    .or(z.literal("")),
  condition: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),
  visitDate: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
