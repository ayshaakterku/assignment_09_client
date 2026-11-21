"use client";

import TutorDashboard from "./tutor-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "./use-dashboard-session";
import type { TuitionApplication } from "@/components/type/tution";

export default function TutorPageClient({
  tuitions,
  tuitionsError,
}: {
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
}) {
  const { user, isReady, signOut, preview } = useDashboardSession("tutor");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <TutorDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      plan={user.plan}
      onSignOut={signOut}
      preview={preview}
      tuitions={tuitions}
      tuitionsError={tuitionsError}
    />
  );
}
