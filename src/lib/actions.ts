"use server";

import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function mapErrors(
  errors: { path: (string | number | symbol)[]; message: string }[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const error of errors) {
    const key = String(error.path[0] ?? "form");
    (result[key] ??= []).push(error.message);
  }
  return result;
}

function toActionResponse(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    department: formData.get("department"),
    role: formData.get("role"),
    status: formData.get("status"),
    avatarColor: formData.get("avatarColor"),
  };
  const parsed = employeeSchema.safeParse(raw);
  return { raw, parsed };
}

export async function createEmployee(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { parsed } = toActionResponse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: mapErrors(parsed.error.issues),
    };
  }

  try {
    await prisma.employee.create({ data: parsed.data });
    revalidatePath("/");
    return { success: true, message: "Employee added successfully!" };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "An employee with this email already exists.",
        errors: { email: ["An employee with this email already exists."] },
      };
    }
    console.error("Create employee error:", error);
    return { success: false, message: "Failed to add employee." };
  }
}

export async function updateEmployee(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, message: "Missing employee id." };
  }

  const { parsed } = toActionResponse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: mapErrors(parsed.error.issues),
    };
  }

  try {
    const { avatarColor, ...data } = parsed.data;
    await prisma.employee.update({
      where: { id },
      data: { ...data, avatarColor: avatarColor || "#6366f1" },
    });
    revalidatePath("/");
    return { success: true, message: "Employee updated successfully!" };
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "An employee with this email already exists.",
        errors: { email: ["An employee with this email already exists."] },
      };
    }
    console.error("Update employee error:", error);
    return { success: false, message: "Failed to update employee." };
  }
}

export async function deleteEmployee(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { success: false, message: "Missing employee id." };
  }

  try {
    await prisma.employee.delete({ where: { id } });
    revalidatePath("/");
    return { success: true, message: "Employee removed successfully!" };
  } catch (error: unknown) {
    console.error("Delete employee error:", error);
    return { success: false, message: "Failed to remove employee." };
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function getEmployees(q?: string, department?: string) {
  const where: {
    OR?: { name: { contains: string; mode: "insensitive" } }[];
    department?: string;
  } = {};

  if (q) {
    where.OR = [{ name: { contains: q, mode: "insensitive" } }];
  }
  if (department) {
    where.department = department;
  }

  const employees = await prisma.employee.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const departments = await prisma.employee.groupBy({
    by: ["department"],
    _count: { _all: true },
    orderBy: { _count: { department: "desc" } },
  });

  return { employees, departments };
}
