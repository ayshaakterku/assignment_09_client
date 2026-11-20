"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/browse-tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-gradient-to-r from-purple-950 via-fuchsia-700 to-purple-950 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-purple-950/40" : "shadow-sm"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-14" : "h-[72px]"
        }`}
      >
        {/* Left: Logo + brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo_bg_remove.png"
            alt="MentorLagbe logo"
            width={40}
            height={40}
            className={`w-auto border-white border-1 p-1 rounded object-contain transition-all duration-300 ${
              scrolled ? "h-8" : "h-10"
            }`}
            priority
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Mentor<span className="text-pink-300">Lagbe</span>
          </span>
        </Link>

        {/* Middle: links (desktop) */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive(l.href)
                    ? "bg-white/20 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: auth buttons (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-fuchsia-800"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-fuchsia-800 shadow-md transition hover:bg-pink-50 hover:shadow-lg"
          >
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/15 md:hidden"
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
        <div className="border-t border-white/20 bg-purple-950/95 px-4 pb-4 pt-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive(l.href)
                      ? "bg-white/20 text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-white/70 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-white hover:text-fuchsia-800"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-fuchsia-800 hover:bg-pink-50"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}