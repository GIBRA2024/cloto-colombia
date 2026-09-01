import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Obtiene el usuario autenticado actual desde Supabase Auth.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Obtiene el perfil de la base de datos (Prisma) del usuario autenticado actual.
 */
export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      addresses: true,
    },
  });

  return profile;
}

/**
 * Verifica si el usuario actual tiene rol de Administrador o Staff.
 */
export async function isCurrentUserAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === "ADMIN" || profile?.role === "STAFF";
}
