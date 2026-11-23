// "use client";

// import Link from "next/link";
// import { ArrowLeft, Loader2, UserRound } from "lucide-react";

// import {
//   ProfileEditor,
//   profilePrimaryButtonClass,
// } from "@/components/profile-editor";
// import { normalizeRole } from "@/components/dashboard/types";
// import { authClient } from "@/lib/auth-client";

// function ProfileLoading() {
//   return (
//     <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Loader2 className="size-4 animate-spin text-purple-700 dark:text-purple-300" />
//         Loading your profile…
//       </div>
//       <div className="mt-6 h-72 animate-pulse rounded-2xl border border-border bg-card" />
//     </div>
//   );
// }

// export default function DashboardProfilePage() {
//   const { data: session, isPending, refetch } = authClient.useSession();

//   if (isPending) return <ProfileLoading />;

//   if (!session?.user) {
//     return (
//       <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
//         <span className="flex size-14 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
//           <UserRound className="size-6" />
//         </span>
//         <h1 className="mt-4 text-xl font-extrabold text-foreground">
//           Sign in to view your profile
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           You need an account to update your personal details.
//         </p>
//         <Link href="/sign-in" className={`${profilePrimaryButtonClass} mt-5`}>
//           Sign in
//         </Link>
//       </div>
//     );
//   }

//   const role = normalizeRole(
//     (session.user as { role?: string | null }).role
//   );

//   return (
//     <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
//       <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
//         <div>
//           <p className="text-[11px] font-extrabold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-300">
//             Account settings
//           </p>
//           <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
//             Update Profile
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Update your photo, name, bio and contact details.
//           </p>
//         </div>
//         <Link
//           href={`/dashboard/${role}`}
//           className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:underline dark:text-purple-300"
//         >
//           <ArrowLeft className="size-4" />
//           Back to dashboard
//         </Link>
//       </div>

//       <ProfileEditor
//         key={session.user.id}
//         user={session.user}
//         onSaved={() => refetch()}
//       />
//     </div>
//   );
// }

import React from 'react';

const ProfilePage = () => {
  return (
    <div>
      Dashboard ProfilePage
    </div>
  );
};

export default ProfilePage;