"use client";

import { useActionState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createEmployee, updateEmployee, type ActionResult } from "@/lib/actions";
import {
  DEPARTMENTS,
  STATUSES,
  AVATAR_COLORS,
  type EmployeeInput,
} from "@/lib/validations";

type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  avatarColor: string | null;
};

type Mode = "create" | "edit";

const initialState: ActionResult = { success: false, message: "" };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
      {message}
    </p>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
  }`;

export default function EmployeeForm({
  mode,
  employee,
  onClose,
}: {
  mode: Mode;
  employee?: EmployeeRecord | null;
  onClose: () => void;
}) {
  const action = mode === "create" ? createEmployee : updateEmployee;
  const [state, formAction, pending] = useActionState(action, initialState);
  const closeRef = useRef<HTMLButtonElement>(null);

  const defaults: EmployeeInput = employee
    ? {
        name: employee.name,
        email: employee.email,
        department: employee.department,
        role: employee.role,
        status: employee.status as EmployeeInput["status"],
        avatarColor: employee.avatarColor ?? "#6366f1",
      }
    : {
        name: "",
        email: "",
        department: "",
        role: "",
        status: "Active",
        avatarColor: "#6366f1",
      };

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const err = (key: string) => state.errors?.[key]?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === "create" ? "Add Employee" : "Edit Employee"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "create"
                ? "Add a new member to your directory."
                : "Update the details of this employee."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form action={formAction} className="space-y-5 px-6 py-6" noValidate>
          {employee && (
            <input type="hidden" name="id" value={employee.id} />
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Priya Sharma"
              defaultValue={defaults.name}
              className={inputClass(!!err("name"))}
              autoComplete="off"
            />
            <FieldError message={err("name")} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. priya@company.com"
              defaultValue={defaults.email}
              className={inputClass(!!err("email"))}
              autoComplete="off"
            />
            <FieldError message={err("email")} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="department"
                className="text-sm font-medium text-slate-700"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                defaultValue={defaults.department || ""}
                className={inputClass(!!err("department"))}
              >
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <FieldError message={err("department")} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-sm font-medium text-slate-700">
                Role
              </label>
              <input
                id="role"
                name="role"
                placeholder="e.g. Software Engineer"
                defaultValue={defaults.role}
                className={inputClass(!!err("role"))}
                autoComplete="off"
              />
              <FieldError message={err("role")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Employment status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((status) => (
                <label key={status}>
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    defaultChecked={defaults.status === status}
                    className="peer sr-only"
                  />
                  <div className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-200">
                    {status}
                  </div>
                </label>
              ))}
            </div>
            <FieldError message={err("status")} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Avatar color
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((color) => (
                <label key={color} className="cursor-pointer">
                  <input
                    type="radio"
                    name="avatarColor"
                    value={color}
                    defaultChecked={defaults.avatarColor === color}
                    className="peer sr-only"
                  />
                  <span
                    className="block size-8 rounded-full ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-slate-400"
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
            </div>
          </div>

          {state.message && !state.success && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {state.message}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && (
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {mode === "create" ? "Add employee" : "Save changes"}
            </button>
          </div>
          <button ref={closeRef} type="button" className="hidden" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
}
