"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  Clock,
  FileText,
  LayoutGrid,
  Mail,
  Phone,
  Plus,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
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

import DashboardShell, { type PreviewControls } from "./dashboard-shell";
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

type ApplicantStatus = "accepted" | "pending" | "rejected";

type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  applied: string;
  course: string;
  subject: string;
  schedule: string;
  status: ApplicantStatus;
};

const navItems: DashboardNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid, group: "main" },
  { id: "post", label: "Post Tuition", icon: Plus, group: "main" },
  { id: "tuitions", label: "My Tuitions", icon: BookOpen, group: "main" },
  { id: "applicants", label: "Applicants", icon: Users, group: "main" },
  { id: "profile", label: "Update Profile", icon: Settings, group: "preferences" },
];

const initialApplicants: Applicant[] = [
  {
    id: 1,
    name: "Isa Rahman",
    email: "isa@gmail.com",
    phone: "01625887883",
    applied: "Nov 10, 2026",
    course: "Full-Stack JavaScript & MERN Stack Intensive",
    subject: "Web Development",
    schedule: "Flexible timing",
    status: "accepted",
  },
  {
    id: 2,
    name: "Tanvir Hossain",
    email: "tanvir@student.com",
    phone: "+880-1700-000006",
    applied: "Nov 7, 2026",
    course: "Python Mastery: From Fundamentals to Data Science",
    subject: "Programming (Python)",
    schedule: "Flexible timing",
    status: "pending",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    email: "student@mentorlagbe.com",
    phone: "+880-1700-000004",
    applied: "Nov 5, 2026",
    course: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    schedule: "Flexible timing",
    status: "pending",
  },
  {
    id: 4,
    name: "Sadia Islam",
    email: "sadia@student.com",
    phone: "+880-1700-000007",
    applied: "Nov 4, 2026",
    course: "IELTS Academic & General Training: Band 7.5+",
    subject: "IELTS Preparation",
    schedule: "Flexible timing",
    status: "accepted",
  },
  {
    id: 5,
    name: "Anika Rahman",
    email: "anika@student.com",
    phone: "+880-1700-000005",
    applied: "Nov 2, 2026",
    course: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    schedule: "Flexible timing",
    status: "accepted",
  },
  {
    id: 6,
    name: "Nusrat Jahan",
    email: "student@mentorlagbe.com",
    phone: "+880-1700-000004",
    applied: "Oct 31, 2026",
    course: "Mastering Advanced Mathematics for HSC & Admission",
    subject: "Mathematics",
    schedule: "Flexible timing",
    status: "accepted",
  },
  {
    id: 7,
    name: "Nusrat Jahan",
    email: "student@mentorlagbe.com",
    phone: "+880-1700-000004",
    applied: "Oct 26, 2026",
    course: "Modern Web Development with Next.js, React",
    subject: "Programming (Next.js)",
    schedule: "Flexible timing",
    status: "rejected",
  },
];

const myTuitions = [
  {
    title: "Complete SSC Physics: Concept Clearing & Notes",
    subject: "Physics",
    applicants: 14,
    budget: "৳ 5,000 / month",
    status: "active",
  },
  {
    title: "Mastering Advanced Mathematics for HSC & Admission",
    subject: "Mathematics",
    applicants: 9,
    budget: "৳ 6,000 / month",
    status: "active",
  },
  {
    title: "Python Mastery: From Fundamentals to Data Science",
    subject: "Programming",
    applicants: 0,
    budget: "৳ 8,500 / month",
    status: "draft",
  },
];

