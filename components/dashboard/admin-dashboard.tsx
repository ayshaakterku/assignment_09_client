"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  Crown,
  Globe,
  LayoutGrid,
  MapPin,
  Phone,
  RotateCcw,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { updateTutionApprovalStatus } from "@/components/api-update/tution-update";
import type { TuitionApplication } from "@/components/type/tution";
import type { IUser } from "@/components/type/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import DashboardShell, { type PreviewControls } from "./dashboard-shell";
import ProfileForm from "./profile-form";
import {
  PageHeading,
  Panel,
  PanelHeader,
  RoleBadge,
  StatCard,
  StatusBadge,
  UserAvatar,
} from "./ui";
import {
  normalizeRole,
  type DashboardNavItem,
  type DashboardUser,
} from "./types";

const navItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid, group: "main" },
  { id: "users", label: "Users", icon: Users, group: "main" },
  { id: "tuitions", label: "Tuitions", icon: BookOpen, group: "main" },
  { id: "transactions", label: "Transactions", icon: Wallet, group: "main" },
  { id: "profile", label: "Update Profile", icon: Settings, group: "preferences" },
];

const transactions = [
  {
    id: "txn_mock_002",
    name: "Admin User",
    email: "admin@mentorlagbe.com",
    role: "admin",
    plan: "Pro Tutor Plan",
    amount: "$15",
    status: "paid",
    date: "Oct 31, 2026",
  },
  {
    id: "txn_mock_001",
    name: "Karim Rahman",
    email: "tutor@mentorlagbe.com",
    role: "tutor",
    plan: "Pro Tutor Plan",
    amount: "$15",
    status: "paid",
    date: "Oct 21, 2026",
  },
  {
    id: "txn_mock_000",
    name: "Sadia Islam",
    email: "sadia@student.com",
    role: "student",
    plan: "Pro Student Plan",
    amount: "$8",
    status: "paid",
    date: "Oct 18, 2026",
  },
];

type ModerationTab = "pending" | "approved" | "rejected" | "all";

const moderationTabs: { id: ModerationTab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All Tuitions" },
];

