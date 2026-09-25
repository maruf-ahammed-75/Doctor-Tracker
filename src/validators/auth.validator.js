import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email address format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"),
});

export default {
  loginSchema,
};
