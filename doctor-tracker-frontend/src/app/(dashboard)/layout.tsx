"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Responsive Sidebar (Fixed on Desktop, Slide-over on Mobile) */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area (Offset for desktop sidebar) */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0">
          {/* Top Navbar */}
          <Navbar
            onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