export default function TutorDashboard({
  user,
  onSignOut,
  preview,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  preview?: PreviewControls | null;
}) {
  const [active, setActive] = useState("applicants");
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [posting, setPosting] = useState(false);

  const accepted = applicants.filter((a) => a.status === "accepted").length;
  const pending = applicants.filter((a) => a.status === "pending").length;

  const respond = (id: number, status: ApplicantStatus) => {
    setApplicants((current) =>
      current.map((applicant) =>
        applicant.id === id ? { ...applicant, status } : applicant
      )
    );
    toast.success(
      status === "accepted"
        ? "Applicant accepted successfully."
        : "Applicant rejected."
    );
  };

  const handlePostTuition = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPosting(true);

    window.setTimeout(() => {
      setPosting(false);
      toast.success("Tuition posted successfully (demo).");
      setActive("tuitions");
    }, 600);
  };

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
      {active === "applicants" ? (
        <>
          <PageHeading
            title="Manage Applicants"
            subtitle="Review candidate applications submitted to your courses and approve or decline students."
          />

          <Panel className="mt-6 overflow-hidden">
            <Table className="min-w-[1000px]">
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
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={applicant.name}
                          className="size-9 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="whitespace-nowrap font-semibold text-foreground">
                            {applicant.name}
                          </p>
                          <p className="whitespace-nowrap text-xs text-muted-foreground">
                            Applied {applicant.applied}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
                        <Mail className="size-3.5 shrink-0" />
                        {applicant.email}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
                        <Phone className="size-3.5 shrink-0" />
                        {applicant.phone}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <p className="max-w-[240px] truncate font-medium text-foreground">
                        {applicant.course}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-300">
                        {applicant.subject}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 shrink-0" />
                        {applicant.schedule}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <StatusBadge status={applicant.status} />
                    </TableCell>
                    <TableCell className="px-4 py-4 lg:sticky lg:right-0 lg:bg-card lg:shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.18)]">
                      {applicant.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => respond(applicant.id, "accepted")}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-emerald-700"
                          >
                            <Check className="size-3" />
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => respond(applicant.id, "rejected")}
                            className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition hover:bg-red-700"
                          >
                            <X className="size-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <p className="text-right text-xs font-medium whitespace-nowrap text-muted-foreground italic">
                          Responded
                        </p>
                      )}
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
            title={`Welcome back, ${user.name?.split(" ")[0] || "Tutor"}!`}
            subtitle="Here is a quick look at your tuitions and applicant activity."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Active Tuitions"
              value={myTuitions.filter((t) => t.status === "active").length}
              hint="Tuitions currently accepting applications."
              icon={BookOpen}
              tone="purple"
            />
            <StatCard
              label="Total Applicants"
              value={applicants.length}
              hint="Students who applied to your tuitions."
              icon={Users}
              tone="blue"
            />
            <StatCard
              label="Accepted"
              value={accepted}
              hint="Applicants you approved."
              icon={Check}
              tone="emerald"
            />
            <StatCard
              label="Pending Review"
              value={pending}
              hint="Applications waiting for your response."
              icon={Clock}
              tone="amber"
            />
          </div>

          <Panel className="mt-6 overflow-hidden">
            <PanelHeader
              title="Recent applicants"
              description="The latest students who applied to your tuitions."
              action={
                <button
                  type="button"
                  onClick={() => setActive("applicants")}
                  className="text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                >
                  View all
                </button>
              }
            />
            <div className="divide-y divide-border">
              {applicants.slice(0, 4).map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <UserAvatar name={applicant.name} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {applicant.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {applicant.course}
                    </p>
                  </div>
                  <StatusBadge status={applicant.status} />
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : null}

      {active === "post" ? (
        <>
          <PageHeading
            title="Post a Tuition"
            subtitle="Publish a new tuition so students in your area can apply."
          />

          <Panel className="mt-6">
            <form onSubmit={handlePostTuition} className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tuition-title">Tuition title</Label>
                  <Input
                    id="tuition-title"
                    name="title"
                    required
                    placeholder="e.g. Complete SSC Physics: Concept Clearing & Notes"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tuition-subject">Subject</Label>
                  <Input
                    id="tuition-subject"
                    name="subject"
                    required
                    placeholder="Physics"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tuition-class">Class / level</Label>
                  <Input
                    id="tuition-class"
                    name="classLevel"
                    placeholder="Class 9 – 10"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tuition-budget">Monthly budget</Label>
                  <Input
                    id="tuition-budget"
                    name="budget"
                    placeholder="৳ 5,000"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tuition-location">Location</Label>
                  <Input
                    id="tuition-location"
                    name="location"
                    placeholder="Uttara, Dhaka"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tuition-schedule">Schedule</Label>
                  <Input
                    id="tuition-schedule"
                    name="schedule"
                    placeholder="Flexible timing"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tuition-description">Description</Label>
                  <Textarea
                    id="tuition-description"
                    name="description"
                    rows={4}
                    placeholder="Describe the tuition, requirements and what students can expect."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={posting}
                  className="h-10 rounded-lg bg-purple-800 px-5 font-semibold text-white hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
                >
                  {posting ? "Publishing..." : "Publish tuition"}
                </Button>
              </div>
            </form>
          </Panel>
        </>
      ) : null}

      {active === "tuitions" ? (
        <>
          <PageHeading
            title="My Tuitions"
            subtitle="Manage the tuitions you have posted."
            action={
              <button
                type="button"
                onClick={() => setActive("post")}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600"
              >
                <Plus className="size-4" />
                Post Tuition
              </button>
            }
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myTuitions.map((tuition) => (
              <div
                key={tuition.title}
                className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-purple-200">
                    <BookOpen className="size-4" />
                  </span>
                  <StatusBadge status={tuition.status} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {tuition.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-300">
                  {tuition.subject}
                </p>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {tuition.applicants} applicants
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Wallet className="size-3.5" />
                    {tuition.budget}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive("applicants")}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline dark:text-purple-300"
                >
                  <FileText className="size-3.5" />
                  View applicants
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {active === "profile" ? <ProfileForm user={user} /> : null}
    </DashboardShell>
  );
}
