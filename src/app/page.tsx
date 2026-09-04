import { Suspense } from "react";
import { getEmployees } from "@/lib/actions";
import Header from "@/components/header";
import EmployeeDirectory from "@/components/employee-directory";

type SearchParams = Promise<{ q?: string; department?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { q, department } = await searchParams;
  const cleanQ = typeof q === "string" ? q : "";
  const cleanDept = typeof department === "string" ? department : "";

  const { employees, departments } = await getEmployees(cleanQ, cleanDept);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Employees
          </h2>
          <p className="text-sm text-slate-500">
            Browse, add, update, and manage your organization&apos;s team.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24 text-sm text-slate-400">
              Loading...
            </div>
          }
        >
          <EmployeeDirectory
            employees={employees}
            departments={departments}
          />
        </Suspense>
      </main>
    </div>
  );
}
