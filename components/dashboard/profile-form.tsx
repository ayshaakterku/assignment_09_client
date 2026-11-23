"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProfileEditor } from "@/components/profile-editor";
import { authClient } from "@/lib/auth-client";

import type { DashboardUser } from "./types";
import { PageHeading } from "./ui";

/**
 * "Update Profile" tab shared by the admin, tutor and student dashboards.
 * It renders the same editor as `/profile` and refreshes the session after a
 * successful save so the sidebar/header update immediately.
 */
export default function ProfileForm({ user }: { user: DashboardUser }) {
  const { data: session, refetch } = authClient.useSession();
  const current = session?.user ?? user;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        title="Update Profile"
        subtitle="Keep your personal details up to date so tutors and students can reach you."
        // this is duplcated form
        // action={
        //   <Link
        //     href="/dashboard/profile"
        //     className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:underline dark:text-purple-300"
        //   >
        //     Open full profile page
        //     <ArrowRight className="size-4" />
        //   </Link>
        // }
      />

      <div className="mt-6">
        <ProfileEditor
          user={current}
          onSaved={() => refetch()}
          showCancel={false}
        />
      </div>
    </div>
  );
}
