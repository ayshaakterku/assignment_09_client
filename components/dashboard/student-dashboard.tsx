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
} from "lucide-react";

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

const applications = [
  {
    id: "APP-1042",
    tuition: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    tutor: "Nusrat Jahan",
    applied: "Nov 05, 2026",
    status: "pending",
  },
  {
    id: "APP-1038",
    tuition: "IELTS Academic & General Training: Band 7.5+",
    subject: "IELTS Preparation",
    tutor: "Sadia Islam",
    applied: "Nov 04, 2026",
    status: "accepted",
  },
  {
    id: "APP-1031",
    tuition: "Full-Stack JavaScript & MERN Stack Intensive",
    subject: "Web Development",
    tutor: "Isa Rahman",
    applied: "Nov 01, 2026",
    status: "rejected",
  },
];

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
  onSignOut,
  preview,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  preview?: PreviewControls | null;
}) {
  const [active, setActive] = useState("overview");
  const firstName = user.name?.split(" ")[0] || "there";

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
              <Link href="/browse-tuitions" className={primaryButtonClass}>
                <Search className="size-4" />
                Browse Tuitions
              </Link>
            }
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Applied"
              value="3"
              hint="Total tuition posts applied for."
              icon={FileText}
              tone="blue"
            />
            <StatCard
              label="Accepted"
              value="1"
              hint="33% rate · Approved applications by tutors."
              icon={CheckCircle2}
              tone="emerald"
            />
            <StatCard
              label="Pending"
              value="1"
              hint="Awaiting tutor review and confirmation."
              icon={Clock}
              tone="amber"
            />
            <StatCard
              label="Current Plan"
              value="FREE"
              hint="Upgrade to Pro for priority perks."
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
                href="/browse-tuitions"
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
              <Link href="/browse-tuitions" className={primaryButtonClass}>
                <Search className="size-4" />
                Browse Tuitions
              </Link>
            }
          />

          <Panel className="mt-6 overflow-hidden">
            <PanelHeader
              title="Application history"
              description="Track the status of each application."
            />
            <Table>
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
                  <TableRow key={application.id}>
                    <TableCell className="px-5 py-4">
                      <p className="max-w-xs truncate font-semibold text-foreground">
                        {application.tuition}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {application.subject} · {application.id}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-muted-foreground">
                      {application.tutor}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-muted-foreground">
                      {application.applied}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
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
                  href="/browse-tuitions"
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
                href="/browse-tuitions"
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
