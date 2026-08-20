import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be atleast 2 characters long")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: z
      .string()
      .min(12, "Password must be atleast 12 characters long")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter",
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter",
      )
      .regex(
        /[0-9]/,
        "Password must contain at least one number",
      )
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

export type RegisterInput = z.infer<typeof registerSchema>["body"];