import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const parentCategories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: { orderIndex: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return NextResponse.json(parentCategories);
  } catch (error) {
    console.error("Error al obtener categorías para navegación:", error);
    return NextResponse.json([], { status: 500 });
  }
}
