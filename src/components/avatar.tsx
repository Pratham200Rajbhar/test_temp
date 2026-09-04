"use client";

const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

const AVATAR_TEXT: Record<string, string> = {
  "#6366f1": "text-indigo-600",
  "#8b5cf6": "text-violet-600",
  "#0ea5e9": "text-sky-600",
  "#10b981": "text-emerald-600",
  "#f59e0b": "text-amber-600",
  "#ef4444": "text-red-600",
  "#ec4899": "text-pink-600",
  "#14b8a6": "text-teal-600",
};

export function getAvatarInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarColor(name: string, fallback = "#6366f1"): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? fallback;
}

export function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const bg = color ?? getAvatarColor(name);
  const textClass = AVATAR_TEXT[bg] ?? "text-indigo-600";
  const sizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${textClass}`}
      style={{ backgroundColor: `${bg}20` }}
    >
      {getAvatarInitials(name)}
    </div>
  );
}
