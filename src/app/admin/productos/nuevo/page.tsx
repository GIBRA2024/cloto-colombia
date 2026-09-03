import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductFormClient } from "../ProductFormClient";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <ProductFormClient
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
