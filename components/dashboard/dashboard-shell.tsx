"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

import { RoleBadge, UserAvatar } from "./ui";
import {
  roleLabel,
  type DashboardNavItem,
  type DashboardRole,
  type DashboardUser,
} from "./types";

export type PreviewControls = {
  role: DashboardRole;
  onChange: (role: DashboardRole) => void;
};

export default function DashboardShell({
  role,
  user,
  workspaceTitle,
  navItems,
  active,
  onNavigate,
  onSignOut,
  preview,
  children,
}: {
  role: DashboardRole;
  user: DashboardUser;
  workspaceTitle: string;
  navItems: DashboardNavItem[];
  active: string;
  onNavigate: (id: string) => void;
  onSignOut: () => void;
  preview?: PreviewControls | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const mainItems = navItems.filter((item) => item.group === "main");
  const prefItems = navItems.filter((item) => item.group === "preferences");

  const renderNavItem = (item: DashboardNavItem) => {
    const Icon = item.icon;
    const isActive = active === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onNavigate(item.id);
          setOpen(false);
        }}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
          isActive
            ? "bg-purple-100 text-purple-950 shadow-sm dark:bg-white/10 dark:text-white"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "size-4 shrink-0",
            isActive && "text-fuchsia-600 dark:text-pink-300"
          )}
        />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-svh bg-muted/30">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2" aria-label="MentorLagbe home">
            <Image
              src="/logo_bg_remove.png"
              alt="MentorLagbe logo"
              width={40}
              height={40}
              className="h-9 w-auto rounded border border-zinc-200 object-contain p-1 dark:border-white/80"
            />
            <span className="text-lg font-extrabold tracking-tight text-purple-950 dark:text-white">
              Mentor
              <span className="text-fuchsia-600 dark:text-pink-300">Lagbe</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* user card */}
        <div className="shrink-0 border-b border-border p-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-11"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {user.name || "MentorLagbe user"}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <RoleBadge role={role} />
                {role === "student" ? null : (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-amber-700 uppercase dark:bg-amber-500/15 dark:text-amber-300">
                    Pro
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Main Menu
          </p>
          <div className="flex flex-col gap-1">{mainItems.map(renderNavItem)}</div>

          {prefItems.length ? (
            <>
              <p className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Preferences
              </p>
              <div className="flex flex-col gap-1">
                {prefItems.map(renderNavItem)}
              </div>
            </>
          ) : null}
        </nav>

        <div className="shrink-0 border-t border-border p-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        {/* top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="truncate text-base font-bold text-foreground sm:text-lg">
              {workspaceTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {preview ? (
              <div className="hidden items-center gap-1 rounded-full border border-border bg-muted/50 p-0.5 lg:flex">
                <span className="px-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Preview
                </span>
                {(["student", "tutor", "admin"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => preview.onChange(item)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition",
                      preview.role === item
                        ? "bg-purple-800 text-white dark:bg-fuchsia-700"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {roleLabel[item]}
                  </button>
                ))}
              </div>
            ) : null}

            <ThemeToggle />

            <div className="hidden items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 sm:flex">
              <UserAvatar
                name={user.name}
                image={user.image}
                className="size-7"
              />
              <span className="max-w-32 truncate text-xs font-semibold text-foreground">
                {user.name || "Account"}
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100svh-4rem)] px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
