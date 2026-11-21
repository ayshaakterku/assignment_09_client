import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MentorLagbe",
  description:
    "Manage your tuitions, applications, transactions and account settings.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
