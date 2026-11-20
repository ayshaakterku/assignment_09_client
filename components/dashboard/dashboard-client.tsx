"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

import AdminDashboard from "./admin-dashboard";
import StudentDashboard from "./student-dashboard";
import TutorDashboard from "./tutor-dashboard";
import { normalizeRole, type DashboardRole } from "./types";

function LoadingScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted/30">
      <Loader2 className="size-6 animate-spin text-purple-700 dark:text-purple-300" />
      <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
    </div>
  );
}

export default function DashboardClient() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [previewRole, setPreviewRole] = useState<DashboardRole | null>(null);

  const isSignedOut = !isPending && !session;

  useEffect(() => {
    if (isSignedOut) {
      router.replace("/sign-in");
    }
  }, [isSignedOut, router]);

  if (isPending || !session) {
    return <LoadingScreen />;
  }

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };

  // Dev-only role preview so all three workspaces can be reviewed with one
  // account. In production the role always comes from the session.
  const isDev = process.env.NODE_ENV === "development";
  const role = isDev && previewRole ? previewRole : normalizeRole(user.role);
  const preview = isDev ? { role, onChange: setPreviewRole } : null;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const common = {
    user: { name: user.name, email: user.email, image: user.image },
    onSignOut: handleSignOut,
    preview,
  };

  if (role === "admin") {
    return <AdminDashboard key="admin" {...common} />;
  }

  if (role === "tutor") {
    return <TutorDashboard key="tutor" {...common} />;
  }

  return <StudentDashboard key="student" {...common} />;
}
