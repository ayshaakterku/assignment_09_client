import { headers } from "next/headers";

import { getPaymentInfo } from "@/components/api-access/payment-information";
import type { IPaymented } from "@/components/api-access/payment-information";
import { getCollectionByTutor, getTutions } from "@/components/api-access/tutions";
import TutorPageClient from "@/components/dashboard/tutor-page-client";
import type { StudentTuitionApplication } from "@/components/type/application";
import type { TuitionApplication } from "@/components/type/tution";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TutorDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  let tuitions: TuitionApplication[] = [];
  let tuitionsError: string | null = null;
  let applications: StudentTuitionApplication[] = [];
  let applicationsError: string | null = null;
  let payments: IPaymented[] = [];
  let paymentsError: string | null = null;

  if (email) {
    // Only the signed-in tutor's own listings and their applicants.
    const tutorQuery = `tutorEmail=${encodeURIComponent(email)}`;

    const [tuitionsResult, applicationsResult, paymentsResult] =
      await Promise.allSettled([
        getTutions(tutorQuery),
        getCollectionByTutor(tutorQuery),
        getPaymentInfo(),
      ]);

    if (tuitionsResult.status === "fulfilled") {
      tuitions = tuitionsResult.value;
    } else {
      tuitionsError =
        tuitionsResult.reason instanceof Error
          ? tuitionsResult.reason.message
          : "Could not load your tuitions from the server.";
    }

    if (applicationsResult.status === "fulfilled") {
      applications = applicationsResult.value;
    } else {
      applicationsError =
        applicationsResult.reason instanceof Error
          ? applicationsResult.reason.message
          : "Could not load your applicants from the server.";
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
    <TutorPageClient
      tuitions={tuitions}
      tuitionsError={tuitionsError}
      applications={applications}
      applicationsError={applicationsError}
      payments={payments}
      paymentsError={paymentsError}
    />
  );
}
