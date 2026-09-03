import React from "react";
import { prisma } from "@/lib/prisma";
import { InventoryManagerClient } from "./InventoryManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    where: { isActive: true },
    orderBy: [{ stock: "asc" }, { sku: "asc" }],
    include: {
      product: {
        include: {
          images: { orderBy: { orderIndex: "asc" }, take: 1 },
        },
      },
    },
  });

  const formattedVariants = variants.map((v) => ({
    id: v.id,
    productId: v.productId,
    productName: v.product.name,
    productSlug: v.product.slug,
    imageUrl: v.product.images[0]?.url,
    sku: v.sku,
    variantName: v.name,
    size: v.size,
    color: v.color,
    price: Number(v.price),
    stock: v.stock,
  }));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif-title text-3xl text-stone-900">
          Control de Inventario & Stock en Vivo
        </h1>
        <p className="font-serif-body text-xs text-stone-500 mt-1">
          Ajusta existencias por talla y color al instante con alertas de stock crítico (&le; 5 unidades).
        </p>
      </div>

      <InventoryManagerClient initialVariants={formattedVariants} />
    </div>
  );
}
