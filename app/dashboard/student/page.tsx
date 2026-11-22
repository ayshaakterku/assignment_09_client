import { headers } from "next/headers";

import { getCollectionByStudent } from "@/components/api-access/tutions";
import StudentPageClient from "@/components/dashboard/student-page-client";
import type { StudentTuitionApplication } from "@/components/type/application";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  let applications: StudentTuitionApplication[] = [];
  let applicationsError: string | null = null;

  if (email) {
    try {
      // Only the signed-in student's own applications.
      applications = await getCollectionByStudent(
        `studentEmail=${encodeURIComponent(email)}`
      );
    } catch (error) {
      applicationsError =
        error instanceof Error
          ? error.message
          : "Could not load your applications from the server.";
    }
  }

  return (
    <StudentPageClient
      applications={applications}
      applicationsError={applicationsError}
    />
  );
}
