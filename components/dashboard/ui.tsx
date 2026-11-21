import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { roleLabel, type DashboardRole } from "./types";

export function initials(name?: string | null) {
  const value = (name ?? "").trim();
  if (!value) return "U";

  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserAvatar({
  name,
  image,
  className,
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-10", className)}>
      <AvatarImage src={image ?? undefined} alt={name ?? "User avatar"} />
      <AvatarFallback className="bg-gradient-to-br from-purple-700 to-fuchsia-600 text-xs font-bold text-white">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

const roleStyles: Record<DashboardRole, string> = {
  student:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  tutor:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  admin:
    "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
};

export function RoleBadge({
  role,
  className,
}: {
  role: DashboardRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        roleStyles[role],
        className
      )}
    >
      {roleLabel[role]}
    </span>
  );
}

const statusStyles: Record<string, string> = {
  accepted:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  approved:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rejected:
    "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  active:
    "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  draft: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
  verified:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  unverified:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  suspended:
    "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const statusDots: Record<string, string> = {
  accepted: "bg-emerald-500",
  approved: "bg-emerald-500",
  pending: "bg-amber-500",
  rejected: "bg-red-500",
  paid: "bg-emerald-500",
  active: "bg-purple-500",
  draft: "bg-muted-foreground",
  closed: "bg-muted-foreground",
  verified: "bg-emerald-500",
  unverified: "bg-amber-500",
  suspended: "bg-red-500",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        statusStyles[key] ?? statusStyles.draft
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          statusDots[key] ?? statusDots.draft
        )}
      />
      {label}
    </span>
  );
}

const toneStyles = {
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  fuchsia:
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "purple",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            toneStyles[tone]
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600 dark:focus-visible:ring-offset-background";

export const outlineButtonClass =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background";
