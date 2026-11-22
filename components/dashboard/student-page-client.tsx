"use client";

import type { StudentTuitionApplication } from "@/components/type/application";

import StudentDashboard from "./student-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";

export default function StudentPageClient({
  applications,
  applicationsError,
}: {
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("student");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <StudentDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      plan={user.plan}
      onSignOut={signOut}
      preview={preview}
      applications={applications}
      applicationsError={applicationsError}
    />
  );
}
