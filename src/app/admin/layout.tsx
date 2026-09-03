import React from "react";
import { isCurrentUserAdmin, getCurrentProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de Administración | Cloto Colombia",
  description: "Administración de catálogo, inventario, pedidos y cupones.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    redirect("/auth/login?redirect=/admin");
  }

  const profile = await getCurrentProfile();

  const profileData = profile
    ? {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
      }
    : null;

  return <AdminShell profile={profileData}>{children}</AdminShell>;
}

