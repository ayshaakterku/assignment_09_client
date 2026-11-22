"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Crown,
  Eye,
  Globe,
  LayoutGrid,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  deleteTutionData,
  updateApplicationStatus,
  updateTutionData,
  type ApplicationDecision,
  type TutionUpdate,
} from "@/components/api-update/tution-update";
import { updateTutorActiveStatus } from "@/components/api-update/tutor-update";
import type { StudentTuitionApplication } from "@/components/type/application";
import type { TuitionApplication } from "@/components/type/tution";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import DashboardShell, { type PreviewControls } from "./dashboard-shell";
import PostTuitionForm from "./post-tuition-form";
import ProfileForm from "./profile-form";
import {
  PageHeading,
  Panel,
  PanelHeader,
  StatCard,
  StatusBadge,
  UserAvatar,
} from "./ui";
import type { DashboardNavItem, DashboardUser } from "./types";

const navItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid, group: "main" },
  { id: "post", label: "Post Tuition", icon: Plus, group: "main" },
  { id: "tuitions", label: "My Tuitions", icon: BookOpen, group: "main" },
  { id: "applicants", label: "Applicants", icon: Users, group: "main" },
  { id: "profile", label: "Update Profile", icon: Settings, group: "preferences" },
];

const tutorControls = [
  {
    id: "post",
    title: "Post New Tuition",
    description: "Create a new course offering",
    icon: Plus,
    tone: "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  },
  {
    id: "tuitions",
    title: "My Tuitions",
    description: "Edit, activate, or delete posts",
    icon: BookOpen,
    tone: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    id: "applicants",
    title: "Manage Applicants",
    description: "Accept or reject students",
    icon: Users,
    tone: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  },
] as const;

function normalizeApproval(
  status: TuitionApplication["approvalStatus"]
): "pending" | "approved" | "rejected" {
  if (status === "accepted" || status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
}

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

export default function TutorDashboard({
  user,
  plan,
  onSignOut,
  preview,
  tuitions,
  tuitionsError,
  applications: initialApplications,
  applicationsError,
}: {
  user: DashboardUser;
  plan?: string | null;
  onSignOut: () => void;
  preview?: PreviewControls | null;
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  applications: StudentTuitionApplication[];
  applicationsError?: string | null;
}) {
  const [active, setActive] = useState("overview");
  const [applications, setApplications] =
    useState<StudentTuitionApplication[]>(initialApplications);
  const [items, setItems] = useState<TuitionApplication[]>(tuitions);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [applicantBusyId, setApplicantBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TuitionApplication | null>(null);
  const [viewing, setViewing] = useState<TuitionApplication | null>(null);
  const [deleting, setDeleting] = useState<TuitionApplication | null>(null);
  const [saving, setSaving] = useState(false);

  const planLabel = (plan || "free").toLowerCase();
  const isPro = planLabel !== "free";
  const activeApproved = items.filter(
    (tuition) =>
      tuition.isActive &&
      normalizeApproval(tuition.approvalStatus) === "approved"
  ).length;
  const pendingApplicants = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const respond = async (
    application: StudentTuitionApplication,
    status: ApplicationDecision
  ) => {
    if (applicantBusyId) return;

    setApplicantBusyId(application._id);

    try {
      await updateApplicationStatus(application._id, status);
      setApplications((current) =>
        current.map((item) =>
          item._id === application._id ? { ...item, status } : item
        )
      );
      toast.success(
        status === "accepted"
          ? "Applicant accepted successfully."
          : "Applicant rejected."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the application status."
      );
    } finally {
      setApplicantBusyId(null);
    }
  };

  const toggleActive = async (tuition: TuitionApplication) => {
    if (busyId) return;

    const next = !tuition.isActive;
    setBusyId(tuition._id);

    try {
      await updateTutorActiveStatus(tuition._id, next);
      setItems((current) =>
        current.map((item) =>
          item._id === tuition._id ? { ...item, isActive: next } : item
        )
      );
      toast.success(
        next ? "Tuition is now active." : "Tuition is now closed."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the active status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editing) return;

    const form = new FormData(event.currentTarget);

    const payload: TutionUpdate = {
      title: String(form.get("title") ?? "").trim(),
      subject: String(form.get("subject") ?? "").trim(),
      classLevel: String(form.get("classLevel") ?? "").trim(),
      mode: form.get("mode") === "Online" ? "Online" : "Offline",
      location: String(form.get("location") ?? "").trim(),
      monthlyFee: Number(form.get("monthlyFee") ?? 0),
      daysPerWeek: Number(form.get("daysPerWeek") ?? 0),
      description: String(form.get("description") ?? "").trim(),
    };

    if (!payload.title || !payload.subject) {
      toast.error("Title and subject are required.");
      return;
    }

    setSaving(true);

    try {
      await updateTutionData(editing._id, payload);
      setItems((current) =>
        current.map((item) =>
          item._id === editing._id ? { ...item, ...payload } : item
        )
      );
      toast.success("Tuition updated successfully.");
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the tuition."
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;

    const target = deleting;
    setBusyId(target._id);

    try {
      await deleteTutionData(target._id);
      setItems((current) =>
        current.filter((item) => item._id !== target._id)
      );
      toast.success("Tuition deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete the tuition."
      );
    } finally {
      setBusyId(null);
      setDeleting(null);
    }
  };

  const firstName = user.name?.split(" ")[0] || "Tutor";

  const postButton = (
    <button
      type="button"
      onClick={() => setActive("post")}
      className="inline-flex items-center gap-2 rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
    >
      <Plus className="size-4" />
      Post New Tuition
    </button>
  );

  return (
    <DashboardShell
      role="tutor"
      user={user}
      workspaceTitle="Tutor Workspace"
      navItems={navItems}
      active={active}
      onNavigate={setActive}
      onSignOut={onSignOut}
      preview={preview}
    >
      {active === "overview" ? (
        <>
          <PageHeading
            title="Tutor Dashboard"
            subtitle={`Welcome back, ${firstName}! Track your tuition listings and incoming student applicants.`}
            action={postButton}
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Tuitions"
              value={items.length}
              hint={isPro ? "Unlimited posts unlocked" : "Your created tuition listings"}
              icon={BookOpen}
              tone="purple"
            />
            <StatCard
              label="Active & Approved"
              value={activeApproved}
              hint="Publicly listed and accepting students"
              icon={Check}
              tone="emerald"
            />
            <StatCard
              label="Total Applicants"
              value={applications.length}
              hint={
                pendingApplicants > 0
                  ? `${pendingApplicants} awaiting your review`
                  : "Interested students across all posts"
              }
              icon={Users}
              tone="blue"
            />
            <StatCard
              label="Current Plan"
              value={planLabel.toUpperCase()}
              hint={
                isPro
                  ? "Priority listing in searches"
                  : "Upgrade to Pro for priority listing"
              }
              icon={Crown}
              tone="amber"
            />
          </div>

          <Panel className="mt-6 overflow-hidden">
            <PanelHeader
              title="Tutor Controls"
              description="Quick actions for your workspace."
            />
            <div className="divide-y divide-border">
              {tutorControls.map((control) => {
                const Icon = control.icon;

                return (
                  <button
                    key={control.id}
                    type="button"
                    onClick={() => setActive(control.id)}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-muted/50"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        control.tone
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {control.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {control.description}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </Panel>

          <div
            className={cn(
              "mt-6 flex items-start gap-3 rounded-xl border p-5",
              isPro
                ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : "border-border bg-card"
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                isPro
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              )}
            >
              <Crown className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                {isPro ? "Pro Member Active" : "Free Plan"}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {isPro
                  ? "You have unlimited tuition postings and a verified tutor badge enabled across the platform."
                  : "Upgrade to Pro for unlimited tuition postings, a verified tutor badge, and priority listing."}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {active === "tuitions" ? (
        <>
          <PageHeading
            title="My Tuitions"
            subtitle="Manage your created tuition listings, toggle availability, or make updates."
            action={postButton}
          />

          {tuitionsError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load your tuitions
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                  {tuitionsError}
                </p>
              </div>
            </Panel>
          ) : items.length === 0 ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <BookOpen className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  No tuitions yet
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  Create your first tuition listing so students can start
                  applying.
                </p>
                <button
                  type="button"
                  onClick={() => setActive("post")}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
                >
                  <Plus className="size-4" />
                  Post New Tuition
                </button>
              </div>
            </Panel>
          ) : (
            <Panel className="mt-6 overflow-hidden">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-4">Tuition</TableHead>
                    <TableHead className="px-4">Subject & Level</TableHead>
                    <TableHead className="px-4">Monthly Fee</TableHead>
                    <TableHead className="px-4">Approval Status</TableHead>
                    <TableHead className="px-4">Active Status</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((tuition) => {
                    const busy = busyId === tuition._id;

                    return (
                      <TableRow key={tuition._id}>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                              {tuition.bannerImage ? (
                                <Image
                                  src={tuition.bannerImage}
                                  alt=""
                                  fill
                                  unoptimized
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                                  <BookOpen className="size-4" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 max-w-[240px]">
                              <p
                                className="truncate font-semibold text-foreground"
                                title={tuition.title}
                              >
                                {tuition.title}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className="shrink-0 font-mono text-[10px] tracking-tight text-purple-700 dark:text-purple-300">
                                  {tuition.tutionId || "—"}
                                </span>
                                <span className="text-border">|</span>
                                {tuition.mode === "Online" ? (
                                  <Globe className="size-3 shrink-0" />
                                ) : (
                                  <MapPin className="size-3 shrink-0" />
                                )}
                                <span className="truncate">
                                  {tuition.mode === "Online"
                                    ? "Online"
                                    : tuition.location || "Offline"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <p className="max-w-[160px] truncate text-xs font-semibold text-purple-700 dark:text-purple-300">
                            {tuition.subject}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {tuition.classLevel || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="px-4 py-4 whitespace-nowrap font-bold text-foreground">
                          {formatFee(tuition.monthlyFee)}
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <StatusBadge
                            status={normalizeApproval(tuition.approvalStatus)}
                          />
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => toggleActive(tuition)}
                            disabled={busy}
                            aria-pressed={tuition.isActive}
                            title={
                              tuition.isActive
                                ? "Click to close this tuition"
                                : "Click to activate this tuition"
                            }
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-60",
                              tuition.isActive
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
                                : "bg-muted text-muted-foreground hover:bg-muted/70"
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                tuition.isActive
                                  ? "bg-emerald-500"
                                  : "bg-muted-foreground"
                              )}
                            />
                            {busy
                              ? "Updating..."
                              : tuition.isActive
                                ? "Active"
                                : "Closed"}
                          </button>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              aria-label="View tuition"
                              onClick={() => setViewing(tuition)}
                              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              type="button"
                              aria-label="Edit tuition"
                              onClick={() => setEditing(tuition)}
                              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              type="button"
                              aria-label="Delete tuition"
                              onClick={() => setDeleting(tuition)}
                              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-300"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Panel>
          )}
        </>
      ) : null}

      {active === "applicants" ? (
        <>
          <PageHeading
            title="Manage Applicants"
            subtitle="Review candidate applications submitted to your courses and approve or decline students."
          />

          {applicationsError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load your applicants
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
                  <Users className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  No applicants yet
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  Students who apply to your approved tuitions will appear here.
                </p>
              </div>
            </Panel>
          ) : (
            <Panel className="mt-6 overflow-hidden">
              <Table className="min-w-[1080px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-4">Student</TableHead>
                    <TableHead className="px-4">Contact Info</TableHead>
                    <TableHead className="px-4">Tuition Course</TableHead>
                    <TableHead className="px-4">Schedule</TableHead>
                    <TableHead className="px-4">Status</TableHead>
                    <TableHead className="px-4 text-right lg:sticky lg:right-0 lg:bg-muted lg:shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.18)]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => {
                    const busy = applicantBusyId === application._id;

                    return (
                      <TableRow key={application._id}>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={application.studentName}
                              className="size-9 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="whitespace-nowrap font-semibold text-foreground">
                                {application.studentName}
                              </p>
                              <p className="whitespace-nowrap text-xs text-muted-foreground">
                                Applied {formatDate(application.appliedAt)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
                            <Mail className="size-3.5 shrink-0" />
                            {application.studentEmail || "—"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
                            <Phone className="size-3.5 shrink-0" />
                            {application.studentPhone || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <p className="max-w-[240px] truncate font-medium text-foreground">
                            {application.tuitionTitle}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-300">
                            {application.subject}
                            <span className="ml-1.5 font-normal text-muted-foreground">
                              · {formatFee(application.monthlyFee)}/mo
                            </span>
                          </p>
                        </TableCell>

                        <TableCell className="px-4 py-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Clock className="size-3.5 shrink-0" />
                            {application.preferredSchedule || "Flexible timing"}
                          </span>
                          {application.studentNote ? (
                            <p
                              className="mt-1 max-w-[200px] truncate text-[11px] italic"
                              title={application.studentNote}
                            >
                              &ldquo;{application.studentNote}&rdquo;
                            </p>
                          ) : null}
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <StatusBadge status={application.status} />
                        </TableCell>

                        <TableCell className="px-4 py-4 lg:sticky lg:right-0 lg:bg-card lg:shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.18)]">
                          {application.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => respond(application, "accepted")}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Check className="size-3" />
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => respond(application, "rejected")}
                                disabled={busy}
                                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <X className="size-3" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <p className="text-right text-xs font-medium whitespace-nowrap text-muted-foreground italic">
                              {busy ? "Updating..." : "Responded"}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Panel>
          )}
        </>
      ) : null}

      {active === "post" ? (
        <>
          <PageHeading
            title="Post a Tuition"
            subtitle="Publish a new tuition so students in your area can apply."
          />

          <div className="mt-6">
            <PostTuitionForm
              user={user}
              onCreated={(created) => {
                setItems((current) => [created, ...current]);
                setActive("tuitions");
              }}
            />
          </div>
        </>
      ) : null}

      {active === "profile" ? <ProfileForm user={user} /> : null}

      {/* View tuition */}
      <Dialog
        open={!!viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {viewing ? (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{viewing.title}</DialogTitle>
                <DialogDescription>
                  {viewing.tutionId ? `${viewing.tutionId} · ` : ""}
                  {viewing.subject}
                  {viewing.classLevel ? ` · ${viewing.classLevel}` : ""}
                </DialogDescription>
              </DialogHeader>

              {viewing.bannerImage ? (
                <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={viewing.bannerImage}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 512px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Monthly fee</p>
                  <p className="mt-0.5 font-bold text-foreground">
                    {formatFee(viewing.monthlyFee)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Days per week</p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {viewing.daysPerWeek || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mode</p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {viewing.mode}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {viewing.location || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {formatDate(viewing.createdAt)}
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <StatusBadge
                    status={normalizeApproval(viewing.approvalStatus)}
                  />
                  <StatusBadge
                    status={viewing.isActive ? "active" : "closed"}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {viewing.description || "No description provided."}
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Edit tuition */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open && !saving) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          {editing ? (
            <form
              key={editing._id}
              onSubmit={handleEditSubmit}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Edit tuition</DialogTitle>
                <DialogDescription>
                  Update the details of your tuition listing.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editing.title}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-subject">Subject</Label>
                  <Input
                    id="edit-subject"
                    name="subject"
                    defaultValue={editing.subject}
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-class">Class / level</Label>
                  <Input
                    id="edit-class"
                    name="classLevel"
                    defaultValue={editing.classLevel}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-mode">Mode</Label>
                  <select
                    id="edit-mode"
                    name="mode"
                    defaultValue={editing.mode}
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={editing.location}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-fee">Monthly fee</Label>
                  <Input
                    id="edit-fee"
                    name="monthlyFee"
                    type="number"
                    min={0}
                    max={50000}
                    defaultValue={editing.monthlyFee}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-days">Days per week</Label>
                  <Input
                    id="edit-days"
                    name="daysPerWeek"
                    type="number"
                    min={0}
                    max={7}
                    defaultValue={editing.daysPerWeek}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    rows={4}
                    defaultValue={editing.description}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-800 text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete tuition */}
      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open && !busyId) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this tuition?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.title}&rdquo; will be permanently removed. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={!!busyId}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {busyId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
