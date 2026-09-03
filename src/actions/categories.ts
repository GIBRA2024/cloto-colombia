"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success?: boolean;
  error?: string;
  category?: any;
};

/**
 * Función auxiliar para generar un slug limpio a partir de un nombre
 */
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Quitar caracteres especiales
    .replace(/[\s_-]+/g, "-") // Reemplazar espacios y guiones bajos por un solo guión
    .replace(/^-+|-+$/g, ""); // Quitar guiones al inicio o final
}

/**
 * Crear o actualizar una categoría
 */
export async function saveCategory(data: {
  id?: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  orderIndex?: number;
  isActive?: boolean;
}): Promise<ActionResponse> {
  try {
    const cleanName = data.name.trim();
    if (!cleanName) {
      return { error: "El nombre de la categoría es obligatorio." };
    }

    // Generar o limpiar slug
    let cleanSlug = data.slug ? slugify(data.slug) : slugify(cleanName);
    if (!cleanSlug) {
      cleanSlug = `cat-${Date.now()}`;
    }

    // Validar unicidad del slug si es nueva o si cambió
    const existing = await prisma.category.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing && existing.id !== data.id) {
      // Si el slug ya existe en otra categoría, agregar sufijo
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    let category;

    if (data.id) {
      // Actualizar categoría existente
      category = await prisma.category.update({
        where: { id: data.id },
        data: {
          name: cleanName,
          slug: cleanSlug,
          parentId: data.parentId || null,
          description: data.description?.trim() || null,
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        },
      });
    } else {
      // Crear nueva categoría
      category = await prisma.category.create({
        data: {
          name: cleanName,
          slug: cleanSlug,
          parentId: data.parentId || null,
          description: data.description?.trim() || null,
          orderIndex: data.orderIndex ?? 0,
          isActive: data.isActive ?? true,
        },
      });
    }

    // Revalidar rutas que usan categorías
    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/productos");
      revalidatePath("/admin/productos/nuevo");
      revalidatePath("/catalogo");
      revalidatePath("/");
    } catch {
      // Ignorar si se ejecuta fuera de contexto HTTP
    }

    return { success: true, category };
  } catch (error: unknown) {
    console.error("Error al guardar categoría:", error);
    return {
      error: error instanceof Error ? error.message : "Error al guardar la categoría.",
    };
  }
}

/**
 * Activar o desactivar una categoría
 */
export async function toggleCategoryActive(
  categoryId: string,
  currentStatus: boolean
): Promise<ActionResponse> {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: !currentStatus },
    });

    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/productos");
      revalidatePath("/catalogo");
      revalidatePath("/");
    } catch {
      // Ignorar fuera de contexto HTTP
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error al cambiar estado de categoría:", error);
    return {
      error: error instanceof Error ? error.message : "Error al cambiar estado.",
    };
  }
}

/**
 * Eliminar una categoría
 * Si tiene productos asociados, elimina las relaciones en product_categories
 * Si tiene subcategorías hijas, las desvincula (las pasa a huérfanas o se advierte)
 */
export async function deleteCategory(categoryId: string): Promise<ActionResponse> {
  try {
    // 1. Eliminar relaciones con productos
    await prisma.productCategory.deleteMany({
      where: { categoryId },
    });

    // 2. Si tiene subcategorías hijas, pasar su parentId a null
    await prisma.category.updateMany({
      where: { parentId: categoryId },
      data: { parentId: null },
    });

    // 3. Eliminar la categoría
    await prisma.category.delete({
      where: { id: categoryId },
    });

    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/productos");
      revalidatePath("/admin/productos/nuevo");
      revalidatePath("/catalogo");
      revalidatePath("/");
    } catch {
      // Ignorar fuera de contexto HTTP
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error al eliminar categoría:", error);
    return {
      error: error instanceof Error ? error.message : "Error al eliminar categoría.",
    };
  }
}
