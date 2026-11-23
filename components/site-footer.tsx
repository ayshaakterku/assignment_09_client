"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Mail, MapPin, ShieldCheck } from "lucide-react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayshaakter-ku/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

const resourceLinks = [
  { label: "Browse Tuitions", href: "/browse-tution" },
  { label: "Pricing & Plans", href: "/payment" },
  { label: "About Us", href: "/about" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Create Account", href: "/sign-up" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const linkClass =
  "text-sm text-zinc-600 transition-colors hover:text-fuchsia-600 dark:text-white/70 dark:hover:text-pink-300";

const headingClass =
  "text-base font-bold tracking-tight text-purple-950 dark:text-white";

function SocialIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path d={path} />
    </svg>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The dashboard has its own full-height workspace layout, so the marketing
  // footer is hidden there just like the marketing navbar.
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <footer className="border-t border-zinc-200 bg-white text-zinc-900 dark:border-white/10 dark:bg-gradient-to-br dark:from-purple-950 dark:via-fuchsia-950 dark:to-purple-950 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-8">
            {/* Brand */}
            <div className="max-w-md">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/logo_bg_remove.png"
                  alt="MentorLagbe logo"
                  width={40}
                  height={40}
                  className="h-11 w-auto rounded border border-zinc-200 object-contain p-1 dark:border-white/80"
                />
                <span className="text-xl font-extrabold tracking-tight text-purple-950 dark:text-white">
                  Mentor
                  <span className="text-fuchsia-600 dark:text-pink-300">
                    Lagbe
                  </span>
                </span>
              </Link>

              <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-white/70">
                MentorLagbe connects students, parents, and qualified tutors
                across Bangladesh. Find the right tutor or the right tuition —
                quickly, safely, and without the hassle.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`MentorLagbe on ${social.label}`}
                    title={social.label}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:border-pink-300/50 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <SocialIcon path={social.path} />
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className={headingClass}>Resources</h3>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className={headingClass}>Company</h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + payments */}
            <div>
              <h3 className={headingClass}>Get in Touch</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="mailto:support@mentorlagbe.com"
                    className={`inline-flex items-center gap-2 ${linkClass}`}
                  >
                    <Mail className="size-4 shrink-0" />
                    support@mentorlagbe.com
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-white/70">
                  <MapPin className="size-4 shrink-0" />
                  Dhaka, Bangladesh
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" />
                  <p className="text-sm font-semibold text-purple-950 dark:text-white">
                    Secure payments
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500 dark:text-white/60">
                  All card payments are processed securely by Stripe. We never
                  store your card details.
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-[#1a1f71] dark:border-white/15 dark:bg-white">
                      VISA
                    </span>
                    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-2 py-1 dark:border-white/15 dark:bg-white">
                      <span className="relative flex items-center">
                        <span className="size-3.5 rounded-full bg-[#eb001b]" />
                        <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b]" />
                      </span>
                    </span>
                    <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-[#2e77bc] dark:border-white/15 dark:bg-white">
                      AMEX
                    </span>
                  </div>

                  <span className="rounded-md bg-[#635bff] px-2 py-1 text-xs font-bold tracking-tight text-white lowercase">
                    stripe
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-white/60">
            <p>
              © {new Date().getFullYear()} MentorLagbe. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-fuchsia-600 dark:hover:text-pink-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed right-5 bottom-5 z-40 inline-flex size-11 items-center justify-center rounded-full bg-purple-800 text-white shadow-lg shadow-purple-900/25 transition hover:bg-purple-700 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-white dark:text-purple-950 dark:hover:bg-pink-50 ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  );
}