const tabStyles: Record<ModerationTab, { active: string; badge: string }> = {
  pending: {
    active:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  },
  approved: {
    active:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  rejected: {
    active:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300",
    badge: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  },
  all: {
    active:
      "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300",
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
  },
};

const emptyStates: Record<ModerationTab, { title: string; description: string }> = {
  pending: {
    title: "No pending tuitions",
    description:
      "All clear! There are no tuitions waiting for moderation right now.",
  },
  approved: {
    title: "No approved tuitions",
    description: "Tuitions you approve will appear here.",
  },
  rejected: {
    title: "No rejected tuitions",
    description: "Tuitions you reject will appear here.",
  },
  all: {
    title: "No tuitions yet",
    description: "Tuition listings submitted by tutors will appear here.",
  },
};

/** Maps the stored status onto the three moderation buckets. */
function normalizeApproval(
  status: TuitionApplication["approvalStatus"]
): Exclude<ModerationTab, "all"> {
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

export default function AdminDashboard({
  user,
  onSignOut,
  preview,
  tuitions,
  tuitionsError,
  users,
  usersError,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  preview?: PreviewControls | null;
  tuitions: TuitionApplication[];
  tuitionsError?: string | null;
  users: IUser[];
  usersError?: string | null;
}) {
  const [active, setActive] = useState("tuitions");
  const [statusFilter, setStatusFilter] = useState<ModerationTab>("pending");
  const [items, setItems] = useState<TuitionApplication[]>(tuitions);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const counts: Record<ModerationTab, number> = {
    pending: items.filter(
      (tuition) => normalizeApproval(tuition.approvalStatus) === "pending"
    ).length,
    approved: items.filter(
      (tuition) => normalizeApproval(tuition.approvalStatus) === "approved"
    ).length,
    rejected: items.filter(
      (tuition) => normalizeApproval(tuition.approvalStatus) === "rejected"
    ).length,
    all: items.length,
  };

  const visibleTuitions =
    statusFilter === "all"
      ? items
      : items.filter(
          (tuition) => normalizeApproval(tuition.approvalStatus) === statusFilter
        );

  // Newest accounts first; the API returns them in insertion order.
  const sortedUsers = [...users].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const moderate = async (
    tuition: TuitionApplication,
    next: "approved" | "rejected"
  ) => {
    if (updatingId) return;

    setUpdatingId(tuition._id);

    try {
      await updateTutionApprovalStatus(tuition._id, next);
      setItems((current) =>
        current.map((item) =>
          item._id === tuition._id
            ? {
                ...item,
                approvalStatus: next,
                // Mirrors the server: approving also reactivates the listing.
                isActive: next === "approved",
              }
            : item
        )
      );
      toast.success(
        next === "approved"
          ? `"${tuition.title}" approved successfully.`
          : `"${tuition.title}" rejected.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the tuition status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell
      role="admin"
      user={user}
      workspaceTitle="Platform Admin"
      navItems={navItems}
      active={active}
      onNavigate={setActive}
      onSignOut={onSignOut}
      preview={preview}
    >
      {active === "tuitions" ? (
        <>
          <PageHeading
            title="Tuition Moderation"
            subtitle="Review, approve, or reject tuition listings submitted by tutors before they become visible to students."
          />

          {/* Moderation tabs */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {moderationTabs.map((tab) => {
              const selected = statusFilter === tab.id;
              const styles = tabStyles[tab.id];

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                    selected
                      ? styles.active
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                      selected
                        ? styles.badge
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {counts[tab.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {tuitionsError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load tuitions
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                  {tuitionsError}
                </p>
              </div>
            </Panel>
          ) : visibleTuitions.length === 0 ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <BookOpen className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  {emptyStates[statusFilter].title}
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  {emptyStates[statusFilter].description}
                </p>
              </div>
            </Panel>
          ) : (
            <Panel className="mt-6 overflow-hidden">
              <Table className="min-w-[1050px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-4">Title</TableHead>
                    <TableHead className="px-4">Subject</TableHead>
                    <TableHead className="px-4">Tutor</TableHead>
                    <TableHead className="px-4">Monthly Fee</TableHead>
                    <TableHead className="px-4">Approval Status</TableHead>
                    <TableHead className="px-4">Active</TableHead>
                    <TableHead className="px-4">Created Date</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTuitions.map((tuition) => {
                    const status = normalizeApproval(tuition.approvalStatus);
                    const busy = updatingId === tuition._id;

                    return (
                      <TableRow key={tuition._id}>
                        <TableCell className="px-4 py-4">
                          <div className="max-w-[260px]">
                            <p
                              className="truncate font-semibold text-foreground"
                              title={tuition.title}
                            >
                              {tuition.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
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
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <span className="inline-flex max-w-[140px] items-center rounded-md bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                            {tuition.subject}
                          </span>
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <p className="whitespace-nowrap font-medium text-foreground">
                            {tuition.tutorName}
                          </p>
                          <p className="whitespace-nowrap text-[11px] text-muted-foreground">
                            {tuition.tutorEmail}
                          </p>
                        </TableCell>

                        <TableCell className="px-4 py-4 whitespace-nowrap font-bold text-foreground">
                          {formatFee(tuition.monthlyFee)}
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <StatusBadge status={status} />
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <StatusBadge
                            status={tuition.isActive ? "active" : "closed"}
                          />
                        </TableCell>

                        <TableCell className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                          {formatDate(tuition.createdAt)}
                        </TableCell>

                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {status === "pending" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => moderate(tuition, "approved")}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <Check className="size-3" />
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moderate(tuition, "rejected")}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  <X className="size-3" />
                                  Reject
                                </button>
                              </>
                            ) : status === "approved" ? (
                              <button
                                type="button"
                                onClick={() => moderate(tuition, "rejected")}
                                disabled={busy}
                                className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap text-red-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                              >
                                <X className="size-3.5" />
                                Revoke
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => moderate(tuition, "approved")}
                                disabled={busy}
                                className="inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap text-emerald-700 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300"
                              >
                                <RotateCcw className="size-3.5" />
                                Reinstate
                              </button>
                            )}
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

      {active === "overview" ? (
        <>
          <PageHeading
            title="Platform Overview"
            subtitle="A quick pulse on users, tuitions and subscription revenue."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Users"
              value="248"
              hint="Registered students, tutors and admins."
              icon={Users}
              tone="purple"
            />
            <StatCard
              label="Tutors"
              value="96"
              hint="Approved tutors on the platform."
              icon={ShieldCheck}
              tone="blue"
            />
            <StatCard
              label="Students"
              value="148"
              hint="Students actively looking for tuitions."
              icon={BookOpen}
              tone="fuchsia"
            />
            <StatCard
              label="Revenue"
              value="$1,240"
              hint="Total Pro plan revenue this quarter."
              icon={Wallet}
              tone="emerald"
            />
          </div>

          <Panel className="mt-6 overflow-hidden">
            <PanelHeader
              title="Recent transactions"
              description="Latest Pro subscription upgrades."
              action={
                <button
                  type="button"
                  onClick={() => setActive("transactions")}
                  className="text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                >
                  View all
                </button>
              }
            />
            <div className="divide-y divide-border">
              {transactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <UserAvatar name={transaction.name} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {transaction.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {transaction.plan}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {transaction.amount}
                  </span>
                  <StatusBadge status={transaction.status} />
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : null}

      {active === "users" ? (
        <>
          <PageHeading
            title="Users"
            subtitle="Registered students, tutors and admins on MentorLagbe."
            action={
              <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                {users.length} {users.length === 1 ? "user" : "users"}
              </span>
            }
          />

          {usersError ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
                  <X className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  Could not load users
                </p>
                <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
                  {usersError}
                </p>
              </div>
            </Panel>
          ) : sortedUsers.length === 0 ? (
            <Panel className="mt-6">
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  <Users className="size-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">
                  No users yet
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  Accounts created on MentorLagbe will appear here.
                </p>
              </div>
            </Panel>
          ) : (
            <Panel className="mt-6 overflow-hidden">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="px-4">User</TableHead>
                    <TableHead className="px-4">Role</TableHead>
                    <TableHead className="px-4">Plan</TableHead>
                    <TableHead className="px-4">Phone</TableHead>
                    <TableHead className="px-4">Joined</TableHead>
                    {/* <TableHead className="px-4">Status</TableHead> */}
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((account) => {
                    const plan = (account.plan || "free").toLowerCase();
                    const isPaid = plan !== "free";

                    return (
                      <TableRow key={account._id}>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={account.name}
                              image={account.image}
                              className="size-9 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">
                                {account.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {account.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <RoleBadge role={normalizeRole(account.role)} />
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                              isPaid
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isPaid && <Crown className="size-3" />}
                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="size-3.5 shrink-0" />
                            {account.phone || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                          {formatDate(account.createdAt)}
                        </TableCell>
                        {/* <TableCell className="px-4 py-4">
                          <StatusBadge
                            status={
                              account.emailVerified ? "verified" : "unverified"
                            }
                          />
                        </TableCell> */}
                        <TableCell className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              toast.info(
                                `${account.name} · ${account.role} · ${
                                  account.phone || "no phone"
                                } · ${account.bio || "no bio"}`
                              )
                            }
                            className="text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                          >
                            View
                          </button>
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

      {active === "transactions" ? (
        <>
          <PageHeading
            title="Transaction History"
            subtitle="Audit trail of Pro subscription upgrades processed through checkout."
          />

          <Panel className="mt-6 overflow-hidden">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-5">User</TableHead>
                  <TableHead className="px-5">Role</TableHead>
                  <TableHead className="px-5">Plan Purchased</TableHead>
                  <TableHead className="px-5">Amount</TableHead>
                  <TableHead className="px-5">Transaction ID</TableHead>
                  <TableHead className="px-5">Status</TableHead>
                  <TableHead className="px-5">Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={transaction.name}
                          className="size-9 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {transaction.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {transaction.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <RoleBadge role={normalizeRole(transaction.role)} />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Crown className="size-4 text-amber-500" />
                        {transaction.plan}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 font-bold text-foreground">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <code className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {transaction.id}
                      </code>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs text-muted-foreground">
                      {transaction.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </>
      ) : null}

      {active === "profile" ? <ProfileForm user={user} /> : null}
    </DashboardShell>
  );
}
