"use client";

import type { IPaymented } from "@/components/api-access/payment-information";
import type { ISavedTuitionApplication } from "@/components/api-access/saved";
import type { StudentTuitionApplication } from "@/components/type/application";

import StudentDashboard from "./student-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";

export default function StudentPageClient({
  applications,
  applicationsError,
  savedTuitions,
  savedError,
  payments,
  paymentsError,
}: {
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
  savedTuitions: ISavedTuitionApplication[];
  savedError?: string | null;
  payments: IPaymented[];
  paymentsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("student");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <StudentDashboard
      user={user}
      onSignOut={signOut}
      preview={preview}
      applications={applications}
      applicationsError={applicationsError}
      savedTuitions={savedTuitions}
      savedError={savedError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
