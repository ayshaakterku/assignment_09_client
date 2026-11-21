"use client";

import AdminDashboard from "./admin-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";
import type { TuitionApplication } from "@/components/type/tution";
import type { IUser } from "@/components/type/user";

export default function AdminPageClient({
  tuitions,
  tuitionsError,
  users,
  usersError,
}: {
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  users: IUser[];
  usersError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("admin");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <AdminDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      onSignOut={signOut}
      preview={preview}
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      users={users}
      usersError={usersError}
    />
  );
}
