"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/NavBar";

/**
 * The marketing navbar is hidden on dashboard routes so the dashboard can use
 * its own full-height sidebar + workspace header. The navbar itself is
 * untouched everywhere else.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return <Navbar />;
}
