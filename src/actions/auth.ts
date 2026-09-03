"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthResponse = {
  error?: string;
  success?: boolean;
};

/**
 * Iniciar sesión con Email y Contraseña
 */
export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/";

  if (!email || !password) {
    return { error: "Por favor ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  let targetUrl = redirectTo;
  if (data?.user) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id: data.user.id },
        select: { role: true },
      });

      if (profile?.role === "ADMIN" || profile?.role === "STAFF") {
        targetUrl = redirectTo && redirectTo.startsWith("/admin") ? redirectTo : "/admin";
      }
    } catch (e) {
      console.error("Error al consultar rol de usuario en login:", e);
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  redirect(targetUrl);
}

/**
 * Registro de nuevo usuario (guarda metadata para el trigger de Profile)
 */
export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password) {
    return { error: "El correo y la contraseña son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName || "",
        last_name: lastName || "",
        phone: phone || "",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Actualizar Perfil de Usuario / Administrador
 */
export async function updateProfileAction(formData: FormData): Promise<AuthResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No autorizado. Inicia sesión para continuar." };
  }

  const firstName = (formData.get("firstName") as string) || "";
  const lastName = (formData.get("lastName") as string) || "";
  const phone = (formData.get("phone") as string) || "";

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        phone: phone.trim() || null,
      },
    });

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/perfil");
    revalidatePath("/cuenta");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "No se pudo actualizar el perfil." };
  }
}

/**
 * Cerrar sesión
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

