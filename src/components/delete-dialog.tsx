"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteEmployee, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { success: false, message: "" };

export default function DeleteDialog({
  employee,
  onClose,
}: {
  employee: { id: string; name: string } | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteEmployee, initialState);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (employee) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [employee, onClose]);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete employee?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-700">
                {employee.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {state.message && !state.success && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-6 flex justify-end gap-3">
          <input type="hidden" name="id" value={employee.id} />
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
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
            Delete employee
          </button>
        </form>
      </div>
    </div>
  );
}
