"use client";

import React, { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type ProfileData = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
} | null;

interface AdminShellProps {
  profile: ProfileData;
  children: React.ReactNode;
}

export function AdminShell({ profile, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f8f7f4] font-sans-ui text-stone-900 antialiased selection:bg-[#b6a450]/20 selection:text-stone-900">
      {/* Sidebar Administrativo */}
      <AdminSidebar
        profile={profile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Contenedor Principal (Header + Contenido) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          profile={profile}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
