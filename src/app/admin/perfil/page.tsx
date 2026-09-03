import React from "react";
import { getCurrentProfile, isCurrentUserAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProfileClient } from "./AdminProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi Perfil de Administrador | Cloto Colombia",
  description: "Gestión de perfil y sesión del administrador en Cloto Colombia.",
};

export default async function AdminProfilePage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect("/auth/login?redirect=/admin/perfil");
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth/login?redirect=/admin/perfil");
  }

  const serializedProfile = {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    role: profile.role,
    createdAt: profile.createdAt.toISOString(),
  };

  return <AdminProfileClient profile={serializedProfile} />;
}
