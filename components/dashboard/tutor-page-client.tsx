"use client";

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
}: {
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("tutor");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <TutorDashboard
      user={user}
      plan={user.plan}
      onSignOut={signOut}
      preview={preview}
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      applications={applications}
      applicationsError={applicationsError}
    />
  );
}
