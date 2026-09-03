"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
};

/**
 * Toggle rápido de 'isFeatured' (Producto Destacado en Home)
 */
export async function toggleProductFeatured(
  productId: string,
  isFeatured: boolean
): Promise<ActionResponse> {
  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { isFeatured: !isFeatured },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error toggling product isFeatured:", error);
    return { error: error instanceof Error ? error.message : "Error al actualizar estado destacado" };
  }
}

/**
 * Toggle rápido de 'isPublished' (Producto Publicado / Borrador)
 */
export async function toggleProductPublished(
  productId: string,
  isPublished: boolean
): Promise<ActionResponse> {
  try {
    const updated = await prisma.product.update({
      where: { id: productId },
      data: { isPublished: !isPublished },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/");
    revalidatePath("/catalogo");
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error toggling product isPublished:", error);
    return { error: error instanceof Error ? error.message : "Error al actualizar estado publicado" };
  }
}

/**
 * Actualización rápida de stock de una variante específica
 */
export async function updateVariantStock(
  variantId: string,
  stock: number
): Promise<ActionResponse> {
  try {
    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Math.max(0, stock) },
      include: { product: true },
    });
    revalidatePath("/admin/inventario");
    revalidatePath(`/producto/${updated.product.slug}`);
    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("Error updating variant stock:", error);
    return { error: error instanceof Error ? error.message : "Error al actualizar stock" };
  }
}

/**
 * Actualización masiva de inventario (batch)
 */
export async function batchUpdateVariantStock(
  updates: { variantId: string; stock: number }[]
): Promise<ActionResponse> {
  try {
    await prisma.$transaction(
      updates.map((u) =>
        prisma.productVariant.update({
          where: { id: u.variantId },
          data: { stock: Math.max(0, u.stock) },
        })
      )
    );
    revalidatePath("/admin/inventario");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error batch updating stock:", error);
    return { error: error instanceof Error ? error.message : "Error en actualización masiva de inventario" };
  }
}

/**
 * Crear o editar un producto completo (con múltiples fotos y variantes)
 */
export async function saveProduct(data: {
  id?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  categoryIds: string[];
  images: { url: string; altText?: string; orderIndex: number; variantId?: string | null }[];
  variants: {
    id?: string;
    sku: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    size?: string;
    color?: string;
    colorHex?: string;
    material?: string;
  }[];
}): Promise<ActionResponse> {
  try {
    let product;

    if (data.id) {
      // 1. Actualizar producto existente
      product = await prisma.product.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug: data.slug,
          shortDescription: data.shortDescription,
          description: data.description,
          basePrice: data.basePrice,
          compareAtPrice: data.compareAtPrice || null,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
        },
      });

      // Actualizar categorías
      await prisma.productCategory.deleteMany({ where: { productId: data.id } });
      if (data.categoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: data.categoryIds.map((catId) => ({
            productId: data.id!,
            categoryId: catId,
          })),
        });
      }

      // Actualizar imágenes
      await prisma.productImage.deleteMany({ where: { productId: data.id } });
      if (data.images.length > 0) {
        await prisma.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId: data.id!,
            url: img.url,
            altText: img.altText || data.name,
            orderIndex: img.orderIndex ?? idx,
            variantId: img.variantId || null,
          })),
        });
      }

      // Actualizar o crear variantes
      for (const variant of data.variants) {
        if (variant.id) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              sku: variant.sku,
              name: variant.name,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice || null,
              stock: Math.max(0, variant.stock),
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              material: variant.material,
            },
          });
        } else {
          await prisma.productVariant.create({
            data: {
              productId: data.id,
              sku: variant.sku,
              name: variant.name,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice || null,
              stock: Math.max(0, variant.stock),
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              material: variant.material,
            },
          });
        }
      }
    } else {
      // 2. Crear nuevo producto
      product = await prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          shortDescription: data.shortDescription,
          description: data.description,
          basePrice: data.basePrice,
          compareAtPrice: data.compareAtPrice || null,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
          categories: {
            create: data.categoryIds.map((catId) => ({
              category: { connect: { id: catId } },
            })),
          },
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText || data.name,
              orderIndex: img.orderIndex ?? idx,
            })),
          },
          variants: {
            create: data.variants.map((v) => ({
              sku: v.sku,
              name: v.name,
              price: v.price,
              compareAtPrice: v.compareAtPrice || null,
              stock: Math.max(0, v.stock),
              size: v.size,
              color: v.color,
              colorHex: v.colorHex,
              material: v.material,
            })),
          },
        },
      });
    }

    revalidatePath("/admin/productos");
    revalidatePath("/admin/inventario");
    revalidatePath("/catalogo");
    revalidatePath(`/producto/${data.slug}`);
    revalidatePath("/");

    return { success: true, data: product };
  } catch (error: unknown) {
    console.error("Error saving product:", error);
    return { error: error instanceof Error ? error.message : "Error al guardar producto" };
  }
}

/**
 * Eliminar un producto
 */
export async function deleteProduct(productId: string): Promise<ActionResponse> {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath("/admin/productos");
    revalidatePath("/admin/inventario");
    revalidatePath("/catalogo");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return { error: error instanceof Error ? error.message : "Error al eliminar producto" };
  }
}
