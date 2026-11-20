"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { toast } from "react-toastify";

import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/browse-tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const desktopLinkClass = (active: boolean) =>
  `block rounded-full px-4 py-2 text-sm font-semibold transition ${
    active
      ? "bg-purple-100 text-purple-950 dark:bg-white/20 dark:text-white"
      : "text-zinc-600 hover:bg-purple-50 hover:text-purple-900 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

const mobileLinkClass = (active: boolean) =>
  `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
    active
      ? "bg-purple-100 text-purple-950 dark:bg-white/20 dark:text-white"
      : "text-zinc-600 hover:bg-purple-50 hover:text-purple-900 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

const loginLinkClass =
  "inline-flex flex-1 items-center justify-center rounded-full border border-purple-300 px-4 py-2.5 text-sm font-semibold text-purple-900 transition hover:bg-purple-50 md:flex-none md:py-2 dark:border-white/70 dark:text-white dark:hover:bg-white/15";

const registerLinkClass =
  "inline-flex flex-1 items-center justify-center rounded-full bg-purple-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 md:flex-none md:py-2 dark:bg-white dark:text-purple-950 dark:hover:bg-pink-50";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Could not sign out. Please try again.");
        return;
      }

      setProfileOpen(false);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 text-zinc-900 backdrop-blur-md transition-shadow duration-300 dark:border-white/10 dark:bg-gradient-to-r dark:from-purple-950 dark:via-fuchsia-800 dark:to-purple-950 dark:text-white ${
        scrolled
          ? "shadow-lg shadow-zinc-900/10 dark:shadow-purple-950/40"
          : "shadow-sm"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-14" : "h-[72px]"
        }`}
      >
        {/* Left: Logo + brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo_bg_remove.png"
            alt="MentorLagbe logo"
            width={40}
            height={40}
            preload
            className={`w-auto rounded border border-zinc-200 object-contain p-1 transition-all duration-300 dark:border-white/80 ${
              scrolled ? "h-8" : "h-10"
            }`}
          />
          <span className="text-xl font-extrabold tracking-tight text-purple-950 dark:text-white">
            Mentor<span className="text-fuchsia-600 dark:text-pink-300">Lagbe</span>
          </span>
        </Link>

        {/* Middle: links (desktop) */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={desktopLinkClass(isActive(l.href))}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: theme + auth (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-zinc-200 dark:bg-white/20" />
          ) : user ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger
                aria-label="Open account menu"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-purple-950"
              >
                <Avatar size="lg">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image ?? undefined}
                    alt={user.name ?? "User avatar"}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-64">
                <PopoverHeader>
                  <PopoverTitle className="truncate">{user.name}</PopoverTitle>
                  <PopoverDescription className="truncate">
                    {user.email}
                  </PopoverDescription>
                </PopoverHeader>
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User className="size-4" />
                  Profile
                </Link>
                <Button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  variant="destructive"
                  className="mt-2 w-full"
                >
                  <LogOut className="size-4" />
                  {signingOut ? "Signing out..." : "Sign out"}
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href="/sign-in" className={loginLinkClass}>
                Login
              </Link>
              <Link href="/sign-up" className={registerLinkClass}>
                Register
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-purple-950 hover:bg-purple-100 lg:hidden dark:text-white dark:hover:bg-white/15"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-zinc-200 bg-white px-4 pt-3 pb-4 lg:hidden dark:border-white/20 dark:bg-purple-950/95">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass(isActive(l.href))}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-3 border-t border-zinc-200 pt-4 md:hidden dark:border-white/15">
            <ThemeToggle />
            {user ? (
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="size-4" />
                {signingOut ? "Signing out..." : "Sign out"}
              </Button>
            ) : (
              <div className="flex flex-1 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={loginLinkClass}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className={registerLinkClass}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
