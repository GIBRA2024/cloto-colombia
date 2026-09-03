import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1 } },
  });

  if (!product) {
    return { title: "Producto no encontrado | Cloto Colombia" };
  }

  return {
    title: `${product.name} | Cloto Colombia`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      variants: { where: { isActive: true }, orderBy: { price: "asc" } },
      categories: { include: { category: true } },
    },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Obtener categoría principal para productos relacionados
  const firstCategoryId = product.categories[0]?.categoryId;

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isPublished: true,
      ...(firstCategoryId
        ? { categories: { some: { categoryId: firstCategoryId } } }
        : {}),
    },
    include: {
      images: { orderBy: { orderIndex: "asc" }, take: 1 },
    },
    take: 4,
  });

  // Serializar datos para el componente cliente
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
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
      size: v.size,
      color: v.color,
      colorHex: v.colorHex,
      material: v.material,
    })),
    relatedProducts: relatedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: Number(p.basePrice),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      images: p.images.map((img) => ({ url: img.url })),
    })),
  };

  return <ProductDetailClient product={serializedProduct} />;
}
