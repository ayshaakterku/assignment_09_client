"use client";

import AdminDashboard from "@/components/dashboard/admin-dashboard";
import {
  DashboardLoading,
  useDashboardSession,
} from "@/components/dashboard/use-dashboard-session";

export default function AdminDashboardPage() {
  const { user, isReady, signOut, preview } = useDashboardSession("admin");

  if (!isReady || !user) {
    return <DashboardLoading />;
  }

  return (
    <AdminDashboard
      user={{ name: user.name, email: user.email, image: user.image }}
      onSignOut={signOut}
      preview={preview}
    />
  );
}
