import type { Metadata } from "next";

import DashboardClient from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | MentorLagbe",
  description:
    "Manage your tuitions, applications, transactions and account settings.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
