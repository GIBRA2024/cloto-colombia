import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminProductsClient } from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { orderIndex: "asc" }, take: 1 },
      variants: { where: { isActive: true } },
      categories: { include: { category: true } },
    },
  });

  const formattedProducts = products.map((p) => {
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      isPublished: p.isPublished,
      isFeatured: p.isFeatured,
      imageUrl: p.images[0]?.url,
      categoryNames: p.categories.map((c) => c.category.name),
      totalStock,
      variantsCount: p.variants.length,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Gestión de Productos & Galería
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Crea, edita fotos, ajusta precios de promoción y activa productos destacados en la Home.
        </p>
      </div>

      <AdminProductsClient initialProducts={formattedProducts} />
    </div>
  );
}
