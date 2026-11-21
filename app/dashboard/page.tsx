"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { DashboardLoading } from "@/components/dashboard/use-dashboard-session";
import { normalizeRole } from "@/components/dashboard/types";

/**
 * `/dashboard` is only an entry point. It sends the signed-in user to the
 * workspace that matches their role.
 */
export default function DashboardIndexPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    const role = normalizeRole(
      (session.user as { role?: string | null }).role
    );
    router.replace(`/dashboard/${role}`);
  }, [isPending, session, router]);

  return <DashboardLoading />;
}
