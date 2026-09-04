"use client";

import { useState } from "react";
import { Pencil, Trash2, Users, Plus } from "lucide-react";
import { Avatar } from "@/components/avatar";
import StatusBadge from "@/components/status-badge";
import EmployeeForm from "@/components/employee-form";
import DeleteDialog from "@/components/delete-dialog";
import SearchAndFilter from "@/components/search-filter";

export type EmployeeItem = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  avatarColor: string | null;
};

type DepartmentCount = { department: string; _count: { _all: number } };

export default function EmployeeDirectory({
  employees,
  departments,
}: {
  employees: EmployeeItem[];
  departments: DepartmentCount[];
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeItem | null>(null);
  const [deleting, setDeleting] = useState<EmployeeItem | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (emp: EmployeeItem) => {
    setEditing(emp);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <>
      <SearchAndFilter departments={departments} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="size-4" />
            <span className="font-medium text-slate-700">{employees.length}</span>
            {employees.length === 1 ? "employee" : "employees"}
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-200"
          >
            <Plus className="size-4" />
            Add employee
          </button>
        </div>

        {employees.length === 0 ? (
          <EmptyState
            hasFilters={departments.length > 0}
            onAdd={openCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/75 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="hidden px-5 py-3.5 md:table-cell">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={emp.name}
                          color={emp.avatarColor}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {emp.name}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {emp.department}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-sm text-slate-600 md:table-cell">
                      {emp.role}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(emp)}
                          className="rounded-lg p-2 text-slate-400 opacity-60 transition hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100"
                          aria-label={`Edit ${emp.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(emp)}
                          className="rounded-lg p-2 text-slate-400 opacity-60 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                          aria-label={`Delete ${emp.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <EmployeeForm
          mode={editing ? "edit" : "create"}
          employee={editing}
          onClose={handleFormClose}
        />
      )}

      <DeleteDialog employee={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}

function EmptyState({
  hasFilters,
  onAdd,
}: {
  hasFilters: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-50">
        <Users className="size-8 text-indigo-500" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-900">
        {hasFilters ? "No employees found" : "No employees yet"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by adding your first employee to the directory."}
      </p>
      {!hasFilters && (
        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <Plus className="size-4" />
          Add your first employee
        </button>
      )}
    </div>
  );
}
