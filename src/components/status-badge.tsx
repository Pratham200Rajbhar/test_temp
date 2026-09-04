"use client";

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "On Leave": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Terminated: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const STATUS_DOTS: Record<string, string> = {
  Active: "bg-emerald-500",
  "On Leave": "bg-amber-500",
  Terminated: "bg-rose-500",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Active;
  const dot = STATUS_DOTS[status] ?? STATUS_DOTS.Active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
