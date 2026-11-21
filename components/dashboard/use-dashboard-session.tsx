"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  normalizeRole,
  type DashboardRole,
  type DashboardUser,
} from "./types";

export function DashboardLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted/30">
      <Loader2 className="size-6 animate-spin text-purple-700 dark:text-purple-300" />
      <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
    </div>
  );
}

/**
 * Shared session handling for the role pages. It redirects signed-out visitors
 * to sign-in, keeps users inside their own role workspace in production, and
 * exposes the dev-only role preview used by the workspace header.
 */
export function useDashboardSession(role: DashboardRole) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";

  const actualRole = session
    ? normalizeRole((session.user as { role?: string | null }).role)
    : null;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (!isDev && actualRole && actualRole !== role) {
      router.replace(`/dashboard/${actualRole}`);
    }
  }, [isPending, session, actualRole, role, isDev, router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const preview = isDev
    ? {
        role,
        onChange: (next: DashboardRole) => router.push(`/dashboard/${next}`),
      }
    : null;

  return {
    user: session?.user as DashboardUser | undefined,
    isReady: !isPending && !!session && (isDev || actualRole === role),
    signOut: handleSignOut,
    preview,
  };
}
