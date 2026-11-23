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
  Mail,
  Search,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  deleteSavedTution,
  type ISavedTuitionApplication,
} from "@/components/api-access/saved";
import type { IPaymented } from "@/components/api-access/payment-information";
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
  onSignOut,
  preview,
  applications,
  applicationsError,
  savedTuitions: initialSavedTuitions,
  savedError,
  payments,
  paymentsError,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  preview?: PreviewControls | null;
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
  savedTuitions: ISavedTuitionApplication[];
  savedError?: string | null;
  payments: IPaymented[];
  paymentsError?: string | null;
}) {
  const [active, setActive] = useState("overview");
  const [savedItems, setSavedItems] =
    useState<ISavedTuitionApplication[]>(initialSavedTuitions);
  const [savedBusyId, setSavedBusyId] = useState<string | null>(null);
  const firstName = user.name?.split(" ")[0] || "there";

  const removeSavedTuition = async (item: ISavedTuitionApplication) => {
    if (savedBusyId) return;

    setSavedBusyId(item._id);

    try {
      await deleteSavedTution(item._id, item.studentEmail);
      setSavedItems((current) =>
        current.filter((saved) => saved._id !== item._id)
      );
      toast.success("Removed from saved tuitions.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not remove the saved tuition."
      );
    } finally {
      setSavedBusyId(null);
    }
  };

  // The plan card reflects the server's payment records: a paid checkout whose
  // `userId` matches this account's id means Pro, anything else is Free.
  const isPro = payments.some(
    (payment) =>
      payment.userId === user.id &&
      (payment.payment_status || payment.status) === "paid"
  );
  const planLabel = isPro ? "pro" : "free";
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
      payments={payments}
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
                paymentsError
                  ? "Plan status could not be verified right now."
                  : isPro
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
                description={
                  savedItems.length
                    ? `${savedItems.length} bookmarked tuition${savedItems.length === 1 ? "" : "s"}`
                    : "Your bookmarked subjects"
                }
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
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground">
                <Bookmark className="size-3.5" />
                {savedItems.length} saved
              </span>
            }
          />

          {savedError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load your saved tuitions
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                  {savedError}
                </p>
              </div>
            </Panel>
          ) : savedItems.length === 0 ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <Bookmark className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  No saved tuitions yet
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  Bookmark a tuition from its details page and it will appear
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
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savedItems.map((tuition) => {
                const busy = savedBusyId === tuition._id;

                return (
                  <article
                    key={tuition._id}
                    className="relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md dark:hover:border-purple-500/40"
                  >
                    {/* Whole card is clickable; the delete button sits above it. */}
                    <Link
                      href="/browse-tution"
                      aria-label={`Open ${tuition.tuitionTitle}`}
                      className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    />

                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-purple-200">
                        <Bookmark className="size-4" />
                      </span>

                      <button
                        type="button"
                        onClick={() => removeSavedTuition(tuition)}
                        disabled={busy}
                        aria-label={`Remove ${tuition.tuitionTitle} from saved`}
                        className="rounded-md p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/15 dark:hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-sm font-bold text-foreground">
                      {tuition.tuitionTitle}
                    </h3>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        {tuition.subject}
                      </span>
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        {formatFee(tuition.monthlyFee)}
                        <span className="text-[10px] font-medium text-muted-foreground">
                          /mo
                        </span>
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="size-3.5 shrink-0" />
                        <span className="truncate">
                          {tuition.tutorEmail || "—"}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="size-3.5 shrink-0" />
                        Saved {formatDate(tuition.appliedAt)}
                      </p>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      View tuitions
                      <ArrowRight className="size-3.5" />
                    </span>
                  </article>
                );
              })}
            </div>
          )}

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
