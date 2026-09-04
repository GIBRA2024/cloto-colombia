"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type WishlistToggleResponse = {
  success: boolean;
  inWishlist?: boolean;
  requireAuth?: boolean;
  message?: string;
};

/**
 * Alterna un producto en la lista de deseos del usuario en la base de datos
 */
export async function toggleWishlistAction(productId: string): Promise<WishlistToggleResponse> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      requireAuth: true,
      message: "Inicia sesión para sincronizar tus favoritos en tu cuenta.",
    };
  }

  try {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        profileId_productId: {
          profileId: user.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      revalidatePath("/cuenta/favoritos");
      return { success: true, inWishlist: false };
    } else {
      await prisma.wishlistItem.create({
        data: {
          profileId: user.id,
          productId,
        },
      });
      revalidatePath("/cuenta/favoritos");
      return { success: true, inWishlist: true };
    }
  } catch (error) {
    console.error("Error al modificar lista de deseos:", error);
    return { success: false, message: "No se pudo actualizar la lista de deseos." };
  }
}

/**
 * Obtiene los IDs de los productos en la lista de deseos del usuario autenticado
 */
export async function getUserWishlistIdsAction(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { profileId: user.id },
      select: { productId: true },
    });
    return items.map((i) => i.productId);
  } catch (error) {
    console.error("Error al obtener IDs de lista de deseos:", error);
    return [];
  }
}

/**
 * Obtiene los productos completos de la lista de deseos con imágenes y precios
 */
export async function getUserWishlistAction() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { profileId: user.id },
      include: {
        product: {
          include: {
            images: { orderBy: { orderIndex: "asc" } },
            variants: { where: { isActive: true }, orderBy: { price: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return items
      .filter((item) => item.product && item.product.isPublished)
      .map((item) => {
        const p = item.product;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          basePrice: Number(p.basePrice),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
          mainImage: p.images[0]?.url || "",
          variants: p.variants.map((v) => ({
            id: v.id,
            name: v.name,
            price: Number(v.price),
            stock: v.stock,
            size: v.size,
            color: v.color,
          })),
          addedAt: item.createdAt.toISOString(),
        };
      });
  } catch (error) {
    console.error("Error al obtener productos de lista de deseos:", error);
    return [];
  }
}

/**
 * Sincroniza productos guardados localmente cuando el usuario inicia sesión
 */
export async function syncLocalWishlistAction(productIds: string[]): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user || !productIds.length) return [];

  try {
    for (const productId of productIds) {
      try {
        await prisma.wishlistItem.upsert({
          where: {
            profileId_productId: {
              profileId: user.id,
              productId,
            },
          },
          update: {},
          create: {
            profileId: user.id,
            productId,
          },
        });
      } catch (err) {
        // Ignorar si el producto ya no existe
      }
    }

    // Retorna la lista total actualizada
    const updated = await prisma.wishlistItem.findMany({
      where: { profileId: user.id },
      select: { productId: true },
    });
    return updated.map((i) => i.productId);
  } catch (error) {
    console.error("Error al sincronizar lista de deseos local:", error);
    return [];
  }
}

/**
 * Obtiene información de productos por sus IDs para mostrar la lista de deseos
 */
export async function getProductsByIdsAction(productIds: string[]) {
  if (!productIds || !productIds.length) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isPublished: true,
      },
      include: {
        images: { orderBy: { orderIndex: "asc" } },
        variants: { where: { isActive: true }, orderBy: { price: "asc" } },
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      mainImage: p.images[0]?.url || "",
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        price: Number(v.price),
        stock: v.stock,
        size: v.size,
        color: v.color,
      })),
      addedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error al buscar productos por IDs:", error);
    return [];
  }
}

