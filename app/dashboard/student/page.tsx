"use client";

import StudentDashboard from "@/components/dashboard/student-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "@/components/dashboard/use-dashboard-session";

export default function StudentDashboardPage() {
  const { user, isReady, signOut, preview } = useDashboardSession("student");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <StudentDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      onSignOut={signOut}
      preview={preview}
    />
  );
}
