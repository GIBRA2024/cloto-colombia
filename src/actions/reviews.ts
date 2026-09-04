"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ReviewSubmitResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export type ProductReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
};

export type ProductReviewsData = {
  reviews: ProductReviewItem[];
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  hasUserReviewed?: boolean;
};

/**
 * Publica o actualiza la reseña de una clienta para un producto
 */
export async function submitReviewAction(formData: FormData): Promise<ReviewSubmitResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Debes iniciar sesión para publicar una reseña." };
  }

  const productId = formData.get("productId") as string;
  const ratingRaw = formData.get("rating") as string;
  const title = ((formData.get("title") as string) || "").trim() || null;
  const comment = ((formData.get("comment") as string) || "").trim();

  if (!productId) {
    return { error: "Producto no identificado." };
  }

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Por favor selecciona una calificación de 1 a 5 estrellas." };
  }

  if (!comment || comment.length < 5) {
    return { error: "Por favor escribe un comentario de al menos 5 caracteres sobre tu experiencia." };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    if (!product) {
      return { error: "El producto seleccionado no existe." };
    }

    // Verificar si el usuario compró previamente el producto en una orden confirmada/entregada
    const purchase = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId,
        },
        order: {
          profileId: user.id,
          status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
      },
      select: { id: true },
    });

    const isVerifiedPurchase = Boolean(purchase);

    await prisma.review.upsert({
      where: {
        productId_profileId: {
          productId,
          profileId: user.id,
        },
      },
      update: {
        rating,
        title,
        comment,
        isVerifiedPurchase,
        isApproved: true,
      },
      create: {
        productId,
        profileId: user.id,
        rating,
        title,
        comment,
        isVerifiedPurchase,
        isApproved: true,
      },
    });

    revalidatePath(`/producto/${product.slug}`);
    revalidatePath("/catalogo");

    return {
      success: true,
      message: "¡Gracias por compartir tu experiencia con la comunidad de Cloto!",
    };
  } catch (error) {
    console.error("Error al guardar reseña:", error);
    return { error: "Ocurrió un error al guardar tu reseña. Intenta nuevamente." };
  }
}

/**
 * Consulta las opiniones y estadísticas de calificaciones de un producto
 */
export async function getProductReviewsAction(productId: string): Promise<ProductReviewsData> {
  if (!productId) {
    return {
      reviews: [],
      averageRating: 5,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  try {
    const user = await getCurrentUser();

    const rawReviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalReviews = rawReviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    let hasUserReviewed = false;

    const reviews: ProductReviewItem[] = rawReviews.map((r) => {
      const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
      distribution[star]++;
      sum += r.rating;

      if (user && r.profileId === user.id) {
        hasUserReviewed = true;
      }

      const firstName = r.profile?.firstName?.trim();
      const lastNameInitial = r.profile?.lastName?.trim()
        ? `${r.profile.lastName.trim().charAt(0)}.`
        : "";
      const authorName = firstName
        ? `${firstName} ${lastNameInitial}`.trim()
        : "Clienta Cloto";

      return {
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
        authorName,
        authorAvatar: r.profile?.avatarUrl || null,
        createdAt: r.createdAt.toISOString(),
      };
    });

    const averageRating = totalReviews > 0 ? Number((sum / totalReviews).toFixed(1)) : 5;

    return {
      reviews,
      averageRating,
      totalReviews,
      distribution,
      hasUserReviewed,
    };
  } catch (error) {
    console.error("Error al obtener reseñas de producto:", error);
    return {
      reviews: [],
      averageRating: 5,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}
