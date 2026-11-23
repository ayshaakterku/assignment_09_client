"use client";

import type { IPaymented } from "@/components/api-access/payment-information";
import type { StudentTuitionApplication } from "@/components/type/application";
import type { TuitionApplication } from "@/components/type/tution";

import TutorDashboard from "./tutor-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";

export default function TutorPageClient({
  tuitions,
  tuitionsError,
  applications,
  applicationsError,
  payments,
  paymentsError,
}: {
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
  payments: IPaymented[];
  paymentsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("tutor");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <TutorDashboard
      user={user}
      onSignOut={signOut}
      preview={preview}
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      applications={applications}
      applicationsError={applicationsError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
