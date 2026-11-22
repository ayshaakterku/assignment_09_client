"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  GraduationCap,
  LayoutGrid,
  MapPin,
  Search,
  Settings,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";

import type { StudentTuitionApplication } from "@/components/type/application";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DashboardShell, { type PreviewControls } from "./dashboard-shell";
import ProfileForm from "./profile-form";
import {
  PageHeading,
  Panel,
  PanelHeader,
  primaryButtonClass,
  StatCard,
  StatusBadge,
} from "./ui";
import type { DashboardNavItem, DashboardUser } from "./types";

const navItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid, group: "main" },
  { id: "applications", label: "My Applications", icon: FileText, group: "main" },
  { id: "saved", label: "Saved Tuitions", icon: Bookmark, group: "main" },
  { id: "profile", label: "Update Profile", icon: Settings, group: "preferences" },
];

function formatFee(value: number) {
  return `$${Number(value || 0).toLocaleString("en-US")}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const savedTuitions = [
  {
    title: "Mastering Advanced Mathematics for HSC & Admission",
    subject: "Mathematics",
    budget: "৳ 6,000 / month",
    location: "Dhanmondi, Dhaka",
  },
  {
    title: "Python Mastery: From Fundamentals to Data Science",
    subject: "Programming",
    budget: "৳ 8,500 / month",
    location: "Online",
  },
  {
    title: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    budget: "৳ 5,000 / month",
    location: "Uttara, Dhaka",
  },
];

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-purple-200">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-muted/50"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-muted/50"
    >
      {content}
    </button>
  );
}

export default function StudentDashboard({
  user,
  plan,
  onSignOut,
  preview,
  applications,
  applicationsError,
}: {
  user: DashboardUser;
  plan?: string | null;
  onSignOut: () => void;
  preview?: PreviewControls | null;
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
}) {
  const [active, setActive] = useState("overview");
  const firstName = user.name?.split(" ")[0] || "there";

  const planLabel = (plan || "free").toLowerCase();
  const isPro = planLabel !== "free";
  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;
  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;
  const acceptedRate = applications.length
    ? Math.round((acceptedCount / applications.length) * 100)
    : 0;

  return (
    <DashboardShell
      role="student"
      user={user}
      workspaceTitle="Student Workspace"
      navItems={navItems}
      active={active}
      onNavigate={setActive}
      onSignOut={onSignOut}
      preview={preview}
    >
      {active === "overview" ? (
        <>
          <PageHeading
            title={<>Welcome back, {firstName}! 👋</>}
            subtitle="Track your applied tuition applications, reviews, and learning journey."
            action={
              <Link href="/browse-tution" className={primaryButtonClass}>
                <Search className="size-4" />
                Browse Tuitions
              </Link>
            }
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Applied"
              value={applications.length}
              hint="Total tuition posts applied for."
              icon={FileText}
              tone="blue"
            />
            <StatCard
              label="Accepted"
              value={acceptedCount}
              hint={`${acceptedRate}% rate · Approved applications by tutors.`}
              icon={CheckCircle2}
              tone="emerald"
            />
            <StatCard
              label="Pending"
              value={pendingCount}
              hint="Awaiting tutor review and confirmation."
              icon={Clock}
              tone="amber"
            />
            <StatCard
              label="Current Plan"
              value={planLabel.toUpperCase()}
              hint={
                isPro
                  ? "Priority perks are active on your account."
                  : "Upgrade to Pro for priority perks."
              }
              icon={Crown}
              tone="fuchsia"
            />
          </div>

          <Panel className="mt-6 overflow-hidden">
            <PanelHeader
              title="Quick Actions"
              description="Shortcuts to the things you do most."
            />
            <div className="divide-y divide-border">
              <QuickAction
                icon={FileText}
                title="My Applications"
                description="Track and manage submissions"
                onClick={() => setActive("applications")}
              />
              <QuickAction
                icon={Bookmark}
                title="Saved Tuitions"
                description="Your bookmarked subjects"
                onClick={() => setActive("saved")}
              />
              <QuickAction
                icon={Search}
                title="Explore Mentors"
                description="Find experienced tutors"
                href="/browse-tution"
              />
              <div className="p-4">
                <div className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-purple-50 to-fuchsia-50 p-4 dark:from-purple-500/10 dark:to-fuchsia-500/10">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-600 dark:text-fuchsia-300" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Boost your success rate
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Keep your student profile and contact details up to date so
                      mentors can contact you quickly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </>
      ) : null}

      {active === "applications" ? (
        <>
          <PageHeading
            title="My Applications"
            subtitle="Every tuition application you have submitted, in one place."
            action={
              <Link href="/browse-tution" className={primaryButtonClass}>
                <Search className="size-4" />
                Browse Tuitions
              </Link>
            }
          />

          {applicationsError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load your applications
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                  {applicationsError}
                </p>
              </div>
            </Panel>
          ) : applications.length === 0 ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <FileText className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  No applications yet
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  Apply to a tuition and your application status will show up
                  here.
                </p>
                <Link
                  href="/browse-tution"
                  className={`${primaryButtonClass} mt-4`}
                >
                  <Search className="size-4" />
                  Browse Tuitions
                </Link>
              </div>
            </Panel>
          ) : (
            <Panel className="mt-6 overflow-hidden">
              <PanelHeader
                title="Application history"
                description="Track the status of each application."
              />
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-5">Tuition</TableHead>
                    <TableHead className="px-5">Tutor</TableHead>
                    <TableHead className="px-5">Applied on</TableHead>
                    <TableHead className="px-5">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell className="px-5 py-4">
                        <p className="max-w-xs truncate font-semibold text-foreground">
                          {application.tuitionTitle}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {application.subject}
                          <span className="ml-1.5">
                            · {formatFee(application.monthlyFee)}/mo
                          </span>
                        </p>
                        {application.studentNote ? (
                          <p
                            className="mt-1 max-w-xs truncate text-[11px] italic text-muted-foreground"
                            title={application.studentNote}
                          >
                            &ldquo;{application.studentNote}&rdquo;
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-muted-foreground">
                        {application.tutorEmail || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                        {formatDate(application.appliedAt)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>
          )}
        </>
      ) : null}

      {active === "saved" ? (
        <>
          <PageHeading
            title="Saved Tuitions"
            subtitle="Tuitions you bookmarked to review later."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedTuitions.map((tuition) => (
              <div
                key={tuition.title}
                className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-purple-200">
                  <Bookmark className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {tuition.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-300">
                  {tuition.subject}
                </p>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Wallet className="size-3.5" />
                    {tuition.budget}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {tuition.location}
                  </p>
                </div>
                <Link
                  href="/browse-tution"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                >
                  View details
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border bg-card p-5">
            <GraduationCap className="size-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Looking for more options?{" "}
              <Link
                href="/browse-tution"
                className="font-semibold text-purple-700 hover:underline dark:text-purple-300"
              >
                Browse all tuitions
              </Link>
              .
            </p>
          </div>
        </>
      ) : null}

      {active === "profile" ? <ProfileForm user={user} /> : null}
    </DashboardShell>
  );
}
