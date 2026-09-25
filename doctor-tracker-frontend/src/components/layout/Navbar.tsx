"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface NavbarProps {
  title?: string;
  onToggleMobileMenu?: () => void;
}

export function Navbar({ title, onToggleMobileMenu }: NavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Helper to derive breadcrumb and page title from route
  const getPageInfo = () => {
    if (title) return { heading: title, section: title, path: [] };

    if (pathname === "/dashboard") {
      return {
        heading: "Clinical Overview",
        section: "Dashboard",
        path: [{ label: "Portal", href: "/dashboard" }, { label: "Analytics" }],
      };
    }
    if (pathname.startsWith("/doctors")) {
      const isSub = pathname !== "/doctors";
      return {
        heading: isSub ? "Doctor Details" : "Doctor Directory",
        section: "Doctors",
        path: [
          { label: "Directory", href: "/doctors" },
          ...(isSub ? [{ label: "Profile" }] : []),
        ],
      };
    }
    if (pathname.startsWith("/patients")) {
      const isSub = pathname !== "/patients";
      return {
        heading: isSub ? "Patient Details" : "Patient Registry",
        section: "Patients",
        path: [
          { label: "Registry", href: "/patients" },
          ...(isSub ? [{ label: "Profile" }] : []),
        ],
      };
    }

    return {
      heading: "Portal",
      section: "Management",
      path: [{ label: "Dashboard", href: "/dashboard" }],
    };
  };

  const pageInfo = getPageInfo();

  // Initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="h-16 sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shadow-2xs">
      {/* Left side: Hamburger button (mobile) + Breadcrumbs & Title */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Hamburger Menu (mobile only) */}
        <button
          type="button"
          id="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs & Title */}
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 font-medium"
          >
            <Link
              href="/dashboard"
              className="hover:text-teal-600 transition-colors"
            >
              Doctor Tracker
            </Link>
            {pageInfo.path.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-teal-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 font-semibold">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Heading */}
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {pageInfo.heading}
          </h1>
        </div>
      </div>

      {/* Right side: Status indicator + User details & Initials Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* System Online Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-medium">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <span>System Online</span>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                {user.email}
              </span>
            </div>

            {/* Initials Avatar */}
            <div
              className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-teal-600/20 select-none ring-2 ring-white"
              title={`${user.name} (${user.email})`}
            >
              {initials}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
