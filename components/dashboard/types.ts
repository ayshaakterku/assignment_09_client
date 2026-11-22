import type { LucideIcon } from "lucide-react";

export type DashboardRole = "student" | "tutor" | "admin";

export type DashboardUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  bio?: string | null;
  location?: string | null;
  plan?: string | null;
};

export type DashboardNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  group: "main" | "preferences";
};

/**
 * The stored role values are `tutor`, `guardian` (student) and `admin`.
 * Anything unknown (e.g. the default `seeker`) falls back to the student view.
 */
export function normalizeRole(role?: string | null): DashboardRole {
  if (role === "admin") return "admin";
  if (role === "tutor") return "tutor";
  return "student";
}

export const roleLabel: Record<DashboardRole, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
};
