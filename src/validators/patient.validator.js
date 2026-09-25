import { z } from "zod";

export const createPatientSchema = z.object({
  name: z
    .string({ required_error: "Patient name is required" })
    .trim()
    .min(1, "Patient name cannot be empty"),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be an integer")
    .min(0, "Age cannot be negative")
    .max(150, "Age cannot exceed 150")
    .optional(),
  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender must be either male, female, or other" }),
    })
    .optional(),
  condition: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email address format")
    .optional()
    .or(z.literal("")),
  visitDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "visitDate must be YYYY-MM-DD or ISO 8601"))
    .optional(),
});

export const updatePatientSchema = createPatientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export default {
  createPatientSchema,
  updatePatientSchema,
};
