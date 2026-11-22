import { headers } from "next/headers";

import { getSavedItemsByEmail } from "@/components/api-access/saved";
import type { ISavedTuitionApplication } from "@/components/api-access/saved";
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
  let savedTuitions: ISavedTuitionApplication[] = [];
  let savedError: string | null = null;

  if (email) {
    // Only the signed-in student's own applications and saved tuitions.
    const studentQuery = `studentEmail=${encodeURIComponent(email)}`;

    const [applicationsResult, savedResult] = await Promise.allSettled([
      getCollectionByStudent(studentQuery),
      getSavedItemsByEmail(studentQuery),
    ]);

    if (applicationsResult.status === "fulfilled") {
      applications = applicationsResult.value;
    } else {
      applicationsError =
        applicationsResult.reason instanceof Error
          ? applicationsResult.reason.message
          : "Could not load your applications from the server.";
    }

    if (savedResult.status === "fulfilled") {
      savedTuitions = savedResult.value;
    } else {
      savedError =
        savedResult.reason instanceof Error
          ? savedResult.reason.message
          : "Could not load your saved tuitions from the server.";
    }
  }

  return (
    <StudentPageClient
      applications={applications}
      applicationsError={applicationsError}
      savedTuitions={savedTuitions}
      savedError={savedError}
    />
  );
}
