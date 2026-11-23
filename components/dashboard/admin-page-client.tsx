"use client";

import AdminDashboard from "./admin-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";
import type { IPaymented } from "@/components/api-access/payment-information";
import type { TuitionApplication } from "@/components/type/tution";
import type { IUser } from "@/components/type/user";

export default function AdminPageClient({
  tuitions,
  tuitionsError,
  users,
  usersError,
  payments,
  paymentsError,
}: {
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  users: IUser[];
  usersError?: string | null;
  payments: IPaymented[];
  paymentsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("admin");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <AdminDashboard
      user={user}
      onSignOut={signOut}
      preview={preview}
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      users={users}
      usersError={usersError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
