import { redirect } from "next/navigation";

/**
 * The dashboard is a single role-aware workspace at /dashboard, so this
 * placeholder route simply sends visitors there.
 */
export default function AdminUsersPage() {
  redirect("/dashboard");
}
