import { z } from "zod";

export const STATUSES = ["Active", "On Leave", "Terminated"] as const;

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
] as const;

export const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
] as const;

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  role: z
    .string()
    .trim()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must be at most 100 characters"),
  status: z.enum(STATUSES, {
    message: "Please select a valid status",
  }),
  avatarColor: z.string().default("#6366f1"),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
