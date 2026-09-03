"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type NewsletterResponse = {
  success?: boolean;
  error?: string;
  couponCode?: string;
  isExisting?: boolean;
};

/**
 * Suscribe un correo al Newsletter / CRM
 */
export async function subscribeNewsletterAction(formData: FormData): Promise<NewsletterResponse> {
  try {
    const rawEmail = formData.get("email");
    if (!rawEmail || typeof rawEmail !== "string") {
      return { error: "Por favor ingresa un correo electrónico válido." };
    }

    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "El formato de correo no es válido." };
    }

    // Código de cupón oficial de bienvenida
    const welcomeCoupon = "CLOTO10";

    // 1. Asegurar que el cupón de bienvenida exista en la base de datos
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: welcomeCoupon },
    });

    if (!existingCoupon) {
      await prisma.coupon.create({
        data: {
          code: welcomeCoupon,
          description: "10% OFF en tu primera compra de bienvenida a Cloto",
          discountType: "PERCENTAGE",
          discountValue: 10,
          isActive: true,
        },
      });
    }

    // 2. Verificar si el correo ya existe
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // Si ya estaba registrado pero inactivo, lo reactivamos
      if (existingSubscriber.status !== "SUBSCRIBED") {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { status: "SUBSCRIBED" },
        });
      }

      return {
        success: true,
        isExisting: true,
        couponCode: welcomeCoupon,
      };
    }

    // 3. Crear nuevo registro en el CRM
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source: "FOOTER_NEWSLETTER",
        status: "SUBSCRIBED",
        discountSent: true,
        couponCode: welcomeCoupon,
      },
    });

    try {
      revalidatePath("/admin/clientes");
    } catch {
      // Ignorar fuera de contexto HTTP
    }

    return {
      success: true,
      couponCode: welcomeCoupon,
    };
  } catch (error: unknown) {
    console.error("Error al suscribir al newsletter:", error);
    return {
      error: "Ocurrió un inconveniente al procesar tu suscripción. Intenta nuevamente.",
    };
  }
}

/**
 * Obtener lista de suscriptores para el CRM
 */
export async function getSubscribersAction(query?: string, statusFilter?: string) {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {}),
        ...(query
          ? {
              OR: [
                { email: { contains: query, mode: "insensitive" } },
                { name: { contains: query, mode: "insensitive" } },
                { notes: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, subscribers };
  } catch (error: unknown) {
    console.error("Error al obtener suscriptores:", error);
    return { error: "No se pudieron cargar los contactos.", subscribers: [] };
  }
}

/**
 * Actualizar notas o estado de un suscriptor desde el CRM
 */
export async function updateSubscriberAction(
  id: string,
  data: {
    name?: string | null;
    status?: string;
    notes?: string | null;
  }
) {
  try {
    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name?.trim() || null } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
      },
    });

    try {
      revalidatePath("/admin/clientes");
    } catch {
      // Ignorar
    }

    return { success: true, subscriber: updated };
  } catch (error: unknown) {
    console.error("Error al actualizar suscriptor:", error);
    return { error: "No se pudo actualizar la información del contacto." };
  }
}

/**
 * Eliminar un contacto del CRM
 */
export async function deleteSubscriberAction(id: string) {
  try {
    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    try {
      revalidatePath("/admin/clientes");
    } catch {
      // Ignorar
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error al eliminar suscriptor:", error);
    return { error: "No se pudo eliminar el contacto." };
  }
}
