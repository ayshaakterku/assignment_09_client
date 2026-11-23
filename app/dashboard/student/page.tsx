import { headers } from "next/headers";

import { getPaymentInfo } from "@/components/api-access/payment-information";
import type { IPaymented } from "@/components/api-access/payment-information";
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
  let payments: IPaymented[] = [];
  let paymentsError: string | null = null;

  if (email) {
    // Only the signed-in student's own applications and saved tuitions.
    const studentQuery = `studentEmail=${encodeURIComponent(email)}`;

    const [applicationsResult, savedResult, paymentsResult] =
      await Promise.allSettled([
        getCollectionByStudent(studentQuery),
        getSavedItemsByEmail(studentQuery),
        getPaymentInfo(),
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

    if (paymentsResult.status === "fulfilled") {
      payments = paymentsResult.value;
    } else {
      paymentsError =
        paymentsResult.reason instanceof Error
          ? paymentsResult.reason.message
          : "Could not load your payment information from the server.";
    }
  }

  return (
    <StudentPageClient
      applications={applications}
      applicationsError={applicationsError}
      savedTuitions={savedTuitions}
      savedError={savedError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
