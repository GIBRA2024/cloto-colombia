import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductFormClient } from "../../ProductFormClient";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      variants: { orderBy: { sku: "asc" } },
      categories: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    categoryIds: product.categories.map((c) => c.categoryId),
    images: product.images.map((img) => ({
      url: img.url,
      altText: img.altText || undefined,
      orderIndex: img.orderIndex,
      variantId: img.variantId,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      stock: v.stock,
      size: v.size || undefined,
      color: v.color || undefined,
      colorHex: v.colorHex || undefined,
      material: v.material || undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <ProductFormClient
        initialProduct={serializedProduct}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parentId: c.parentId,
        }))}
      />
    </div>
  );
}
