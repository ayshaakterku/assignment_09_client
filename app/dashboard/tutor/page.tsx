"use client";

import TutorDashboard from "@/components/dashboard/tutor-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "@/components/dashboard/use-dashboard-session";

export default function TutorDashboardPage() {
  const { user, isReady, signOut, preview } = useDashboardSession("tutor");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <TutorDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      onSignOut={signOut}
      preview={preview}
    />
  );
}
