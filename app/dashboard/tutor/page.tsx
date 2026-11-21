import { headers } from "next/headers";

import { getTutions } from "@/components/api-access/tutions";
import TutorPageClient from "@/components/dashboard/tutor-page-client";
import type { TuitionApplication } from "@/components/type/tution";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TutorDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  let tuitions: TuitionApplication[] = [];
  let tuitionsError: string | null = null;

  if (email) {
    try {
      // Only the signed-in tutor's own listings.
      tuitions = await getTutions(`tutorEmail=${encodeURIComponent(email)}`);
    } catch (error) {
      tuitionsError =
        error instanceof Error
          ? error.message
          : "Could not load your tuitions from the server.";
    }
  }

  return (
    <TutorPageClient tuitions={tuitions} tuitionsError={tuitionsError} />
  );
}
