"use client";

import { useState } from "react";
import {
  BookOpen,
  Crown,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

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

const users = [
  {
    name: "Nusrat Jahan",
    email: "student@mentorlagbe.com",
    role: "student",
    joined: "Oct 24, 2026",
    status: "active",
  },
  {
    name: "Karim Rahman",
    email: "tutor@mentorlagbe.com",
    role: "tutor",
    joined: "Oct 12, 2026",
    status: "active",
  },
  {
    name: "Sadia Islam",
    email: "sadia@student.com",
    role: "student",
    joined: "Oct 10, 2026",
    status: "active",
  },
  {
    name: "Admin User",
    email: "admin@mentorlagbe.com",
    role: "admin",
    joined: "Oct 01, 2026",
    status: "active",
  },
  {
    name: "Tanvir Hossain",
    email: "tanvir@student.com",
    role: "student",
    joined: "Sep 28, 2026",
    status: "suspended",
  },
];

const tuitions = [
  {
    title: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    tutor: "Karim Rahman",
    applicants: 14,
    budget: "৳ 5,000 / month",
    status: "active",
  },
  {
    title: "Mastering Advanced Mathematics for HSC & Admission",
    subject: "Mathematics",
    tutor: "Nusrat Jahan",
    applicants: 9,
    budget: "৳ 6,000 / month",
    status: "active",
  },
  {
    title: "Full-Stack JavaScript & MERN Stack Intensive",
    subject: "Web Development",
    tutor: "Isa Rahman",
    applicants: 6,
    budget: "৳ 9,000 / month",
    status: "active",
  },
  {
    title: "Python Mastery: From Fundamentals to Data Science",
    subject: "Programming",
    tutor: "Tanvir Hossain",
    applicants: 0,
    budget: "৳ 8,500 / month",
    status: "draft",
  },
];

export default function AdminDashboard({
  user,
  onSignOut,
  preview,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  preview?: PreviewControls | null;
}) {
  const [active, setActive] = useState("transactions");

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
            subtitle="Manage the students, tutors and admins on MentorLagbe."
          />

          <Panel className="mt-6 overflow-hidden">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-5">User</TableHead>
                  <TableHead className="px-5">Role</TableHead>
                  <TableHead className="px-5">Joined</TableHead>
                  <TableHead className="px-5">Status</TableHead>
                  <TableHead className="px-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((account) => (
                  <TableRow key={account.email}>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={account.name}
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
                    <TableCell className="px-5 py-4">
                      <RoleBadge role={normalizeRole(account.role)} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs text-muted-foreground">
                      {account.joined}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={account.status} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(
                            `User details for ${account.name} are not wired to the API yet.`
                          )
                        }
                        className="text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </>
      ) : null}

      {active === "tuitions" ? (
        <>
          <PageHeading
            title="Tuitions"
            subtitle="All tuition posts across the platform."
          />

          <Panel className="mt-6 overflow-hidden">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-5">Tuition</TableHead>
                  <TableHead className="px-5">Tutor</TableHead>
                  <TableHead className="px-5">Applicants</TableHead>
                  <TableHead className="px-5">Budget</TableHead>
                  <TableHead className="px-5">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tuitions.map((tuition) => (
                  <TableRow key={tuition.title}>
                    <TableCell className="px-5 py-4">
                      <p className="max-w-sm truncate font-semibold text-foreground">
                        {tuition.title}
                      </p>
                      <p className="text-xs font-medium text-fuchsia-600 dark:text-fuchsia-300">
                        {tuition.subject}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-muted-foreground">
                      {tuition.tutor}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-semibold text-foreground">
                      {tuition.applicants}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-muted-foreground">
                      {tuition.budget}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={tuition.status} />
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
