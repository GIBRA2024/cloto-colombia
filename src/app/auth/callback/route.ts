import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectPath = searchParams.get("redirect") || "/cuenta";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Asegurar que el perfil exista en la base de datos de Prisma
      try {
        const existingProfile = await prisma.profile.findUnique({
          where: { id: data.user.id },
          select: { role: true },
        });

        if (!existingProfile) {
          const meta = data.user.user_metadata || {};
          const fullName = (meta.full_name || meta.name || "").trim();
          const parts = fullName ? fullName.split(" ") : [];
          const firstName = meta.first_name || parts[0] || "Cliente";
          const lastName = meta.last_name || parts.slice(1).join(" ") || "";

          await prisma.profile.create({
            data: {
              id: data.user.id,
              email: data.user.email || "",
              firstName: firstName || null,
              lastName: lastName || null,
              avatarUrl: meta.avatar_url || meta.picture || null,
              role: "CUSTOMER",
            },
          });
        } else if (existingProfile.role === "ADMIN" || existingProfile.role === "STAFF") {
          // Si el usuario es administrador y no viene con redirect específico
          if (!searchParams.get("redirect")) {
            return NextResponse.redirect(`${origin}/admin`);
          }
        }
      } catch (dbError) {
        console.error("Error sincronizando perfil OAuth en base de datos:", dbError);
      }

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // Si falló el intercambio de código
  return NextResponse.redirect(
    `${origin}/auth/login?error=${encodeURIComponent(
      "No se pudo completar el inicio de sesión con Google. Intenta nuevamente."
    )}`
  );
}
