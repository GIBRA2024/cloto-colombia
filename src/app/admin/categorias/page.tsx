import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesAdminClient } from "./CategoriesAdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestor de Categorías | Cloto Admin",
};

export default async function AdminCategoriesPage() {
  // Consultar todas las líneas principales y sus subcategorías con conteo de productos
  const lines = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { orderIndex: "asc" },
    include: {
      _count: { select: { products: true } },
      children: {
        orderBy: { orderIndex: "asc" },
        include: {
          _count: { select: { products: true } },
        },
      },
    },
  });

  const serializedCategories = lines.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    parentId: l.parentId,
    description: l.description,
    orderIndex: l.orderIndex,
    isActive: l.isActive,
    productsCount: l._count.products,
    children: l.children.map((sub) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      parentId: sub.parentId,
      description: sub.description,
      orderIndex: sub.orderIndex,
      isActive: sub.isActive,
      productsCount: sub._count.products,
    })),
  }));

  return <CategoriesAdminClient initialCategories={serializedCategories} />;
}
